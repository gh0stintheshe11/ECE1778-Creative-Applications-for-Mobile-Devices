import sys
import subprocess
import os
import tempfile


def check_submission(tar_gz_path):
    # Expected top-level files (excluding assets folder)
    expected_files = {
        "app.json",
        "App.tsx",
        "index.ts",
        "package-lock.json",
        "package.json",
        "tsconfig.json",
        "types.ts",
    }

    # Expected assets folder contents
    expected_assets = {
        "adaptive-icon.png",
        "favicon.png",
        "icon.png",
        "splash-icon.png",
    }

    issues = []
    tar_gz_path = os.path.abspath(tar_gz_path)

    # Basic checks
    if not os.path.exists(tar_gz_path):
        return [f"File not found: {tar_gz_path}"]
    if not tar_gz_path.endswith(".tar.gz"):
        return ["File must be a .tar.gz archive."]

    with tempfile.TemporaryDirectory() as temp_dir:
        try:
            result = subprocess.run(
                ["tar", "-zxvf", tar_gz_path],
                cwd=temp_dir,
                capture_output=True,
                text=True,
            )
            if result.returncode != 0:
                return [f"Error extracting archive: {result.stderr.strip()}"]
        except Exception as e:
            return [f"Unexpected error extracting archive: {str(e)}"]

        # Ensure exactly one top-level folder
        top_level = os.listdir(temp_dir)
        if len(top_level) != 1:
            return [
                f"Archive must contain exactly one top-level folder. Found: {len(top_level)} items ({', '.join(top_level)})"
            ]

        project_dir = os.path.join(temp_dir, top_level[0])
        if not os.path.isdir(project_dir):
            return [f"Top-level item must be a folder, not a file: {top_level[0]}"]

        # Check required files/folders
        project_contents = set(os.listdir(project_dir))

        # Expected top-level = required files + "assets"
        expected_top_level = expected_files | {"assets"}

        missing_items = expected_top_level - project_contents
        if missing_items:
            issues.append(f"Missing required items: {', '.join(missing_items)}")

        extra_items = project_contents - expected_top_level
        if extra_items:
            issues.append(f"Unexpected items found: {', '.join(extra_items)}")

        # Check assets folder contents
        assets_path = os.path.join(project_dir, "assets")
        if not os.path.isdir(assets_path):
            issues.append("Missing 'assets' folder.")
        else:
            assets_contents = set(os.listdir(assets_path))
            missing_assets = expected_assets - assets_contents
            if missing_assets:
                issues.append(
                    f"Missing files in 'assets' folder: {', '.join(missing_assets)}"
                )
            extra_assets = assets_contents - expected_assets
            if extra_assets:
                issues.append(
                    f"Unexpected files in 'assets' folder: {', '.join(extra_assets)}"
                )

    return issues


if __name__ == "__main__":
    if len(sys.argv) != 2:
        print(
            "Usage: python check_submission_structure.py <path_to_your_submission.tar.gz>"
        )
        sys.exit(1)

    tar_gz_path = sys.argv[1]
    issues = check_submission(tar_gz_path)

    if issues:
        print("Submission structure issues found:")
        for issue in issues:
            print(f"- {issue}")
        sys.exit(1)
    else:
        print("Submission structure is correct! No issues found.")
        sys.exit(0)
