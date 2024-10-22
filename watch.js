import { statSync, copyFileSync, watchFile } from 'fs';
import { resolve } from 'path';


const sourceFile = resolve('theme-react/dist/assets/trendify.js');
const targetFile = resolve('extensions/trendify/assets/trendify.js');


const copyFile = () => {
  try {
    copyFileSync(sourceFile, targetFile);
    console.log(`File copied successfully from ${sourceFile} to ${targetFile}`);
  } catch (error) {
    console.error('Error copying file:', error);
  }
};


const watchForChanges = () => {
  watchFile(sourceFile, (curr, prev) => {
    if (curr.mtime !== prev.mtime) {
      console.log(`File ${sourceFile} has been updated. Copying...`);
      copyFile();
    }
  });
};


console.log(`Watching for changes in ${sourceFile}`);
watchForChanges();
