# Third-Party Notices

This project redistributes open-source software. Exact resolved versions are recorded in `package-lock.json`.

## FreeCAD PlaneGCS WASM wrapper

- Package: `@salusoft89/planegcs` 1.2.0
- License: LGPL-2.0-or-later as declared by the npm package; the bundled license text is GNU LGPL 2.1
- Source: https://github.com/Salusoft89/planegcs
- Package metadata: https://www.npmjs.com/package/@salusoft89/planegcs/v/1.2.0
- Bundled binary: `planegcs.wasm`, emitted as an independent Vite asset
- License copy: `public/licenses/planegcs-LGPL-2.1.txt`

The application loads PlaneGCS as a separately emitted WASM resource in a Web Worker. The upstream package and corresponding source link are provided so recipients can inspect or replace the library. No local modifications were made to the PlaneGCS package or WASM binary.

## Runtime libraries

| Package | Resolved version | License |
| --- | ---: | --- |
| React / React DOM | 19.2.8 | MIT |
| Paper.js | 0.12.18 | MIT |
| Zustand | 5.0.15 | MIT |
| Zod | 4.4.3 | MIT |
| idb | 8.0.3 | ISC |
| lucide-react | 1.31.0 | ISC |
| IBM Plex Sans / Mono via Fontsource | 5.3.0 | SIL Open Font License 1.1 |

Development and test dependencies are recorded in `package-lock.json` and retain their upstream notices.
