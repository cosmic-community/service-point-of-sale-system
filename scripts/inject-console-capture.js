const fs = require('fs');
const path = require('path');

// Build-time script injection for console capture
// This automatically injects the console capture script into HTML files during build

const SCRIPT_TAG = '<script src="/dashboard-console-capture.js"></script>';
const COMMENT_TAG = '<!-- Console capture script for dashboard debugging -->';

function injectScript(filePath) {
  if (!fs.existsSync(filePath)) {
    return false;
  }

  let content = fs.readFileSync(filePath, 'utf8');
  
  // Skip if already injected
  if (content.includes('dashboard-console-capture.js')) {
    return false;
  }

  // Try to inject in <head> section
  if (content.includes('<head>')) {
    content = content.replace(
      '<head>',
      `<head>\n  ${COMMENT_TAG}\n  ${SCRIPT_TAG}`
    );
  } 
  // Fallback: inject after <html> tag
  else if (content.includes('<html>')) {
    content = content.replace(
      '<html>',
      `<html>\n${COMMENT_TAG}\n${SCRIPT_TAG}`
    );
  }
  // Fallback: inject at the beginning of file
  else {
    content = `${COMMENT_TAG}\n${SCRIPT_TAG}\n${content}`;
  }

  fs.writeFileSync(filePath, content);
  return true;
}

function injectIntoDirectory(dirPath) {
  if (!fs.existsSync(dirPath)) {
    console.log(`Directory not found: ${dirPath}`);
    return;
  }

  const files = fs.readdirSync(dirPath, { recursive: true });
  let injectedCount = 0;

  files.forEach(file => {
    const fullPath = path.join(dirPath, file);
    
    // Only process HTML files
    if (path.extname(fullPath) === '.html' && fs.statSync(fullPath).isFile()) {
      if (injectScript(fullPath)) {
        console.log(`Injected console capture into: ${fullPath}`);
        injectedCount++;
      }
    }
  });

  console.log(`Console capture script injection complete. Modified ${injectedCount} files.`);
}

// Main execution
const buildDir = process.argv[2] || '.next'; // Default to Next.js build output
const outputDir = path.resolve(buildDir);

console.log('Starting console capture script injection...');
console.log(`Target directory: ${outputDir}`);

injectIntoDirectory(outputDir);