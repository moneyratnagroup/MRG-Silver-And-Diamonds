import os
import re

target_dir = r"d:\Jwellery\MRG-Silver-And-Diamonds\mrgSD\frontend\src"

pattern = re.compile(r'(background(-color)?\s*:\s*)(#fdfbf7|#fafafa|#fdfdfd|#fcfcfc|#f5f5f5)(?=[;\s\n}])', re.IGNORECASE)
inline_pattern = re.compile(r'(backgroundColor\s*:\s*[\'"])(#fdfbf7|#fafafa|#fdfdfd|#fcfcfc|#f5f5f5)([\'"])', re.IGNORECASE)

updated_count = 0

for root, dirs, files in os.walk(target_dir):
    if 'admin' in root.lower():
        continue
    for file in files:
        if (file.endswith('.css') or file.endswith('.jsx')) and 'admin' not in file.lower():
            filepath = os.path.join(root, file)
            with open(filepath, 'r', encoding='utf-8') as f:
                content = f.read()
            
            new_content = pattern.sub(r'\g<1>#f8f6f0', content)
            new_content = inline_pattern.sub(r'\g<1>#f8f6f0\g<3>', new_content)
            
            if new_content != content:
                with open(filepath, 'w', encoding='utf-8') as f:
                    f.write(new_content)
                print(f"Updated {filepath}")
                updated_count += 1

print(f"Total off-white files updated: {updated_count}")
