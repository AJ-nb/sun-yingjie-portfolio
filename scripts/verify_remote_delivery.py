"""Compare a deployed Sites build with local release bytes; token is read only from stdin."""
from pathlib import Path
from datetime import datetime, timezone
from concurrent.futures import ThreadPoolExecutor
import argparse
import hashlib
import json
import re
import sys
import urllib.error
import urllib.request

parser = argparse.ArgumentParser(description=__doc__)
parser.add_argument('--build', type=Path, required=True)
parser.add_argument('--version', type=int, required=True)
parser.add_argument('--site-commit', required=True)
parser.add_argument('--output', type=Path, required=True)
parser.add_argument('--url', default='https://sun-yingjie-portfolio.ajhhq.chatgpt.site')
args = parser.parse_args()
secret = json.loads(sys.stdin.read()).get('token', '')

class NoRedirect(urllib.request.HTTPRedirectHandler):
    def redirect_request(self, req, fp, code, msg, headers, newurl):
        return None

def fetch(path, authorized):
    request = urllib.request.Request(args.url.rstrip('/') + path)
    if authorized and secret:
        request.add_header('OAI-Sites-Authorization', 'Bearer ' + secret)
    opener = urllib.request.build_opener(NoRedirect)
    try:
        with opener.open(request, timeout=120) as response:
            return response.status, response.read()
    except urllib.error.HTTPError as error:
        return error.code, b''

paths = ['/', '/media-index.json', '/models/avatar.glb', '/avatar/portrait.webp',
         '/downloads/sun-yingjie-selected-portfolio.pdf', '/downloads/sun-yingjie-resume.pdf']
paths += ['/assets/' + path.name for path in sorted((args.build / 'assets').iterdir()) if path.is_file()]
paths += ['/works/refinement-digital/xintiao/home-native.png', '/works/refinement-v2/plumber/three-quarter.webp']

def check(path):
    try:
        status, data = fetch(path, True)
        local = args.build / (path.lstrip('/') or 'index.html')
        digest = hashlib.sha256(data).hexdigest()
        byte_equal = status == 200 and digest == hashlib.sha256(local.read_bytes()).hexdigest()
        result = {'path': path, 'status': status, 'bytes': len(data), 'sha256': digest,
                  'byteEquality': byte_equal, 'matchesLocal': byte_equal}
        if path == '/' and status == 200 and not byte_equal:
            # Sites' CDN may inject this observed challenge script into otherwise identical HTML.
            # Preserve its presence in the report; exclude only this exact script family for comparison.
            remote_html, count = re.subn(r"<script>[^<]*?/cdn-cgi/challenge-platform/scripts/jsd/main\.js[^<]*?</script>", '', data.decode('utf-8'))
            normalize = lambda text: re.sub(r'>\s+<', '><', text.replace('\r\n', '\n')).strip()
            equivalent = count == 1 and normalize(remote_html) == normalize(local.read_text(encoding='utf-8'))
            result.update({'observedCdnChallengeScripts': count, 'htmlEquivalentExcludingCdnChallenge': equivalent,
                           'matchesLocal': equivalent, 'comparison': 'HTML whitespace normalization after removing only the observed Cloudflare challenge script; all other resources require exact bytes.'})
        return result
    except Exception as error:
        return {'path': path, 'status': None, 'matchesLocal': False, 'error': str(error).replace(secret, '[REDACTED]') if secret else str(error)}

with ThreadPoolExecutor(max_workers=3) as pool:
    checks = list(pool.map(check, paths))
anonymous = []
for path in ['/', '/downloads/sun-yingjie-selected-portfolio.pdf', '/downloads/sun-yingjie-resume.pdf']:
    status, data = fetch(path, False)
    anonymous.append({'path': path, 'status': status, 'bytes': len(data)})
report = {'verifiedAt': datetime.now(timezone.utc).isoformat(), 'url': args.url,
          'siteVersion': args.version, 'siteCommit': args.site_commit,
          'checks': checks, 'anonymousRequests': anonymous,
          'allAuthorizedChecksPassed': all(item['matchesLocal'] for item in checks),
          'allAnonymousRequestsPassed': all(item['status'] == 200 for item in anonymous),
          'browserVerification': 'Not performed for this remote release: Computer Use stopped by automatic safety review. Existing local browser QA is separate.'}
args.output.parent.mkdir(parents=True, exist_ok=True)
args.output.write_text(json.dumps(report, ensure_ascii=False, indent=2) + '\n', encoding='utf-8', newline='\n')
print(json.dumps({'checks': len(checks), 'authorizedPassed': report['allAuthorizedChecksPassed'], 'anonymousStatuses': [item['status'] for item in anonymous]}))
raise SystemExit(0 if report['allAuthorizedChecksPassed'] else 1)
