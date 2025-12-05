#!/usr/bin/env node

const { program } = require('commander');
const { default: inquirer } = require('inquirer');
const fs = require('fs-extra');
const path = require('path');
const chalk = require('chalk');
const ora = require('ora');
const tar = require('tar');

const packageJson = require('../package.json');

program
  .name('aimind')
  .description('CLI tool for scaffolding code templates from tar.gz files')
  .version(packageJson.version);

// Global configuration
const TEMPLATES_DIR = path.join(__dirname, 'templates');

// Utility functions
async function getAvailableTemplates() {
  try {
    await fs.ensureDir(TEMPLATES_DIR);
    const templateFolders = await fs.readdir(TEMPLATES_DIR, { withFileTypes: true });
    const templates = {};

    for (const dirent of templateFolders) {
      if (dirent.isDirectory()) {
        const templateName = dirent.name;
        const templateDir = path.join(TEMPLATES_DIR, templateName);
        const metadataPath = path.join(templateDir, 'metadata.json');
        
        // Look for tar.gz file in the template directory
        const files = await fs.readdir(templateDir);
        const tarGzFile = files.find(file => file.endsWith('.tar.gz'));
        
        if (!tarGzFile) {
          console.warn(chalk.yellow(`Warning: No .tar.gz file found in ${templateName} template folder`));
          continue;
        }
        
        const templatePath = path.join(templateDir, tarGzFile);
        
        let metadata = {
          name: templateName,
          description: 'No description available'
        };
        
        // Try to load metadata if it exists
        if (await fs.pathExists(metadataPath)) {
          try {
            metadata = await fs.readJson(metadataPath);
          } catch (error) {
            console.warn(chalk.yellow(`Warning: Could not parse metadata for ${templateName}`));
          }
        }
        
        const stats = await fs.stat(templatePath);
        
        templates[templateName] = {
          ...metadata,
          path: templatePath,
          size: (stats.size / 1024).toFixed(2) + ' KB',
          modified: stats.mtime.toLocaleDateString()
        };
      }
    }

    return templates;
  } catch (error) {
    console.error(chalk.red('Error loading templates:'), error.message);
    return {};
  }
}

async function extractTemplate(templatePath, targetDir) {
  const spinner = ora('Extracting template...').start();
  
  try {
    await fs.ensureDir(targetDir);
    
    // Extract tar.gz file to target directory
    await tar.extract({
      file: templatePath,
      cwd: targetDir
    });
    
    spinner.succeed('Template extracted successfully!');
  } catch (error) {
    spinner.fail('Failed to extract template');
    throw error;
  }
}

async function runCommand(command, cwd) {
  const { exec } = require('child_process');
  const { promisify } = require('util');
  const execAsync = promisify(exec);
  
  return execAsync(command, { cwd });
}

// Commands
program
  .command('list')
  .alias('ls')
  .description('List available templates')
  .action(async () => {
    try {
      const templates = await getAvailableTemplates();
      const templateNames = Object.keys(templates);
      
      if (templateNames.length === 0) {
        console.log(chalk.yellow('No templates found.'));
        console.log(chalk.gray('Place .tar.gz template files in the templates/ directory.'));
        return;
      }
      
      console.log(chalk.green('Available templates:\n'));
      templateNames.forEach(name => {
        const template = templates[name];
        console.log(chalk.cyan(`📦 ${template.name || name}`));
        console.log(chalk.white(`   ${template.description || 'No description'}`));
        if (template.author) console.log(chalk.gray(`   Author: ${template.author}`));
        if (template.version) console.log(chalk.gray(`   Version: ${template.version}`));
        console.log(chalk.gray(`   Size: ${template.size}`));
        console.log('');
      });
    } catch (error) {
      console.error(chalk.red('Error listing templates:'), error.message);
    }
  });

program
  .command('generate')
  .alias('gen')
  .description('Generate a new project from template')
  .option('-d, --directory <dir>', 'Target directory for the generated project')
  .action(async (options) => {
    try {
      const templates = await getAvailableTemplates();
      const templateNames = Object.keys(templates);
      
      if (templateNames.length === 0) {
        console.log(chalk.yellow('No templates found.'));
        return;
      }
      
      // Let user choose template
      const { selectedTemplate } = await inquirer.prompt([{
        type: 'list',
        name: 'selectedTemplate',
        message: 'Choose a template:',
        choices: templateNames.map(name => ({
          name: `${templates[name].name || name} - ${templates[name].description || 'No description'}`,
          value: name
        }))
      }]);
      
      let targetDir;
      
      // Ask for project directory if not provided
      if (!options.directory) {
        const { directory } = await inquirer.prompt([{
          type: 'input',
          name: 'directory',
          message: 'Enter the project directory:',
          default: `./${selectedTemplate}-project`,
          validate: input => input.trim() !== '' || 'Directory name cannot be empty'
        }]);
        targetDir = path.resolve(directory);
      } else {
        targetDir = path.resolve(options.directory);
      }
      
      // Check if directory exists and is not empty
      if (await fs.pathExists(targetDir)) {
        const files = await fs.readdir(targetDir);
        if (files.length > 0) {
          const { overwrite } = await inquirer.prompt([{
            type: 'confirm',
            name: 'overwrite',
            message: `Directory "${targetDir}" exists and is not empty. Continue?`,
            default: false
          }]);
          
          if (!overwrite) {
            console.log(chalk.yellow('Operation cancelled.'));
            return;
          }
        }
      }
      
      const template = templates[selectedTemplate];
      await extractTemplate(template.path, targetDir);
      
      console.log(chalk.green(`\n✨ Template "${selectedTemplate}" extracted successfully!`));
      console.log(chalk.cyan(`📁 Location: ${targetDir}`));
      
      // Initialize git repository
      console.log(chalk.blue('\n🔧 Initializing git repository...'));
      try {
        await runCommand(`git init`, targetDir);
        console.log(chalk.green('✅ Git repository initialized'));
      } catch (error) {
        console.log(chalk.yellow('⚠️  Git initialization failed (git may not be installed)'));
      }
      
      // Install dependencies
      const packageJsonPath = path.join(targetDir, 'package.json');
      if (await fs.pathExists(packageJsonPath)) {
        console.log(chalk.blue('📦 Installing dependencies...'));
        try {
          await runCommand(`npm install`, targetDir);
          console.log(chalk.green('✅ Dependencies installed'));
        } catch (error) {
          console.log(chalk.yellow('⚠️  Dependency installation failed'));
        }
      }
      
      // Check if there's a README file with instructions
      const readmePath = path.join(targetDir, 'README.md');
      if (await fs.pathExists(readmePath)) {
        console.log(chalk.yellow('\n📖 Check the README.md file for setup instructions.'));
      }
      
      console.log(chalk.green('\n🚀 Project ready! You can now start developing.'));
      
    } catch (error) {
      console.error(chalk.red('Error generating project:'), error.message);
    }
  });



program.parse();
