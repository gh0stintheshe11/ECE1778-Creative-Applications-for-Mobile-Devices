import sys
import subprocess
import os
import tempfile


def check_submission(tar_gz_path):
    # Define the expected file structure for the top-level folder
    expected_structure = {
        "files": {
            "app.json",
            "package-lock.json",
            "package.json",
            "tsconfig.json",
            "types.ts",
        },
        "folders": {
            "app": {
                "files": {
                    "_layout.tsx",
                    "index.tsx",
                    "add-edit.tsx",
                },
                "folders": {
                    "details": {
                        "files": {"[id].tsx"},
                    },
                },
            },
            "assets": {
                "files": {
                    "adaptive-icon.png",
                    "favicon.png",
                    "icon.png",
                    "splash-icon.png",
                },
            },
            "components": {
                "files": {
                    "ActionButton.tsx",
                    "ActivityListItem.tsx",
                    "Card.tsx",
                    "DetailsCard.tsx",
                    "PrimaryButton.tsx",
                },
            },
            "constants": {
                "files": {"colors.ts"},
            },
            "features": {
                "folders": {
                    "activities": {
                        "files": {"activitiesSlice.ts"},
                    },
                },
            },
            "storage": {
                "files": {"activitiesStorage.ts"},
            },
            "store": {
                "files": {"store.ts"},
            },
            "styles": {
                "files": {"globalStyles.ts"},
            },
        },
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

        # Validate folder structure
        def validate_structure(current_path, expected, path_prefix=""):
            local_issues = []
            current_contents = (
                set(os.listdir(current_path)) if os.path.exists(current_path) else set()
            )

            # Check files
            expected_files = expected.get("files", set())
            missing_files = expected_files - current_contents
            if missing_files:
                local_issues.append(
                    f"Missing required files in {path_prefix or 'top-level folder'}: {', '.join(missing_files)}"
                )

            # Check for unexpected files
            actual_files = {
                f
                for f in current_contents
                if os.path.isfile(os.path.join(current_path, f))
            }
            extra_files = actual_files - expected_files
            if extra_files:
                local_issues.append(
                    f"Unexpected files in {path_prefix or 'top-level folder'}: {', '.join(extra_files)}"
                )

            # Check folders
            expected_folders = set(expected.get("folders", {}).keys())
            actual_folders = {
                f
                for f in current_contents
                if os.path.isdir(os.path.join(current_path, f))
            }
            missing_folders = expected_folders - actual_folders
            if missing_folders:
                local_issues.append(
                    f"Missing required folders in {path_prefix or 'top-level folder'}: {', '.join(missing_folders)}"
                )

            extra_folders = actual_folders - expected_folders
            if extra_folders:
                local_issues.append(
                    f"Unexpected folders in {path_prefix or 'top-level folder'}: {', '.join(extra_folders)}"
                )

            # Recursively validate subfolders
            for folder_name, folder_content in expected.get("folders", {}).items():
                subfolder_path = os.path.join(current_path, folder_name)
                new_prefix = (
                    f"{path_prefix}/{folder_name}" if path_prefix else folder_name
                )
                if os.path.exists(subfolder_path):
                    local_issues.extend(
                        validate_structure(subfolder_path, folder_content, new_prefix)
                    )

            return local_issues

        # Start validation from the top-level folder
        issues.extend(validate_structure(project_dir, expected_structure))

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
