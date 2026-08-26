import os
import re

directory = '.'

old_import_pattern = re.compile(r'import\s+\{([^}]+)\}\s+from\s+["\']https://www.gstatic.com/firebasejs/[^"\']+["\'];')
config_import_pattern = re.compile(r'import\s+\{([^}]+)\}\s+from\s+["\']\./firebase-config\.js["\'];')

def process_file(filepath):
    try:
        with open(filepath, 'r', encoding='utf-8') as f:
            content = f.read()
    except Exception as e:
        print(f"Error reading {filepath}: {e}")
        return

    original_content = content
    imports_to_add = set()

    # Find all firebase CDN imports
    matches = old_import_pattern.findall(content)
    for match in matches:
        funcs = [f.strip() for f in match.split(',')]
        imports_to_add.update(funcs)

    # Remove old firebase CDN imports
    content = old_import_pattern.sub('', content)

    # Check if there's an import from firebase-config.js
    cfg_match = config_import_pattern.search(content)
    if cfg_match:
        funcs = [f.strip() for f in cfg_match.group(1).split(',')]
        imports_to_add.update(funcs)
        content = config_import_pattern.sub('', content)

    if imports_to_add:
        # Determine relative path to supabase-config.js
        depth = filepath.count(os.sep)
        if depth == 0:
            rel_path = './supabase-config.js'
        else:
            rel_path = '../' * depth + 'supabase-config.js'

        import_statement = f'import {{ {", ".join(sorted(list(imports_to_add)))} }} from "{rel_path}";\n'
        
        # Inject the new import after the script tag or at the top
        if '<script type="module">' in content:
            content = content.replace('<script type="module">', f'<script type="module">\n{import_statement}', 1)
        else:
            content = import_statement + content

        # Replace 'firebase-config.js' with 'supabase-config.js' in src tags
        content = content.replace('src="./firebase-config.js"', 'src="./supabase-config.js"')
        content = content.replace('src="firebase-config.js"', 'src="supabase-config.js"')

    # Also remove firebase initialization since supabase is pre-initialized
    content = re.sub(r'const\s+firebaseConfig\s*=\s*\{[^}]+\};', '', content, flags=re.DOTALL)
    content = re.sub(r'const\s+app\s*=\s*initializeApp\(firebaseConfig\);', '', content)
    content = re.sub(r'const\s+app\s*=\s*getApps\(\)\.length\s*\?\s*getApp\(\)\s*:\s*initializeApp\(fc\);?', '', content)
    
    # Remove auth Domain / database URL stuff
    content = re.sub(r'const\s+fc\s*=\s*\{[^}]+\};', '', content, flags=re.DOTALL)

    if content != original_content:
        with open(filepath, 'w', encoding='utf-8') as f:
            f.write(content)
        print(f"Updated: {filepath}")

for root, _, files in os.walk(directory):
    for file in files:
        if file.endswith('.html') or file.endswith('.js'):
            if file not in ['supabase-config.js', 'firebase-config.js']:
                process_file(os.path.join(root, file))
