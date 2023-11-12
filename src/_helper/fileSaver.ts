const sharp = require("sharp");
const fs = require("fs");
const path = require('path')
import { v4 as uuidv4 } from 'uuid';

export async function saveFile(file: any /*Express.Multer.File*/) {
    const filedir = `./uploads`;
    fs.access(filedir, (error) => {
        if (error) {
            fs.mkdirSync(filedir);
        }
    });
    const { buffer, originalname } = file;
    const timestamp = new Date().toISOString();
    var imageName = uuidv4();
    const ref = `${timestamp}-${imageName}.webp`;
    await sharp(buffer)
        .webp({ quality: 20 })
        .toFile(filedir + "/" + ref);

    return 's';//ref;
}