# Electron Updater App

## Still testing!!! 

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
