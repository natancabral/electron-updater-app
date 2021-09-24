# Electron Updater App

## Still testing!!! 

- [Token](#token)
  - get your token [here](https://github.com/settings/tokens)
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
