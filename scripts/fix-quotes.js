const fs = require('fs');
const path = require('path');

// Function to replace straight single quotes with curly single quotes
function replaceSingleQuotes(text) {
    return text.replace(/(?<![<"'])'/g, '\u2019');
}

// Function to process a file
function processFile(filePath) {
    try {
        const content = fs.readFileSync(filePath, 'utf8');
        let newContent = content;

        if (filePath.endsWith('.md')) {
            newContent = replaceSingleQuotes(content);
        }
        
        if (content !== newContent) {
            fs.writeFileSync(filePath, newContent, 'utf8');
            console.log(`Updated quotes in: ${filePath}`);
        }
    } catch (error) {
        console.error(`Error processing ${filePath}:`, error);
    }
}

// Function to walk through directory
function walkDir(dir) {
    const files = fs.readdirSync(dir);
    
    files.forEach(file => {
        const filePath = path.join(dir, file);
        const stat = fs.statSync(filePath);
        
        if (stat.isDirectory()) {
            // Skip node_modules and .git directories
            if (file !== 'node_modules' && file !== '.git') {
                walkDir(filePath);
            }
        } else {
            // Process only Markdown files
            if (file.endsWith('.md')) {
                processFile(filePath);
            }
        }
    });
}

// Start processing from the current directory
const rootDir = process.cwd();
console.log('Starting quote replacement...');
walkDir(rootDir);
console.log('Finished processing files.'); 