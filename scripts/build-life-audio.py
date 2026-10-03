"""Generate fixed life-learning clips using edge-tts. Existing clips are reused.
Requires Python 3.10+ and edge-tts (or the project's existing .tools/tts copy).
Run node scripts/collect-life-audio.mjs first. No keys or paid API are required.
"""
from pathlib import Path
import sys, json, hashlib, asyncio
ROOT = Path(__file__).resolve().parents[1]
sys.path.insert(0, str(ROOT / '.tools' / 'tts'))
import edge_tts
OUTPUT = ROOT / 'assets' / 'audio' / 'life'
OUTPUT.mkdir(parents=True, exist_ok=True)
requests = json.loads((ROOT / 'outputs/life-learning/audio-requests.json').read_text(encoding='utf-8'))
semaphore = asyncio.Semaphore(3)
manifest, failures = {}, []
done = 0
async def generate(request):
    global done
    text, voice = request['text'], request['voice']
    name = hashlib.sha256((voice + '\0' + text).encode()).hexdigest()[:20] + '.mp3'
    target = OUTPUT / name
    async with semaphore:
        for attempt in range(3):
            try:
                if not target.exists() or target.stat().st_size < 500:
                    temporary = target.with_suffix('.part')
                    await asyncio.wait_for(edge_tts.Communicate(text, voice, rate='-2%').save(str(temporary)), 35)
                    temporary.replace(target)
                manifest[text] = 'assets/audio/life/' + name
                break
            except Exception as error:
                if attempt == 2: failures.append({'text': text, 'error': str(error)[:180]})
                else: await asyncio.sleep(attempt + 1)
        done += 1
        if done % 20 == 0: print(f'{done}/{len(requests)} ready={len(manifest)} failed={len(failures)}', flush=True)
async def main():
    await asyncio.gather(*(generate(request) for request in requests))
    (ROOT / 'data/life-audio.js').write_text('export const LIFE_AUDIO=' + json.dumps(manifest,ensure_ascii=False) + ';\n', encoding='utf-8')
    (ROOT / 'outputs/life-learning/audio-report.json').write_text(json.dumps({'total':len(requests),'ready':len(manifest),'failures':failures},ensure_ascii=False,indent=2),encoding='utf-8')
    print(f'Life audio ready={len(manifest)}/{len(requests)}, failed={len(failures)}',flush=True)
    if failures: sys.exit(1)
asyncio.run(main())
