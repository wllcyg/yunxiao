const fs = require('fs');
const path = require('path');
const JavaScriptObfuscator = require('javascript-obfuscator');

// 混淆配置
const obfuscatorOptions = {
  compact: true,
  controlFlowFlattening: true,
  controlFlowFlatteningThreshold: 0.7,
  deadCodeInjection: true,
  deadCodeInjectionThreshold: 0.4,
  debugProtection: false,
  debugProtectionInterval: 0,
  disableConsoleOutput: true,
  identifierNamesGenerator: 'hexadecimal',
  log: false,
  numbersToExpressions: true,
  renameGlobals: false,
  rotateStringArray: true,
  selfDefending: true,
  shuffleStringArray: true,
  splitStrings: true,
  splitStringsChunkLength: 10,
  stringArray: true,
  stringArrayEncoding: ['base64'],
  stringArrayThreshold: 0.75,
  transformObjectKeys: true,
  unicodeEscapeSequence: false,
};

// 处理单个文件的函数
function obfuscateFile(filePath) {
  try {
    const code = fs.readFileSync(filePath, 'utf8');
    const obfuscationResult = JavaScriptObfuscator.obfuscate(
      code,
      obfuscatorOptions
    );
    fs.writeFileSync(filePath, obfuscationResult.getObfuscatedCode());
    console.log(`成功混淆文件: ${filePath}`);
  } catch (error) {
    console.error(`处理文件 ${filePath} 时出错:`, error);
  }
}

// 递归处理目录的函数
function processDirectory(directory) {
  const files = fs.readdirSync(directory);

  files.forEach(file => {
    const fullPath = path.join(directory, file);
    const stat = fs.statSync(fullPath);

    if (stat.isDirectory()) {
      processDirectory(fullPath);
    } else if (path.extname(file) === '.js') {
      obfuscateFile(fullPath);
    }
  });
}

// 开始处理
const distPath = path.join(process.cwd(), 'dist');
if (fs.existsSync(distPath)) {
  console.log('开始混淆 dist 目录下的 JS 文件...');
  processDirectory(distPath);
  console.log('混淆完成！');
} else {
  console.error('错误: dist 目录不存在！');
}
