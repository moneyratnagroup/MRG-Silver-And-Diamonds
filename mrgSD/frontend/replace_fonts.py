import os
import re

directory = r"c:\Users\user\.vscode\programs\MRG\MRG-Silver-And-Diamonds\mrgSD\frontend\src"

patterns = [
    (re.compile(r"font-family:\s*['\"]Inter['\"],\s*sans-serif;?"), r"font-family: 'Cormorant Upright', serif;"),
    (re.compile(r"font-family:\s*['\"]Playfair Display['\"],\s*serif;?"), r"font-family: 'Cormorant Upright', serif;"),
    (re.compile(r"font-family:\s*['\"]Outfit['\"],\s*sans-serif;?"), r"font-family: 'Cormorant Upright', serif;")
]

count = 0
for root, _, files in os.walk(directory):
    for file in files:
        if file.endswith(".css") or file.endswith(".jsx"):
            filepath = os.path.join(root, file)
            with open(filepath, "r", encoding="utf-8") as f:
                content = f.read()
            
            new_content = content
            for pattern, replacement in patterns:
                new_content = pattern.sub(replacement, new_content)
            
            if new_content != content:
                with open(filepath, "w", encoding="utf-8") as f:
                    f.write(new_content)
                count += 1
                print(f"Updated {file}")
print(f"Total files updated: {count}")
