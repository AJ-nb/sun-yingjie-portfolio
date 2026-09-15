"""Read-only OBJ import audit; execute with the blender-cli sealed evidence plan."""
from pathlib import Path
import argparse
import hashlib
import json
import math
import sys
import time
import bpy
import numpy as np

ROOT = Path(__file__).resolve().parents[2]
WORK = ROOT / '.production-runtime/model-worksets/huhu-geometry-check'
SOURCE = ROOT / '.production-runtime/model-worksets/huhu/儿童幽门螺杆菌检测仪/model/03rhino5.obj'
REPORT = ROOT / 'private/sources/refinement-v2/huhu-geometry-check.json'
parser = argparse.ArgumentParser()
parser.add_argument('--verify-existing', action='store_true')
args = parser.parse_args(sys.argv[sys.argv.index('--') + 1:] if '--' in sys.argv else [])
WORK.mkdir(parents=True, exist_ok=True)
REPORT.parent.mkdir(parents=True, exist_ok=True)

def sha256(path):
    with path.open('rb') as handle:
        return hashlib.file_digest(handle, 'sha256').hexdigest()

def source_audit():
    counts = {'v': 0, 'f': 0, 'o': 0, 'g': 0, 'vn': 0, 'vt': 0}
    minimum = [math.inf] * 3
    maximum = [-math.inf] * 3
    nonfinite = 0
    materials = []
    with SOURCE.open('r', encoding='utf8', errors='replace') as handle:
        for line in handle:
            key, _, value = line.strip().partition(' ')
            if key in counts:
                counts[key] += 1
            if key == 'v':
                coordinate = [float(x) for x in value.split()[:3]]
                if len(coordinate) != 3 or not all(math.isfinite(x) for x in coordinate):
                    nonfinite += 1
                else:
                    minimum = [min(a, b) for a, b in zip(minimum, coordinate)]
                    maximum = [max(a, b) for a, b in zip(maximum, coordinate)]
            elif key == 'mtllib':
                materials.append({'reference': value, 'exists_beside_obj': (SOURCE.parent / value).is_file()})
    return {'record_counts': counts, 'coordinate_min': minimum, 'coordinate_max': maximum,
            'coordinate_dimensions': [b-a for a, b in zip(minimum, maximum)],
            'nonfinite_vertex_records': nonfinite, 'material_libraries': materials}

def scene_audit():
    rows = []
    for obj in bpy.data.objects:
        row = {'name': obj.name, 'type': obj.type}
        if obj.type == 'MESH':
            mesh = obj.data
            vertex_count = len(mesh.vertices)
            polygon_count = len(mesh.polygons)
            coordinates = np.empty(vertex_count * 3, dtype=np.float64)
            mesh.vertices.foreach_get('co', coordinates)
            coordinates = coordinates.reshape((-1, 3))
            matrix = np.asarray([list(row) for row in obj.matrix_world], dtype=np.float64)
            world = coordinates @ matrix[:3, :3].T + matrix[:3, 3]
            local_box = [list(corner) for corner in obj.bound_box]
            nonfinite = int(np.count_nonzero(~np.isfinite(world)))
            minimum = world.min(axis=0).tolist() if vertex_count and not nonfinite else None
            maximum = world.max(axis=0).tolist() if vertex_count and not nonfinite else None
            row.update({'vertices': vertex_count, 'faces': polygon_count,
                        'nonfinite_coordinate_components': nonfinite,
                        'world_coordinate_min': minimum, 'world_coordinate_max': maximum,
                        'world_dimensions': [b-a for a,b in zip(minimum,maximum)] if minimum else None,
                        'object_space_bound_box': local_box, 'matrix_world': matrix.tolist()})
        rows.append(row)
    meshes = [row for row in rows if row['type'] == 'MESH']
    finite = all(row['nonfinite_coordinate_components'] == 0 for row in meshes)
    valid_meshes = [row for row in meshes if row['vertices'] and row['world_coordinate_min']]
    minimum = [min(row['world_coordinate_min'][axis] for row in valid_meshes) for axis in range(3)] if valid_meshes else None
    maximum = [max(row['world_coordinate_max'][axis] for row in valid_meshes) for axis in range(3)] if valid_meshes else None
    return {'object_count': len(rows), 'mesh_objects': len(meshes),
            'vertices': sum(row['vertices'] for row in meshes),
            'faces': sum(row['faces'] for row in meshes), 'all_coordinates_finite': finite,
            'world_coordinate_min': minimum, 'world_coordinate_max': maximum,
            'world_dimensions': [b-a for a,b in zip(minimum,maximum)] if minimum else None,
            'objects': rows}

started = time.perf_counter()
if args.verify_existing:
    result = scene_audit()
    previous = json.loads(REPORT.read_text(encoding='utf8'))
    fields = ('object_count', 'mesh_objects', 'vertices', 'faces', 'world_coordinate_min', 'world_coordinate_max')
    matches = {key: result[key] == previous['imported_geometry'][key] for key in fields}
    record = {'passed': all(matches.values()) and result['all_coordinates_finite'], 'matches': matches,
              'blender_version': bpy.app.version_string, 'elapsed_seconds': time.perf_counter()-started}
    (WORK / 'reopen.json').write_text(json.dumps(record, indent=2), encoding='utf8')
    previous['fresh_reopen'] = record
    previous['passed'] = previous['passed'] and record['passed']
    REPORT.write_text(json.dumps(previous, ensure_ascii=False, indent=2), encoding='utf8')
    print(json.dumps(record))
    assert record['passed']
else:
    before_hash = sha256(SOURCE)
    source_data = source_audit()
    for obj in list(bpy.data.objects):
        bpy.data.objects.remove(obj, do_unlink=True)
    imported = bpy.ops.wm.obj_import(filepath=str(SOURCE), global_scale=1.0, clamp_size=0.0,
                                    forward_axis='NEGATIVE_Z', up_axis='Y',
                                    use_split_objects=True, use_split_groups=False, validate_meshes=True)
    assert 'FINISHED' in imported
    result = scene_audit()
    output_blend = WORK / 'huhu-imported.blend'
    saved = bpy.ops.wm.save_as_mainfile(filepath=str(output_blend), compress=True)
    assert 'FINISHED' in saved
    after_hash = sha256(SOURCE)
    passed = (before_hash == after_hash and source_data['nonfinite_vertex_records'] == 0
              and result['all_coordinates_finite'] and result['vertices'] > 0 and result['faces'] > 0)
    report = {'source': SOURCE.relative_to(ROOT).as_posix(), 'source_bytes': SOURCE.stat().st_size,
              'source_sha256_before': before_hash, 'source_sha256_after': after_hash,
              'source_unchanged': before_hash == after_hash, 'source_text_audit': source_data,
              'blender_version': bpy.app.version_string,
              'import_settings': {'global_scale': 1.0, 'clamp_size': 0.0, 'forward_axis': 'NEGATIVE_Z',
                                  'up_axis': 'Y', 'use_split_objects': True, 'validate_meshes': True},
              'units': 'Source OBJ coordinates; physical unit and intended orientation not established',
              'imported_geometry': result, 'local_blend': output_blend.relative_to(ROOT).as_posix(),
              'local_blend_bytes': output_blend.stat().st_size, 'passed': passed,
              'limitations': ['OBJ fallback only; original C4D not inspected by this check',
                             'Import success and finite coordinates do not establish manufacturability, watertightness or physical scale',
                             'Material fidelity and source textures not yet visually validated'],
              'elapsed_seconds': time.perf_counter()-started}
    REPORT.write_text(json.dumps(report, ensure_ascii=False, indent=2), encoding='utf8')
    print(json.dumps({key: value for key, value in report.items() if key not in ('imported_geometry','source_text_audit')}, ensure_ascii=False))
    print(json.dumps({key: value for key, value in result.items() if key != 'objects'}))
    assert passed
