# AiMind CLI

A powerful CLI tool for scaffolding code templates from compressed archives. Extract templates, initialize git repositories, and install dependencies automatically.

## Installation

### Local Development
```bash
npm install
npm link
```

### Global Installation (after publishing to npm)
```bash
npm install -g aimind-cli
```

## Usage

### List Available Templates
```bash
aimind list
```

### Generate a New Project
```bash
# Interactive template selection
aimind generate

# Generate to specific directory
aimind generate --directory ./my-awesome-project
```

## Template Structure

Templates are organized in folders within the `templates/` directory. Each template folder contains:

```
templates/
├── my-template/
│   ├── metadata.json          # Template metadata and configuration
│   └── template.tar.gz        # Compressed project archive
└── another-template/
    ├── metadata.json
    └── template.tar.gz
```

### metadata.json Format
```json
{
  "name": "My Awesome Template",
  "description": "A modern Next.js template with TypeScript and Tailwind CSS",
  "author": "AiMind Team",
  "version": "1.0.0",
  "tags": ["nextjs", "typescript", "tailwindcss"]
}
```

## Creating Templates

### 1. Create Your Project Structure
```bash
mkdir my-template-project
cd my-template-project
# Add your project files (package.json, src/, etc.)
```

### 2. Compress the Template
```bash
# From parent directory
tar -czf template.tar.gz my-template-project/
```

### 3. Create Template Folder Structure
```bash
mkdir -p templates/my-template
mv template.tar.gz templates/my-template/
```

### 4. Add Metadata
Create `templates/my-template/metadata.json`:
```json
{
  "name": "My Template",
  "description": "Description of what this template provides",
  "author": "Your Name",
  "version": "1.0.0"
}
```

## Features

- 📦 **Template Discovery**: Automatically scans template folders and loads metadata
- 🎯 **Interactive Selection**: Choose templates from a user-friendly list
- 📁 **Smart Extraction**: Extracts complete project structures from tar.gz archives
- 🔧 **Git Initialization**: Automatically initializes git repository
- 📦 **Dependency Installation**: Runs `npm install` if package.json exists
- ⚠️ **Safety Checks**: Confirms before overwriting existing directories
- 🎨 **Beautiful Output**: Colorful, informative console output with progress indicators

## Commands

| Command | Description |
|---------|-------------|
| `aimind list` | List all available templates with metadata |
| `aimind generate` | Generate a new project from template (interactive) |
| `aimind generate --directory <dir>` | Generate project to specific directory |
| `aimind --help` | Show help information |
| `aimind --version` | Show version information |

## Example Workflow

```bash
# List available templates
$ aimind list

Available templates:

📦 AiMind Next.js Template
   A modern Next.js template with TypeScript, Tailwind CSS, and best practices
   Author: AiMind Team
   Version: 1.0.0
   Size: 150.56 KB

# Generate a new project
$ aimind generate
? Choose a template: AiMind Next.js Template - A modern Next.js template with TypeScript, Tailwind CSS, and best practices
? Enter the project directory: my-nextjs-app

✔ Template extracted successfully!

✨ Template "aimind-nt" extracted successfully!
📁 Location: D:\path\to\my-nextjs-app

🔧 Initializing git repository...
✅ Git repository initialized
📦 Installing dependencies...
✅ Dependencies installed

📖 Check the README.md file for setup instructions.

🚀 Project ready! You can now start developing.
```

## Publishing to npm

### Manual Publishing

1. **Prepare for publishing:**
   ```bash
   npm run prepare-publish
   ```

2. **Publish:**
   ```bash
   # Dry run first
   npm publish --dry-run

   # Publish for real
   npm publish
   ```

### Automated Publishing with GitHub Actions

This project includes GitHub Actions for automatic publishing:

1. **Create npm token:**
   - Go to [npmjs.com](https://www.npmjs.com) → Account Settings → Access Tokens
   - Generate a new **Automation** token
   - Copy the token

2. **Add to GitHub Secrets:**
   - Go to your GitHub repository → Settings → Secrets and variables → Actions
   - Add new repository secret: `NPM_TOKEN`
   - Paste your npm automation token

3. **Trigger Publishing:**
   - Create and push a version tag: `git tag v1.0.0 && git push origin v1.0.0`
   - Or use manual workflow dispatch from Actions tab

4. **Workflow Features:**
   - Runs on version tags (v*)
   - Manual trigger available
   - Runs tests before publishing
   - Creates release notes automatically

### Install Globally

After publishing, users can install globally:

```bash
npm install -g aimind-cli
```

Or for development:
```bash
npm install
npm link
```

## CI/CD

This project uses GitHub Actions for automated publishing:

- **Trigger:** Version tags (v*) or manual workflow dispatch
- **Tests:** Runs `npm test` before publishing
- **Publishing:** Automatically publishes to npm registry
- **Release Notes:** Creates GitHub release notes with version info

### Setting up CI/CD

1. **Repository Setup:**
   - Push this code to a GitHub repository
   - Update repository URLs in `package.json`

2. **npm Token:**
   - Generate automation token from npm
   - Add `NPM_TOKEN` secret to GitHub repository

3. **Publishing:**
   - Create and push version tags: `git tag v1.0.0 && git push origin v1.0.0`
   - Or manually trigger from Actions tab

The workflow file is located at `.github/workflows/publish.yml`.

## Contributing

1. Fork the repository
2. Create your feature branch
3. Add tests and documentation
4. Submit a pull request

## License

ISC