from pathlib import Path
lines = Path('app/read.tsx').read_text(encoding='utf-8').splitlines()
start = next(i for i,line in enumerate(lines) if 'flowState.state === "result"' in line)
for offset in range(0, 120):
    print(f"{start+offset+1}: {lines[start+offset]}")
