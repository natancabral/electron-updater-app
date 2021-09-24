# Electron Updater App

## Still testing!!! 

- [File YML](#file-yml)
  - electron-builder.yml
  - get your token here: https://github.com/settings/tokens
- [Configure package.json](#configure-packagejson)
  - build > publish
- [Release](#release):
  - Create a realease: https://github.com/natancabral/electron-updater-app/releases
  - Title: **1.0.x** and Tag: **v1.0.x** (v...)

#### File YML
- Rename file to electron-builder.yml and change data
- Get your token: [token](https://github.com/settings/tokens)
```yml
appId: com.natancabral.electron-updater-app
owner: natancabral
repo: electron-updater-app
url: 'https://github.com/natancabral/electron-updater-app'
publish:
  provider: github
  token: [YOUR GITHUB ACCESS TOKEN]:https://github.com/settings/tokens
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

- Upload all file (./dist)
- https://github.com/[YOUR USERNAME]/[YOUR REPO NAME]/**releases**
- Remenber: tag: **v1.0.x** and title: **1.0.x**
- Semantic Versioning: https://semver.org/

#### Warning
- Deb file not works fine, try with AppImage file.
- Mac sample: [article](https://medium.com/@johndyer24/creating-and-deploying-an-auto-updating-electron-app-for-mac-and-windows-using-electron-builder-6a3982c0cee6)

