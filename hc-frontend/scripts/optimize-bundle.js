#!/usr/bin/env node

const fs = require("fs");
const path = require("path");

// Bundle optimization analysis script
function analyzeBundle() {
  const buildDir = path.join(__dirname, "..", ".next");
  const staticDir = path.join(buildDir, "static");

  if (!fs.existsSync(staticDir)) {
    console.log('❌ Build directory not found. Run "npm run build" first.');
    return;
  }

  const jsFiles = [];
  const cssFiles = [];

  // Recursively find all JS and CSS files
  function findFiles(dir) {
    const files = fs.readdirSync(dir);
    files.forEach((file) => {
      const filePath = path.join(dir, file);
      const stat = fs.statSync(filePath);

      if (stat.isDirectory()) {
        findFiles(filePath);
      } else if (file.endsWith(".js")) {
        jsFiles.push({ path: filePath, size: stat.size });
      } else if (file.endsWith(".css")) {
        cssFiles.push({ path: filePath, size: stat.size });
      }
    });
  }

  findFiles(staticDir);

  // Sort by size
  jsFiles.sort((a, b) => b.size - a.size);
  cssFiles.sort((a, b) => b.size - a.size);

  console.log("📊 Bundle Analysis Results:");
  console.log("\n🔍 Largest JavaScript Files:");
  jsFiles.slice(0, 10).forEach((file, index) => {
    const sizeKB = (file.size / 1024).toFixed(2);
    const fileName = path.basename(file.path);
    console.log(`${index + 1}. ${fileName} - ${sizeKB} KB`);
  });

  console.log("\n🎨 Largest CSS Files:");
  cssFiles.slice(0, 5).forEach((file, index) => {
    const sizeKB = (file.size / 1024).toFixed(2);
    const fileName = path.basename(file.path);
    console.log(`${index + 1}. ${fileName} - ${sizeKB} KB`);
  });

  const totalJsSize = jsFiles.reduce((sum, file) => sum + file.size, 0);
  const totalCssSize = cssFiles.reduce((sum, file) => sum + file.size, 0);

  console.log(`\n📈 Total Bundle Size:`);
  console.log(`JavaScript: ${(totalJsSize / 1024 / 1024).toFixed(2)} MB`);
  console.log(`CSS: ${(totalCssSize / 1024 / 1024).toFixed(2)} MB`);
  console.log(
    `Total: ${((totalJsSize + totalCssSize) / 1024 / 1024).toFixed(2)} MB`,
  );

  // Optimization recommendations
  console.log("\n💡 Optimization Recommendations:");

  const largeFiles = jsFiles.filter((file) => file.size > 100 * 1024); // > 100KB
  if (largeFiles.length > 0) {
    console.log("⚠️  Large files detected (>100KB):");
    largeFiles.forEach((file) => {
      const fileName = path.basename(file.path);
      console.log(`   - ${fileName}: Consider code splitting or lazy loading`);
    });
  }

  if (jsFiles.length > 20) {
    console.log(
      "⚠️  Many JavaScript files detected. Consider reducing chunk count.",
    );
  }

  console.log("✅ Bundle analysis complete!");
}

// Run analysis
if (require.main === module) {
  analyzeBundle();
}

module.exports = { analyzeBundle };
