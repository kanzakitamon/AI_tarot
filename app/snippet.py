from pathlib import Path
lines = Path('read.tsx').read_text('utf-8').splitlines()
for i in range(320, 400):
    print(f"{i+1:04d}: {lines[i]}")
