import { readFile } from 'node:fs';

// import json from '../assets/tours.json';
// import json from '../assets/filedb.json';
// import json from '../assets/starter/devdata/data/tours.json';
// import json from '../assets/starter/dev-data/data/tours-simple.json';
import json from '../assets/dev-data/data/tours-simple.json';
// import json from '../assets/tours-simple.json';

function main() {
  console.log(json);

  // console.log(readFile);

  readFile(json, 'utf8', (_err: any, data: any) => {
    if (_err) console.log(_err);

    console.log(data);
    console.log('ok');
  });
  // console.log(txt);
}

main();
