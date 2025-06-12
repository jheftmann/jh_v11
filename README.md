# Project Setup and Development

This project uses Sass (SCSS) for styling and BrowserSync for auto-reloading during development.

## Prerequisites

To run this project, you need Node.js installed. It is highly recommended to use a Node Version Manager like `nvm` to manage your Node.js versions.

**Node.js Version Requirement:**

*   This project requires Node.js version **14.0.0 or higher** (preferably the latest LTS version, e.g., Node.js 18+). 

    If you encounter errors like `Error: Cannot find module ’fs/promises’` or `npm WARN notsup Unsupported engine`, it means your Node.js version is too old. You can resolve this by updating Node.js.

## Getting Started

1.  **Install Node Version Manager (nvm) - *if you don’t have it already***:
    ```bash
    curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/master/install.sh | bash
    ```
    After installation, close and reopen your terminal, or run `source ~/.zshrc` (or `~/.bashrc` for bash) to load `nvm`.

2.  **Install the recommended Node.js version (using nvm)**:
    ```bash
    nvm install --lts
    nvm use --lts
    ```
    Verify your Node.js version: `node -v`

3.  **Install Project Dependencies**:
    Navigate to your project root directory in the terminal:
    ```bash
    cd /Users/studio/Dev/jacobheftmann.com/jh_v11
    ```
    Then, clean your `node_modules` and `package-lock.json` (to ensure compatibility with your new Node.js version) and install dependencies:
    ```bash
    rm -rf node_modules package-lock.json
    npm install
    ```

## Development

To start the development server with auto-reloading and Sass compilation:

```bash
npm start
```

This command will:
*   Compile `style.scss` to `style.css` whenever changes are saved.
*   Start a local server and open your project in the browser.
*   Automatically reload the browser when changes are detected in `.html`, `.css` (including compiled Sass), or `.js` files.

## Project Structure

*   `index.html`: Main HTML file.
*   `style.scss`: Main Sass stylesheet (compiles to `style.css`).
*   `reset.css`: CSS reset stylesheet.
*   `script.js`: Main JavaScript file.
*   `package.json`: Manages project dependencies and development scripts. 