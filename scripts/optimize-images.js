/* eslint-disable @typescript-eslint/no-require-imports */
const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const inputPath = path.join(__dirname, '../public/hero-banner.jpg');
const outputPath = path.join(__dirname, '../public/hero-banner.webp');

async function optimizeImage() {
  try {
    const inputStats = fs.statSync(inputPath);
    console.log(`Original size: ${(inputStats.size / 1024 / 1024).toFixed(2)} MB`);

    await sharp(inputPath)
      .webp({ quality: 85 })
      .toFile(outputPath);

    const outputStats = fs.statSync(outputPath);
    console.log(`Optimized size: ${(outputStats.size / 1024 / 1024).toFixed(2)} MB`);
    
  } catch (error) {
    console.error('Error optimizing image:', error);
  }
}

optimizeImage();
