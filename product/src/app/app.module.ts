import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgxElectronModule } from 'ngx-electron';

import { AppComponent } from './components/app/app';
import { AnimPreviewComponent } from './components/anim-preview/anim-preview';
import { PropertiesComponent } from './components/properties/properties';
import { LocaleData } from './i18n/locale-data';

import '../assets/js/createjs-1.0.0.min.js';

@NgModule({
  declarations: [
    AppComponent,
    AnimPreviewComponent,
    PropertiesComponent,
  ],
  imports: [BrowserModule, FormsModule, NgxElectronModule],
  providers: [LocaleData],
  bootstrap: [AppComponent]
})
/**
 * メインのアプリケーションモジュールを定義します。
 */
export class AppModule {}
