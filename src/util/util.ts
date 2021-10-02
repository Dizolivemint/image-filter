import fs from 'fs';
import Jimp = require('jimp');
import axios from 'axios'

// filterImageFromURL
// helper function to download, filter, and save the filtered image locally
// returns the absolute path to the local image
// INPUTS
//    inputURL: string - a publicly accessible url to an image file
// RETURNS
//    an absolute path to a filtered image locally saved file
export async function filterImageFromURL(inputURL: string): Promise<string>{
    return new Promise( async resolve => {
        try {
            const photo = await axios({
                method: 'get',
                url: inputURL,
                responseType: 'arraybuffer'
            })
            .then(({ data: imageBuffer }) => Jimp.read(imageBuffer));
            const outpath = `${__dirname}/tmp/filtered.${Math.floor(Math.random() * 2000)}.${photo.getExtension()}`;
            await photo
            .resize(256, 256) // resize
            .quality(60) // set JPEG quality
            .greyscale() // set greyscale
            .write(outpath, (img)=>{
                resolve(outpath);
            });
        } catch (e) {
            console.error(e);
            resolve("error");
        }

    });
}

// deleteLocalFiles
// helper function to delete files on the local disk
// useful to cleanup after tasks
// INPUTS
//    files: Array<string> an array of absolute paths to files
export async function deleteLocalFiles(files:Array<string>){
    for( let file of files) {
        fs.unlinkSync(file);
    }
}