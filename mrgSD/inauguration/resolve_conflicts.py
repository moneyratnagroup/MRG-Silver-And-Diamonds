import os
import glob
import re

def resolve_file(filepath):
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()
    
    # Regex to match the standard git conflict block and keep the bottom half
    pattern = re.compile(r'<<<<<<< Updated upstream.*?\n(.*?)=======\n(.*?)\n>>>>>>> Stashed changes.*?\n?', re.DOTALL)
    
    new_content, count = pattern.subn(r'\2\n', content)
    
    if count > 0:
        with open(filepath, 'w', encoding='utf-8') as f:
            f.write(new_content)
        print(f"Resolved {count} conflicts in {filepath}")

if __name__ == '__main__':
    # Find all CSS files in src
    files = glob.glob('src/**/*.css', recursive=True)
    for f in files:
        resolve_file(f)
