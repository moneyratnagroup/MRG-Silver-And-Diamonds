import os
import re

directory = r"c:\Users\user\.vscode\programs\MRG\MRG-Silver-And-Diamonds\mrgSD\frontend\src"
exclude_files = ["Footer.css", "MetalRatesBar.css"]

patterns = [
    (re.compile(r"#1F314A", re.IGNORECASE), "#000000"),
    (re.compile(r"#1a1a1a", re.IGNORECASE), "#000000")
]

count = 0
for root, _, files in os.walk(directory):
    for file in files:
        if file.endswith(".css") and file not in exclude_files:
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
