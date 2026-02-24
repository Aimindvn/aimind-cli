# AiMind CLI

A powerful CLI tool for scaffolding code templates from tar.gz archives. Automatically extract templates, initialize git repositories, and install dependencies.

## Quick Start

```bash
# Install globally
npm install -g aimind-cli

# List available templates
aimind list

# Generate a new project (interactive)
aimind generate

# Generate to a specific directory
aimind generate --directory ./my-project
```

## Features

- **Interactive Template Selection** - Beautiful CLI interface for choosing templates
- **Automatic Setup** - Git initialization and dependency installation included
- **Template Discovery** - Auto-scans and loads template metadata
- **Safe Extraction** - Confirms before overwriting existing directories
- **Colorful Output** - Clear progress indicators and status messages

## Installation

### Global (Recommended)
```bash
npm install -g aimind-cli
```

### Local Development
```bash
npm install
npm link
```

## Commands

```bash
aimind list                              # List all available templates
aimind generate                          # Generate from template (interactive)
aimind generate --directory <dir>        # Generate to specific directory
aimind --help                            # Show help
aimind --version                         # Show version
```

## How It Works

1. Choose a template from the interactive list
2. Specify the project directory
3. CLI automatically:
   - Extracts the template archive
   - Initializes a git repository
   - Installs dependencies (if `package.json` exists)

## Template Format

Templates are stored in `src/templates/` with this structure:

```
templates/
├── my-template/
│   ├── metadata.json      # Template information
│   └── template.tar.gz    # Project archive
```

### metadata.json
```json
{
  "name": "Template Name",
  "description": "What this template provides",
  "author": "Author Name",
  "version": "1.0.0",
  "tags": ["typescript", "nextjs"]
}
```

## Requirements

- Node.js >= 14.0.0
- npm or yarn
- git (for automatic repository initialization)

## Environment

Works on macOS, Linux, and Windows.

## License

ISC