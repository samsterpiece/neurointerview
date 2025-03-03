#!/usr/bin/env python
"""Django's command-line utility for administrative tasks."""
import os
import sys


def main():
    """Run administrative tasks."""
    os.environ.setdefault("DJANGO_SETTINGS_MODULE", "backend.settings")
    try:
        from django.core.management import execute_from_command_line
    except ImportError as exc:
        raise ImportError(
            "Couldn't import Django. Are you sure it's installed and "
            "available on your PYTHONPATH environment variable? Did you "
            "forget to activate a virtual environment?"
        ) from exc
    execute_from_command_line(sys.argv)


if __name__ == "__main__":
    main()


# #!/usr/bin/env python
# import os
# import sys
#
# # Properly add the project root directory to the Python path
# PROJECT_ROOT = os.path.dirname(os.path.abspath(__file__))
# sys.path.insert(0, PROJECT_ROOT)
#
# # Also add the parent directory (containing the project) to the path
# PARENT_DIR = os.path.dirname(PROJECT_ROOT)
# sys.path.insert(0, PARENT_DIR)
#
# def main():
#     """Run administrative tasks."""
#     os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'neurointerview.settings')
#     try:
#         from django.core.management import execute_from_command_line
#     except ImportError as exc:
#         raise ImportError(
#             "Couldn't import Django. Are you sure it's installed?"
#         ) from exc
#     execute_from_command_line(sys.argv)
#
# if __name__ == '__main__':
#     main()
