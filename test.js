const releaseInfo = require('./index')

releaseInfo()
    .then(result => {
        console.log(result) // all data
        console.log(`You are using ${result.pretty_name} on a ${result.arch} machine`) // Distro name and arch info
    })
    .catch(err => console.error(`Error reading OS release info: ${err}`))