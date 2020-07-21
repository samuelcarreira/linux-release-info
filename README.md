# Linux Release Info

Get Linux release info (distribution name, version, arch, release, etc.) from '/etc/os-release' or '/usr/lib/os-release' files and from native os module. On Windows and Darwin platforms it only returns common node os module info (platform, hostname, release, and arch)

## Key Features
* **Secure and lightweight:** (without any dependencies, only native Node modules)
* **Asynchronous file reading**
* **Synchronous file reading (NEW feature version >= 2.0.0)**
* **Specify custom os-release file**
* **Written in TypeScript**
* **Well documented and easy to use**

## Installation
```
npm install --save linux-release-info
```
or

```
yarn add linux-release-info
```

## Usage
**Basic usage (async)**
```
const {releaseInfo} = require('linux-release-info');

releaseInfo()
    .then(result => {
        console.log(`You are using ${result.pretty_name} on a ${result.arch} machine`); // Distro name (only on linux) and arch info
    })
    .catch(err => console.error(`Error reading OS release info: ${err}`))
```
Outputs:
```
> You are using Ubuntu 17.10 on a x64 machine
```
**Synchronous read**
```
const releaseInfo = require('linux-release-info');

try {
    const infoSyncData = releaseInfo({mode: 'sync'});
    console.log(`You are using ${infoSyncData.pretty_name} on a ${infoSyncData.arch} machine`)    
} catch (err) {
    console.error(`Error reading OS release info: ${err}`);
}
```
**Custom os_release file**
```
const infoSyncData = releaseInfo({mode: 'sync', custom_file: '/home/user/os_release_sample'), debug: true});
```

## Options
Property         | Type     | Default    | Description
---------------- | -------- | ---------- | ----------------------
`mode`  | `string` | `async`     | 'sync' or 'async' mode
`custom_file`  | `string` | `null/none`     | custom complete filepath with os info. If not provided the system will search on the `/etc/os-release` and `/usr/lib/os-release` files
`debug`  | `boolean` | `false`     | shows console debug messages


### Sample outputs
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
  release: '4.19.118-v7+',
  pretty_name: 'Raspbian GNU/Linux 10 (buster)',
  name: 'Raspbian GNU/Linux',
  version_id: '10',
  version: '10 (buster)',
  version_codename: 'buster',
  id: 'raspbian',
  id_like: 'debian',
  home_url: 'http://www.raspbian.org/',
  support_url: 'http://www.raspbian.org/RaspbianForums',
  bug_report_url: 'http://www.raspbian.org/RaspbianBugs' }
```
**Linux (Fedora)**
```
{ type: 'Linux',
  platform: 'linux',
  hostname: 'localhost-live',
  arch: 'x64',
  release: '4.13.9-300.fc27.x86_64',
  name: 'Fedora',
  version: '27 (Workstation Edition)',
  id: 'fedora',
  version_id: '27',
  pretty_name: 'Fedora 27 (Workstation Edition)',
  ansi_color: '0;34',
  cpe_name: 'cpe:/o:fedoraproject:fedora:27',
  home_url: 'https://fedoraproject.org/',
  support_url: 'https://fedoraproject.org/wiki/Communicating_and_getting_help',
  bug_report_url: 'https://bugzilla.redhat.com/',
  redhat_bugzilla_product: 'Fedora',
  redhat_bugzilla_product_version: '27',
  redhat_support_product: 'Fedora',
  redhat_support_product_version: '27',
  privacy_policy_url: 'https://fedoraproject.org/wiki/Legal:PrivacyPolicy',
  variant: 'Workstation Edition',
  variant_id: 'workstation' }
```
**Windows**
```
{ type: 'Windows_NT',
  platform: 'win32',
  hostname: 'MYPC',
  arch: 'x64',
  release: '10.0.16299' }
```
**macOS**
```
{ type: 'Darwin',
  platform: 'darwin',
  hostname: 'Macbook-Air.home',
  arch: 'x64',
  release: '16.0.0' }
```

### Requirements
You need Node.js v.8.x or greater to use the version 2.x of this module

#### About the sync mode
It's not recommended to use blocking functions to access the filesystem. Use the synchronous mode only if you need to.

#### Extra tip
If you want info about Windows or Mac releases, you can try the following modules from sindresorhus:
- https://www.npmjs.com/package/win-release

or

- https://www.npmjs.com/package/macos-release


## License
- Licensed under MIT

- Copyright (c) 2018-2020 [Samuel Carreira]