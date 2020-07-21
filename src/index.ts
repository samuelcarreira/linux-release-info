/*!
 * linux-release-info
 * Get Linux release info (distribution name, version, arch, release, etc.) 
 * from '/etc/os-release' or '/usr/lib/os-release' files and from native os 
 * module. On Windows and Darwin platforms it only returns common node os module 
 * info (platform, hostname, release, and arch) 
 *
 * Licensed under MIT
 * Copyright (c) 2018-2020 [Samuel Carreira]
 */

import * as fs from 'fs';
import * as os from 'os';
import {promisify} from 'util';
const readFileAsync = promisify(fs.readFile); 

export interface LinuxReleaseInfoOptions {
  /**
   * read mode, possible values: 'async' and 'sync'
   *
   * @default 'async'
   */
  mode?: 'async' | 'sync';
  /**
   * custom complete file path with os info default null/none
   * if not provided the system will search on the '/etc/os-release'
   * and  '/usr/lib/os-release' files
   *
   * @default null
   */
  custom_file?: string|null|undefined;
  /**
   * if true, show console debug messages
   *
   * @default false
   */
  debug?: boolean;
}

const linuxReleaseInfoOptionsDefaults: LinuxReleaseInfoOptions = {
  mode: 'async',
  custom_file: null,
  debug: false
}

/**
 * Get OS release info from 'os-release' file and from native os module
 * on Windows or Darwin it only returns common os module info
 * (uses native fs module)
 * @returns {object} info from the current os
 */
export function releaseInfo(options: LinuxReleaseInfoOptions): object {
  options = {...linuxReleaseInfoOptionsDefaults, ...options};

  const searchOsreleaseFileList: string[] = osreleaseFileList(options.custom_file);

  async function readAsyncOsreleaseFile(searchOsreleaseFileList: string[], options: LinuxReleaseInfoOptions) {
      let fileData = null;

      for (let os_release_file of searchOsreleaseFileList) {
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
    
  function readSyncOsreleaseFile(searchOsreleaseFileList: string[], options: LinuxReleaseInfoOptions) {
      let fileData = null;
  
      for (let os_release_file of searchOsreleaseFileList) {
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
function formatFileData(sourceData: any, srcParseData: any): any {
  const lines = srcParseData.split('\n');
  
  // @ts-ignore
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
 * Export a list of os-release files
 * 
 * @param {string} customFile optional custom complete filepath
 * @returns {array} list of os-release files
 */
function osreleaseFileList(customFile: string|null|undefined): string[] {
  const DEFAULT_OS_RELEASE_FILES = ['/etc/os-release', '/usr/lib/os-release'];

  if (!customFile) {
    return DEFAULT_OS_RELEASE_FILES;
  } else {
    return Array(customFile);
  }
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
