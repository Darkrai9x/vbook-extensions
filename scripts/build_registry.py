#!/usr/bin/env python3
"""
Sync prebuilt vBook extensions to the public registry repo.

Each ext dir contains plugin.zip + plugin.json + icon.png. This script mirrors
those three files into the public repo (only when content changed) and prunes
public ext dirs no longer present in the source.

The registry index files (plugin.json / chinese_plugin.json / video_plugin.json
/ tts.json / translate.json / repository.json at repo root) are hand-maintained,
NOT generated here — the workflow copies them into the public repo verbatim.

Usage:
    python scripts/build_registry.py \
        --src   .                        # private repo root
        --public ../public-repo           # checked-out public repo
"""
import argparse
import hashlib
import json
import os
import shutil
import sys

# Per-extension files mirrored into the public repo.
EXT_FILES = ("plugin.zip", "plugin.json", "icon.png")


def read_json(path):
    with open(path, "r", encoding="utf-8") as f:
        return json.load(f)


def file_hash(path):
    if not os.path.isfile(path):
        return None
    h = hashlib.sha256()
    with open(path, "rb") as f:
        for chunk in iter(lambda: f.read(65536), b""):
            h.update(chunk)
    return h.hexdigest()


def find_extensions(src):
    """Yield (name, dir) for every dir with plugin.zip + plugin.json(metadata)."""
    for name in sorted(os.listdir(src)):
        d = os.path.join(src, name)
        pj = os.path.join(d, "plugin.json")
        pz = os.path.join(d, "plugin.zip")
        if not os.path.isdir(d) or not os.path.isfile(pj) or not os.path.isfile(pz):
            continue
        try:
            meta = read_json(pj).get("metadata", {})
        except (ValueError, OSError):
            continue
        if "name" in meta:
            yield name, d


def sync_file(src_path, dest_path):
    """Copy only when missing or content differs. Returns True if written."""
    if not os.path.isfile(src_path):
        return False
    if file_hash(src_path) == file_hash(dest_path):
        return False
    os.makedirs(os.path.dirname(dest_path), exist_ok=True)
    shutil.copy2(src_path, dest_path)
    return True


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--src", default=".")
    ap.add_argument("--public", required=True)
    args = ap.parse_args()

    changed = []
    present = set()
    for name, ext_dir in find_extensions(args.src):
        present.add(name)
        dest_dir = os.path.join(args.public, name)
        touched = []
        for fn in EXT_FILES:
            if sync_file(os.path.join(ext_dir, fn), os.path.join(dest_dir, fn)):
                touched.append(fn)
        if touched:
            changed.append("{}: {}".format(name, ", ".join(touched)))

    # Prune: remove public ext dirs no longer present in source.
    removed = []
    for name in os.listdir(args.public):
        d = os.path.join(args.public, name)
        # An ext dir in the public repo is one holding plugin.zip.
        if os.path.isdir(d) and os.path.isfile(os.path.join(d, "plugin.zip")):
            if name not in present:
                shutil.rmtree(d)
                removed.append(name)

    print("Extensions synced:", len(present))
    print("Files synced for:", len(changed), "ext(s)")
    for c in changed:
        print("  -", c)
    if removed:
        print("Removed:", len(removed), "ext(s)")
        for r in removed:
            print("  -", r)

    total_changes = len(changed) + len(removed)
    gh_out = os.environ.get("GITHUB_OUTPUT")
    if gh_out:
        with open(gh_out, "a", encoding="utf-8") as f:
            f.write("changed={}\n".format(total_changes))
    return 0


if __name__ == "__main__":
    sys.exit(main())
