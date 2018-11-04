/*!
 * linux-release-info
 * Get Linux release info (distribution name, version, arch, release, etc.) 
 * from '/etc/os-release' or '/usr/lib/os-release' files and from native os 
 * module. On Windows and Darwin platforms it only returns common node os module 
 * info (platform, hostname, release, and arch) 
 * 
 * Licensed under MIT 
 * Copyright (c) 2018 [Samuel Carreira]
 */

const fs = require('fs');
const os = require('os');
const {promisify} = require('util');
const readFileAsync = promisify(fs.readFile); 


/**
 * Export a list of os-release files
 * 
 * @param {string} customFile optional custom complete filepath
 * @returns {array} list of os-release files
 */
function osreleaseFileList(customFile) {
    const DEFAULT_OS_RELEASE_FILES = ['/etc/os-release', '/usr/lib/os-release'];

    if (customFile !== null && typeof customFile === 'string') {
        return Array(customFile);
    } else {
        return DEFAULT_OS_RELEASE_FILES;
    }
}

/**
 * Get OS release info from 'os-release' file and from native os module
 * on Windows or Darwin it only returns common os module info
 * (uses native fs module)
 *
 * @param {string} options.mode read mode, possible values: 'async' and 'sync' default 'async' mode
 * @param {string} options.custom_file custom complete file path with os info default null/none
 *                                     if not provided the system will search on the '/etc/os-release'
 *                                     and  '/usr/lib/os-release' files
 * @param {boolean} options.debug if true, show console debug messages. default is false
 * @returns {object} info from the current os
 */
module.exports = function releaseInfo(options = {mode: 'async', custom_file: null, debug: false}) {
    async function readAsyncOsreleaseFile(searchOsreleaseFileList, options) {
        let fileData = null;
    
        for (os_release_file of searchOsreleaseFileList) {
            try {
                if (options.debug) {
                    console.log(`Trying to read '${os_release_file}'...`);
                }
    
                fileData = await readFileAsync(os_release_file, 'binary');
    
                if (options.debug) {
                    console.log('Read data:\n' + fileData);
                }
                
                break;
            } catch (error) {
                if (options.debug) {
                    console.error(error);
                }
            }
        }
    
        if (fileData === null) {
            throw new Error('Cannot read os-release file!');
            //return getOsInfo();
        }
    
        return formatFileData(getOsInfo(), fileData);
    }
    
    function readSyncOsreleaseFile(searchOsreleaseFileList, options) {
        let fileData = null;
    
        for (os_release_file of searchOsreleaseFileList) {
            try {
                if (options.debug) {
                    console.log(`Trying to read '${os_release_file}'...`);
                }
    
                fileData = fs.readFileSync(os_release_file, 'binary');
    
                if (options.debug) {
                    console.log('Read data:\n' + fileData);
                }
                
                break;
            } catch (error) {
                if (options.debug) {
                    console.error(error);
                }
            }
        }
    
        if (fileData === null) {
            throw new Error('Cannot read os-release file!');
            //return getOsInfo();
        }
    
        return formatFileData(getOsInfo(), fileData);
    }

    if (os.type() !== 'Linux') {
        if (options.mode === 'sync') {
            return getOsInfo();
        } else {
            return Promise.resolve(getOsInfo());
        }
    }

    const searchOsreleaseFileList = osreleaseFileList(options.custom_file);

    if (options.mode === 'sync') {
        return readSyncOsreleaseFile(searchOsreleaseFileList, options);
    } else {
        return Promise.resolve(readAsyncOsreleaseFile(searchOsreleaseFileList, options));
    }
}



/**
 * Format file data: convert data to object keys/values
 * 
 * @param {object} sourceData Source object to be appended
 * @param {string} srcParseData Input file data to be parsed
 * @returns {object} Formated object
 */
function formatFileData(sourceData, srcParseData) {
    const lines = srcParseData.split('\n');
    
    lines.forEach(element => {
        const linedata = element.split('=');

        if (linedata.length === 2) {
            linedata[1] = linedata[1].replace(/["'\r]/gi, ''); // remove quotes and return character

            Object.defineProperty(sourceData, linedata[0].toLowerCase(), {
                value: linedata[1],
                writable: true,
                enumerable: true,
                configurable: true
            });
        }
    });

    return sourceData;
}

/**
 * Get OS Basic Info
 * (uses node 'os' native module)
 * 
 * @returns {object} os basic info
 */
function getOsInfo() {
    const osInfo = {
        type: os.type(),
        platform: os.platform(),
        hostname: os.hostname(),
        arch: os.arch(),
        release: os.release()
    };

    return osInfo;
}