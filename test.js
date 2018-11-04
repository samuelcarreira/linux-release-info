/*!
 * linux-release-info test
 * 
 * Licensed under MIT 
 * Copyright (c) 2018 [Samuel Carreira]
 */
console.time('benchmark'); // benchmark startup

const releaseInfo = require('./index');
const path = require('path');

console.log('Linux Release Info Test\n');

try {
  const infoSyncData = releaseInfo({ mode: 'sync' });

  console.log(`Sync mode test:\n\tYou are using ${infoSyncData.pretty_name} on a ${infoSyncData.arch} machine`); // Distro name and arch info
} catch (err) {
  console.error(`Error reading OS release info: ${err}`);
}


releaseInfo({
  custom_file: path.resolve(__dirname, 'os_release_sample'),
  debug: true
}).then(result => {
    console.log(`Custom file and async mode test:\n\tYou are using ${result.pretty_name} on a ${result.arch} machine`);
    console.timeEnd('benchmark');
})
.catch(err => console.error(`Error reading OS release info: ${err}`));
