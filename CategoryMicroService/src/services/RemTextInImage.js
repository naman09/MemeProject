const Jimp = require('jimp');
const ocrSpace = require('ocr-space-api-wrapper');
require('dotenv').config();
const { CATEGORY_MEDIA_BASE_URL } = require("../constants");
const fs = require('fs/promises');
const { existsSync } = require('fs');

class RemTextInImage {
  async getTxtOverlay(imgUrl) {
    const res = await ocrSpace(imgUrl, { apiKey: process.env.OCR_SPACE_API_KEY, isOverlayRequired: true, OCREngine: 2, scale: true });
    //console.log(res.ParsedResults[0].TextOverlay);
    return res.ParsedResults[0].TextOverlay.Lines;
  }
  getBoundingRect(wordList) {
    var width = wordList[wordList.length - 1].Left + wordList[wordList.length - 1].Width - wordList[0].Left + 1;
    var left = wordList[0].Left;
    return { width: width, left: left };
  }
  removeLine(image, x, y, w, h) {
    for (let i = x; i <= x + w; i++) {
      for (let j = y; j <= y + h; j++) {
        image.setPixelColor(parseInt(0, 16), i, j);
      }
    }
    return image;
  }
  async remTextInImage(imgUrl) {
    if (!imgUrl) {
      throw InputError("Meme Url undefined");
    }
    const lineList = await this.getTxtOverlay(imgUrl);
    try {
      const img = await Jimp.read(imgUrl);
      for (let line of lineList) {
        const rect = this.getBoundingRect(line.Words);
        this.removeLine(img, rect.left, line.MinTop, rect.width, line.MaxHeight);
      }
      const filePath = CATEGORY_MEDIA_BASE_URL + 'r' + Math.floor(Math.random() * 1000000) + "." + imgUrl.split('.').pop();
      console.log("SAVING at ", filePath);
      await img.write(filePath);
      if (!filePath) {
        throw Error("File could not be saved");
      }
      return filePath;
    } catch (err) {
      console.log(err);
      throw err;
    }
  }
  removeFile(filePath) {
    if (existsSync(filePath)) {
      console.log("This file will be deleted : ", filePath);
      fs.unlink(filePath); //Need to check this code  (checked)
    }
  }
}

module.exports = RemTextInImage;