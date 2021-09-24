

    "directories": {
      "buildResources": "assets",
      "output": "dist"
    },
    "files": [
      "assets/**/*",
      ".env",
      "*.html",
      "*.js",
      "*.css"
    ]
  },
  "asarUnpack": "**/assets/*"

https://www.electron.build/configuration/configuration#Configuration-copyright

"publish": {
  "provider": "generic",
  "url": "http://xx.xx.xx.xx:port/update/win64",
  "useMultipleRangeRequest": false
},


--------------------------


"build": {
        "appId": "com.my.website",
        "productName": "MyProduct",
        "afterSign": "crv/config/afterSignHook.js",
        "directories": {
            "output": "build"
        },
        "publish": {
            "provider": "generic",
            "url": "https://www.yourServer.com/software/${os}",
            "channel": "latest"
        },
        "mac": {
            "icon": "crv/assets/icons/icon.icns",
            "hardenedRuntime": true,
            "gatekeeperAssess": false
        }
    },


NO GOOD

    "publish": [
      {
        "provider": "github",
        "url": "https://github.com/natancabral/electron-updater-app"
      }
    ],

Mac
https://medium.com/jspoint/packaging-and-distributing-electron-applications-using-electron-builder-311fc55178d9

Code
Example
https://github.com/matiastucci/electron-auto-updater-example
https://github.com/junkbin/electron-updater-example

.env
GH_TOKEN=ghp_9FhfBkEPQJLHw9QQPqtFWb1qvAoFV0gFSNSn

main.js
process.env.GH_TOKEN='ghp_9FhfBkEPQJLHw9QQPqtFWb1qvAoFV0gFSNSn';
// Terminal:
// $ export GH_TOKEN="ghp_nxxx..."
