"use strict";
/**
 * アプリケーションメニューの制御クラスです。
 */
var Menu = (function () {
    function Menu(appConfig, localeData) {
        this.appConfig = appConfig;
        this.localeData = localeData;
    }
    Menu.prototype.createMenu = function () {
        //	Macの場合のみメニューを生成する。
        if (process.platform != "darwin") {
            return;
        }
        var _a = require("electron"), remote = _a.remote, shell = _a.shell;
        var Menu = remote.Menu, MenuItem = remote.MenuItem;
        var app = remote.app;
        var version = this.appConfig.version;
        var name = this.localeData.APP_NAME;
        var template = [];
        template.push({
            label: name,
            submenu: [{
                    label: this.localeData.MENU_about,
                    click: function () {
                        alert("\u304A\u4F7F\u3044\u306E\u300C" + name + "\u300D\u306E\u30D0\u30FC\u30B8\u30E7\u30F3\u306F " + version + " \u3067\u3059\u3002" + "\n" + ("You use version " + version + "."));
                    }
                },
                {
                    label: this.localeData.MENU_quit, accelerator: "Command+Q",
                    click: function () {
                        app.quit();
                    }
                }]
        });
        var helpMenu = [
            {
                label: this.localeData.MENU_helpOnline,
                click: function () {
                    shell.openExternal("https://github.com/ics-creative/160609_animation-image-generator/tree/master/help");
                }
            },
            {
                label: this.localeData.MENU_helpQuestion,
                click: function () {
                    shell.openExternal("http://goo.gl/forms/5DUI1UnTUXR6AmCw2");
                }
            }
        ];
        template.push({
            label: this.localeData.MENU_help,
            submenu: helpMenu
        });
        var menu = Menu.buildFromTemplate(template);
        Menu.setApplicationMenu(menu);
    };
    return Menu;
}());
exports.Menu = Menu;