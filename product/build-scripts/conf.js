module.exports = {
  "JP_NAME": "アニメ画像に変換する君",
  "EN_NAME" : "animation-image-converter",
  "APP_VERSION": "1.3.0",
  "BUILD_VERSION": "1.3.000",
  "ELECTRON_VERSION": "1.6.10",
  "sign": {
    "identity": "3rd Party Mac Developer Installer: ICS INC. (53YCXL8YSM)",
    "bundleId": "media.ics.AnimationImageConverter"
  },
  "distPath": "./dist",
  "binPath" : "./dist/assets/bin",
  "packageTmpPath": {
    "win32": "tmpWin32",
    "darwin": "tmpDarwin"
  },
  "pkg" : "AnimationImageConverter.pkg",
  "resourcesPath": {
    "win32": [
      {"fileName": "webpmux.exe", "path": "libwebp-0.5.0-windows-x86/bin/webpmux.exe"},
      {"fileName": "cwebp.exe", "path": "libwebp-0.5.0-windows-x86/bin/cwebp.exe"},
      {"fileName": "apngasm.exe", "path": "apngasm-2.9-bin-win32/apngasm.exe"},
      {"fileName": "pngquant.exe", "path": "pngquant-win/pngquant.exe"}],
    "darwin": [
      {"fileName": "webpmux", "path": "libwebp-0.5.0-mac-10.9/bin/webpmux"},
      {"fileName": "cwebp", "path": "libwebp-0.5.0-mac-10.9/bin/cwebp"},
      {"fileName": "apngasm", "path": "apngasm-2.9-bin-macosx/apngasm"},
      {"fileName": "pngquant", "path": "pngquant-mac/pngquant"}
    ]
  }
}
;