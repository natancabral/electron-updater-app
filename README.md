# Electron Updater App

<p align="center">
<strong>Windows</strong> and <strong>Unix</strong> minimal Electron applications with auto updates implemented<br/>
(based on the <a href="https://github.com/electron/electron-quick-start">electron-quick-start</a>).
</p>

| Linux | Windows |
|-------|---------|
|<img src="/src/assets/screen-update-avaliable.png"/>|<img src="/src/assets/screen-update-avaliable-win-10.png"/>|

## Try it
The latest version of this example is `1.0.2`. So, you can download the [`1.0.1`](https://github.com/natancabral/electron-updater-app/releases/tag/v1.0.1) one and see how the app finds the new version and downloads it.


## To begin

```bash
$ git clone https://github.com/natancabral/electron-updater-app.git
$ cd electron-updater-app
$ npm install
$ npm run start
$ npm run build
```
## Configure

- [Token](#token)
  - Get your token [here](https://github.com/settings/tokens/new) or [read this](https://docs.github.com/en/authentication/keeping-your-account-and-data-secure/creating-a-personal-access-token)
- [File YML](#file-yml)
  - electron-builder.yml
- [Configure package.json](#configure-packagejson)
  - build > publish
- [Release](#release):
  - Create a [realease](https://github.com/natancabral/electron-updater-app/releases)
  - Title: **1.0.x** and Tag: **v1.0.x** (letter v... on tag)

#### Token
- You need a token
- https://github.com/settings/tokens/new
- [More information](https://docs.github.com/en/authentication/keeping-your-account-and-data-secure/creating-a-personal-access-token)

#### File YML
- Rename **fake_electron-builder.yml** file to **electron-builder.yml** and change data
```yml
appId: com.natancabral.electron-updater-app
publish:
  provider: github
  owner: natancabral
  repo: electron-updater-app
  token: [YOUR GITHUB ACCESS TOKEN]
  vPrefixedTagName: true
```
- Sample:
```yml
appId: com.[yourusername].[repo]
publish:
  provider: github
  owner: [yourusername]
  repo: [repo]
  token: [token]
  vPrefixedTagName: true
```


#### Configure package.json
- Change appId
```json
"appId": "com.[yourusername].[repo]",
```
- Change publish
```json
"build": {
  "publish": [{
    "provider": "github",
    "owner": "[yourusername]",
    "repo": "[repo]"
  }],
},
```
- Release to alternative download
```json
"release": {
  "provider": "github",
  "owner": "[yourusername]",
  "repo": "[repo]",
  "releases": "https://github.com/[yourusername]/[repo]/releases/",
  "template": **NO_CHANGE_THIS**
},
```

#### Release

- On terminal: ```npm run build:win:publish``` or to not publish```npm run build:win```
- Upload all file (./dist)
- https://github.com/[yourusername]/[repo]/releases
- Remenber: title: **1.0.x** and tag: **v1.0.x** (letter v... on tag)
- Semantic Versioning: https://semver.org/

<p align="center">
  <img src="/src/assets/screen-list-files.png"/>
</p>

#### Notes
- Documentation [here](https://www.electron.build/auto-update.html)
- *afterPackRenameFiles.js* to rename package files.
- DEV mode not work, only after ```npm run build```.
- Mac sample 1: [article](https://medium.com/@johndyer24/creating-and-deploying-an-auto-updating-electron-app-for-mac-and-windows-using-electron-builder-6a3982c0cee6)
Mac sample 2: [article](https://medium.com/jspoint/packaging-and-distributing-electron-applications-using-electron-builder-311fc55178d9)

## License

The MIT License.

## Author

<table>
  <tr>
    <td>
      <img src="https://github.com/natancabral.png?s=100" width="100"/>
    </td>
    <td>
      Natan Cabral<br />
      <a href="mailto:natancabral@hotmail.com">natancabral@hotmail.com</a><br />
      <a href="https://github.com/natancabral/">https://github.com/natancabral/</a>
    </td>
  </tr>
</table>
