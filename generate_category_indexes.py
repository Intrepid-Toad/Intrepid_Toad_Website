import os
import yaml

# Adjust these as needed
POSTS_DIR = "_posts"
CATEGORIES = ["category-level-0", "category-level-1", "category-level-2", "category-level-3", "category-level-4", "CategoryLevel5", "CategoryLevel6"]
OUTPUT_ROOT = "category"

def get_category_path(meta):
    path = []
    for key in CATEGORIES:
        val = meta.get(key)
        if val and str(val).strip():
            path.append(str(val).strip().replace(" ", "-").lower())
    return "/".join(path)

def parse_front_matter(filepath):
    with open(filepath, 'r', encoding='utf-8') as f:
        lines = f.readlines()

    if lines and lines[0].strip() == "---":
        # Read YAML front matter
        fm = []
        for l in lines[1:]:
            if l.strip() == "---":
                break
            fm.append(l)
        return yaml.safe_load("".join(fm))
    return {}

def safe_mkdir(path):
    os.makedirs(path, exist_ok=True)

def main():
    # Track which index.md have been created
    created = set()
    # Map category path to list of post filenames
    categories = {}

    # 1. Scan all posts recursively
    for root, dirs, files in os.walk(POSTS_DIR):
        for filename in files:
            if filename.endswith('.md'):
                filepath = os.path.join(root, filename)
                meta = parse_front_matter(filepath)
                cat_path = get_category_path(meta)
                if cat_path:
                    categories.setdefault(cat_path, []).append(filepath)

    # 2. Generate index.md in each category path
    for cat_path, posts in categories.items():
        out_dir = os.path.join(OUTPUT_ROOT, cat_path)
        safe_mkdir(out_dir)
        index_path = os.path.join(out_dir, "index.md")

        # Basic template: override to taste
        with open(index_path, "w", encoding="utf-8") as f:
            f.write(f"---\n")
            f.write(f"title: {cat_path.replace('-', ' ').title()}\n")
            f.write(f"layout: default\n")
            f.write(f"---\n\n")
            f.write(f"# {cat_path.replace('-', ' ').title()}\n\n")
            f.write("{% assign posts = site.posts | where_exp: 'post', ")
            f.write('"')
            # Generate a Jekyll filter that matches all category levels in the post front matter
            cat_parts = cat_path.split('/')
            f.write(" and ".join([
                f"post.{k} == '{cat_parts[i].replace('-', ' ').title()}'"
                for i, k in enumerate(CATEGORIES) if i < len(cat_parts)
            ]))
            f.write('" %}\n')
            f.write("{% for post in posts %}\n")
            f.write("- [{{ post.title }}]({{ post.url }})\n")
            f.write("{% endfor %}\n")

        created.add(index_path)

    print(f"Created {len(created)} category indexes under '{OUTPUT_ROOT}/'.")

if __name__ == "__main__":
    main()