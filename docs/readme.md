# Documentation Readme

The docs folder includes the documentation files in markdown format.

To build the documentation system, you will need to install the following:

- [Python](https://www.python.org/downloads/)
- [Python package manager (Pip)](https://pip.pypa.io/en/stable/getting-started/)
- [Mkdocs Static Site Generator](https://www.mkdocs.org/)
- [Mkdocs Material Theme](https://squidfunk.github.io/mkdocs-material/)
- [Mkdocs Render Swagger Plugin](https://github.com/bharel/mkdocs-render-swagger-plugin)

To build the documentation site locally, do the following:

1. Use Mkdocs to make a new site in your local environment.

   ```
   Mkdocs new site-name
   ```

2. In the new project, replace the `mkdocs.yml` file with the one in the root level of this repository.

   This file contains the configuration for mkdocs, including the file hierarchy as well as theme settings.

3. Copy the `docs` folder in this repo and replace the docs folder in your Mkdocs project.

4. Create the concatenated glossary file by running the `concat-glossary.py` file in the `/docs/scripts` directory.

   This script concatenates all of the glossary entries into a single file, formats it, and resolves See and See also entries.

5. In the folder with the `mkdocs.yml` file type:

   ```
   Mkdocs serve
   ```

6. Go to local host port 8000 on your computer to view.

   ```
   http://localhost:8000
   ```

You can now view the documentation in your local environment.
