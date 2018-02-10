"use strict"

const fs = require("fs")
const os = require("os")

/** 
 * Get OS release info from '/etc/os-release' file and from native os module 
 * on Windows or Darwin it only returns common os module info
 * 
 * (note: async reading using native fs module)
 * 
 * 
 * @returns {Object} info from the current os
 */
module.exports = releaseInfo => {
    return new Promise((resolve, reject) => {

        let outputData = {
            type: os.type(),
            platform: os.platform(),
            hostname: os.hostname(),
            arch: os.arch(),
            release: os.release(),
        }

        if (os.type() !== 'Linux') {
            return resolve(outputData)
        }

        fs.readFile('/etc/os-release', 'binary', (err, data) => {
            if (err) {
                //console.error(`Error reading OS release: ${err}`)
                return reject(err)
            }

            //console.log(data) // debug result

            const lines = data.split('\n')

            lines.forEach(element => {
                const linedata = element.split('=')

                if (linedata.length === 2) {
                    linedata[1] = linedata[1].replace(/"/g, '') // remove quotes
                    Object.defineProperty(outputData, linedata[0].toLowerCase(), {
                        value: linedata[1],
                        writable: true,
                        enumerable: true,
                        configurable: true
                    })
                }
            });

            return resolve(outputData)
        })
    })
}