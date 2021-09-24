# Electron Updater App

## Still testing!!! 

- File YML
  - electron-builder.yml
  - get your token here: https://github.com/settings/tokens
- Change file package.json
  - build > publish
- Repository Release:
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

#### Package.json
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
