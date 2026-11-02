import os
import re

target_dir = r"d:\Jwellery\MRG-Silver-And-Diamonds\mrgSD\frontend\src"

pattern = re.compile(r'(background(-color)?\s*:\s*)(white|#fff|#ffffff)(?=[;\s\n}])', re.IGNORECASE)

updated_count = 0

for root, dirs, files in os.walk(target_dir):
    if 'admin' in root.lower():
        continue
    for file in files:
        if file.endswith('.css') and 'admin' not in file.lower():
            filepath = os.path.join(root, file)
            with open(filepath, 'r', encoding='utf-8') as f:
                content = f.read()
            
            # Use positive lookahead for the ending character to not consume it
            new_content = pattern.sub(r'\g<1>#f8f6f0', content)
            
            if new_content != content:
                with open(filepath, 'w', encoding='utf-8') as f:
                    f.write(new_content)
                print(f"Updated {filepath}")
                updated_count += 1

print(f"Total files updated: {updated_count}")
