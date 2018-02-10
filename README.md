linux-release-info
=================

Get Linux release info (distribution name, version, arch, release, etc.) from '/etc/os-release' file and from native os module. On Windows and Darwin platforms it only returns common node os module info (platform, hostname, release, and arch)

###Highlights
* Lightweight without any dependencies (only native Node modules)
* Async file reading



## Installation

    npm install --save linux-release-info

## Usage

```
const releaseInfo = require('linux-release-info')

releaseInfo()
    .then(result => {
        console.log(`You are using ${result.pretty_name} on a ${result.arch} machine`) // Distro name (only on linux) and arch info
        console.log(result) // all data
    })
    .catch(err => console.error(`Error reading OS release info: ${err}`))
```
Outputs:
```
> You are using Ubuntu 17.10 on a x64 machine
```

#### Sample outputs
**Linux**
```
{ type: 'Linux',
  platform: 'linux',
  hostname: 'VirtualBoxLINUX',
  arch: 'x64',
  release: '4.13.0-32-generic',
  name: 'Ubuntu',
  version: '17.10 (Artful Aardvark)',
  id: 'ubuntu',
  id_like: 'debian',
  pretty_name: 'Ubuntu 17.10',
  version_id: '17.10',
  home_url: 'https://www.ubuntu.com/',
  support_url: 'https://help.ubuntu.com/',
  bug_report_url: 'https://bugs.launchpad.net/ubuntu/',
  privacy_policy_url: 'https://www.ubuntu.com/legal/terms-and-policies/privacy-policy',
  version_codename: 'artful',
  ubuntu_codename: 'artful' }
```
**Linux (Raspberry Pi)**
```
{ type: 'Linux',
  platform: 'linux',
  hostname: 'raspberrypi',
  arch: 'arm',
  release: '4.9.59-v7+',
  pretty_name: 'Raspbian GNU/Linux 9 (stretch)',
  name: 'Raspbian GNU/Linux',
  version_id: '9',
  version: '9 (stretch)',
  id: 'raspbian',
  id_like: 'debian',
  home_url: 'http://www.raspbian.org/',
  support_url: 'http://www.raspbian.org/RaspbianForums',
  bug_report_url: 'http://www.raspbian.org/RaspbianBugs' }
```
**Windows**
```
{ type: 'Windows_NT',
  platform: 'win32',
  hostname: 'MYPC',
  arch: 'x64',
  release: '10.0.16299' }
```

####Extra tip
If you want info about Windows or Mac releases, you can try the following modules from sindresorhus:
https://www.npmjs.com/package/win-release
https://www.npmjs.com/package/macos-release


## License
Licensed under MIT

Copyright (c) 2018 [Samuel Carreira]