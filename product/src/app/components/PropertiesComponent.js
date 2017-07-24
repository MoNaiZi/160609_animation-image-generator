"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var core_1 = require("@angular/core");
var AnimationImageOptions_1 = require("../data/AnimationImageOptions");
var locale_data_1 = require("../i18n/locale-data");
var PropertiesComponent = (function () {
    function PropertiesComponent(localeData) {
        this.localeData = localeData;
    }
    return PropertiesComponent;
}());
__decorate([
    core_1.Input(),
    __metadata("design:type", AnimationImageOptions_1.AnimationImageOptions)
], PropertiesComponent.prototype, "animationOptionData", void 0);
PropertiesComponent = __decorate([
    core_1.Component({
        selector: 'properties',
        templateUrl: "./src/components-html/PropertiesComponent.html",
        styleUrls: ['./styles/component-property.css']
    }),
    __metadata("design:paramtypes", [locale_data_1.LocaleData])
], PropertiesComponent);
exports.PropertiesComponent = PropertiesComponent;
