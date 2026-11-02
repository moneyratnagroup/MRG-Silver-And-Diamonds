import os
import re

target_dir = r"d:\Jwellery\MRG-Silver-And-Diamonds\mrgSD\frontend\src"

# Pattern to match backgroundColor inline styles in JSX
pattern = re.compile(r'(backgroundColor\s*:\s*[\'"])(white|#fff|#ffffff)([\'"])', re.IGNORECASE)

updated_count = 0

for root, dirs, files in os.walk(target_dir):
    if 'admin' in root.lower():
        continue
    for file in files:
        if file.endswith('.jsx') and 'admin' not in file.lower():
            filepath = os.path.join(root, file)
            with open(filepath, 'r', encoding='utf-8') as f:
                content = f.read()
            
            new_content = pattern.sub(r'\g<1>#f8f6f0\g<3>', content)
            
            if new_content != content:
                with open(filepath, 'w', encoding='utf-8') as f:
                    f.write(new_content)
                print(f"Updated {filepath}")
                updated_count += 1

print(f"Total inline JS files updated: {updated_count}")
