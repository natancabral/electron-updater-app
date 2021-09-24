# Electron Updater App

September 2021

## To begin

```bash
git clone https://github.com/natancabral/electron-updater-app.git
cd electron-updater-app
npm install
npm run start
npm run build
```
## Configure

- [Token](#token)
  - Get your token [here](https://github.com/settings/tokens) or [read this](https://docs.github.com/en/authentication/keeping-your-account-and-data-secure/creating-a-personal-access-token)
- [File YML](#file-yml)
  - electron-builder.yml
- [Configure package.json](#configure-packagejson)
  - build > publish
- [Release](#release):
  - Create a [realease](https://github.com/natancabral/electron-updater-app/releases)
  - Title: **1.0.x** and Tag: **v1.0.x** (v...)

#### Token
- You need a token
- https://github.com/settings/tokens
- [More information](https://docs.github.com/en/authentication/keeping-your-account-and-data-secure/creating-a-personal-access-token)

#### File YML
- Rename **fake_electron-builder.yml** file to **electron-builder.yml** and change data
```yml
appId: com.natancabral.electron-updater-app
owner: natancabral
repo: electron-updater-app
url: 'https://github.com/natancabral/electron-updater-app'
publish:
  provider: github
  token: [YOUR GITHUB ACCESS TOKEN]
```
- Sample:
```yml
appId: com.[yourusername].[repo]
owner: [yourusername]
repo: [repo]
url: 'https://github.com/[yourusername]/[repo]'
publish:
  provider: github
  token: [token]
```


#### Configure package.json
- Change appId
```json
"appId": "com.natancabral.electron-updater-app",
```
- Change publish
```json
"publish": [{
  "provider": "github",
  "owner": "natancabral",
  "repo": "electron-updater-app"
}],
```
#### Release

- On terminal: ```ǹpm run build```
- Upload all file (./dist)
- https://github.com/[YOUR-USERNAME]/[YOUR-REPO-NAME]/releases
- Remenber: tag: **v1.0.x** and title: **1.0.x**
- Semantic Versioning: https://semver.org/

#### Warning
- Deb file not works fine, try with AppImage file.
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
