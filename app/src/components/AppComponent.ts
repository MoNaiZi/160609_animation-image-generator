///	<reference path="../../libs/createjs/createjs.d.ts" />
///	<reference path="../../libs/jquery/jquery.d.ts" />

import {Component, ViewChild, Input, ElementRef} from "@angular/core";
import {AnimPreviewComponent} from "./AnimPreviewComponent";
import {PropertiesComponent} from "./PropertiesComponent";
import {AnimationImageOptions} from "../data/AnimationImageOptions";
import {PresetType} from "../type/PresetType";
import {PresetWeb} from "../preset/PresetWeb";
import {PresetLine} from "../preset/PresetLine";
import {ProcessExportImage} from "../process/ProcessExportImage";
import {AppConfig} from "../config/AppConfig";
import {ImageData} from "../data/ImageData";
import {Menu} from "../menu/Menu";
import {ErrorMessage} from "../error/ErrorMessage";

declare function require(value:String):any;

@Component({
	selector: 'my-app',
	templateUrl: "./src/components-html/AppComponent.html",
	directives: [AnimPreviewComponent, PropertiesComponent],
	styleUrls: ['./styles/component-app.css']
})
export class AppComponent {

	private get PRESET_ID():string {
		return 'preset_id';
	}

	private exportImagesProcess:ProcessExportImage;
	private isImageSelected:boolean;
	private presetMode:number;

	private openingDirectories:boolean;
	private items:ImageData[] = [];

	private appConfig:AppConfig = new AppConfig();
	private _isDragover:boolean = false;

	@Input() animationOptionData:AnimationImageOptions;

	@ViewChild("myComponent") myComponent:ElementRef;
	@ViewChild("optionSelecter") optionSelecterComponent:ElementRef;

	ngOnInit() {

		const menu:Menu = new Menu(this.appConfig);
		menu.createMenu();

		this.animationOptionData = new AnimationImageOptions();

		this.isImageSelected = false;
		this.exportImagesProcess = new ProcessExportImage(this.appConfig);

		// 初回プリセットの設定
		this.presetMode = Number(localStorage.getItem(this.PRESET_ID));
		this.changePreset(this.presetMode);

		//	保存先の指定返却
		const ipc = require('electron').ipcRenderer;

		ipc.on('selected-open-images', (event:any, filePathList:string[]) => {
			this._selectedImages(filePathList);
		});

		ipc.on('unlock-select-ui', (event:any, filePathList:string[]) => {
			console.log("unlockUI");
			this.openingDirectories = false;
		});
	}

	ngAfterViewInit() {

		const component = this.myComponent.nativeElement;
		component.addEventListener("dragover", (event:DragEvent)=> {
			this._isDragover = true;
			event.preventDefault();
		});

		component.addEventListener("dragout", (event:DragEvent)=> {
			this._isDragover = false;
		});

		component.addEventListener("drop", (event:DragEvent)=> {
			this._isDragover = false;
			this.handleDrop(event);
		});

		jQuery('[data-toggle="tooltip"]').tooltip()
	}

	private openDirectories() {
		if (this.openingDirectories) {
			return;
		}
		this.openingDirectories = true;
		const ipc = require('electron').ipcRenderer;
		ipc.send('open-file-dialog');
	}

	private _selectedImages(filePathList:string[]) {
		this.openingDirectories = false;
		this.setFilePathList(filePathList);
	}

	private handleDrop(event:DragEvent) {
		var path = require('path');

		const length = event.dataTransfer.files ? event.dataTransfer.files.length : 0;

		//	再度アイテムがドロップされたらリセットするように調整
		this.items = [];

		for (let i = 0; i < length; i++) {
			const file:any = event.dataTransfer.files[i];
			const filePath = file.path;

			if (path.extname(filePath) == ".png") {
				path.dirname(filePath);

				const item:ImageData = new ImageData();
				item.imageBaseName = path.basename(filePath);
				item.imagePath = filePath;
				item.frameNumber = this.items.length;

				this.items.push(item);
			}
		}

		this.numbering();

		this.changeImageItems(this.items);

		event.preventDefault();
	}

	private handlePresetChange(presetMode:string) {

		localStorage.setItem(this.PRESET_ID, presetMode);
		this.presetMode = Number(presetMode);

		this.changePreset(this.presetMode);
	}

	private changePreset(presetMode:number) {
		switch (presetMode) {
			case PresetType.LINE:
				PresetLine.setPreset(this.animationOptionData);
				break;
			case PresetType.WEB:
				PresetWeb.setPreset(this.animationOptionData);
				break;
		}
	}

	private generateAnimImage() {

		//	画像が選択されていないので保存しない。
		if (!this.isImageSelected) {
			return;
		}

		if (this.animationOptionData.enabledExportApng == false
			&& this.animationOptionData.enabledExportWebp == false) {
			alert("出力画像の形式を選択ください。");
			return;
		}

		this._showLockDialog();
		this._exportImages();
	}

	private _exportImages() {
		this.exportImagesProcess.exec(this.items, this.animationOptionData)
			.then(() => {
				this._hideLockDialog();
			}).catch(() => {
			this._hideLockDialog();

			ErrorMessage.showErrorMessage(
				this.exportImagesProcess.errorCode,
				this.exportImagesProcess.errorDetail,
				this.appConfig);
		});

	}

	/**
	 * モダールダイアログを開きます。
	 * @private
	 */
	private _showLockDialog() {
		const dialog:any = document.querySelector('dialog');
		dialog.showModal();
		dialog.style["display"] = "flex"; // こんな書き方をする必要があるのか…
		document.body.style.cursor = "progress";

		createjs.Ticker.setPaused(true); // 効かない…
	}

	/**
	 * モダールダイアログを閉じます。
	 * @private
	 */
	private _hideLockDialog() {
		const dialog:any = document.querySelector('dialog');
		dialog.close();
		dialog.style["display"] = "none"; // こんな書き方をする必要があるのか…
		document.body.style.cursor = "auto";

		createjs.Ticker.setPaused(false); // 効かない…
	}

	/**
	 * ファイル選択ボタンが押された時のハンドラーです。
	 */
	private handleClickFileSelectButton():void {
		if (this.openingDirectories === true) {
			return;
		}
		this.openingDirectories = true;
		const ipc = require('electron').ipcRenderer;
		ipc.send('open-file-dialog');
	}

	/**
	 * ファイルがセットされたときの処理です。
	 * @param filePathList
	 */
	private setFilePathList(filePathList:string[]):void {

		var path = require('path');

		const length = filePathList ? filePathList.length : 0;

		//	再度アイテムがドロップされたらリセットするように調整
		this.items = [];

		for (let i = 0; i < length; i++) {
			const filePath = filePathList[i];

			if (path.extname(filePath) == ".png") {
				path.dirname(filePath);

				const item:ImageData = new ImageData();
				item.imageBaseName = path.basename(filePath);
				item.imagePath = filePath;
				item.frameNumber = this.items.length;

				this.items.push(item);
			}
		}
		this.numbering();

		this.changeImageItems(this.items);
	}

	/**
	 * 再ナンバリングします。
	 */
	private numbering():void {

		this.items.sort(function (a, b) {
			const aRes = a.imageBaseName.match(/\d+/g);
			const bRes = b.imageBaseName.match(/\d+/g);

			const aNum = aRes ? ( aRes.length >= 1 ? parseInt(aRes.pop()) : 0 ) : 0;
			const bNum = bRes ? ( bRes.length >= 1 ? parseInt(bRes.pop()) : 0 ) : 0;

			if (aNum < bNum) return -1;
			if (aNum > bNum) return 1;
			return 0;
		});

		const length = this.items.length;
		for (let i = 0; i < length; i++) {
			this.items[i].frameNumber = i;
		}
	}

	private changeImageItems(items:ImageData[]):void {
		this.items = items;
		if (items.length >= 1) {
			this.checkImageSize(items);
			this.animationOptionData.imageInfo.length = items.length;
		}
		this.isImageSelected = this.items.length >= 1;
	}

	private checkImageSize(items:ImageData[]):void {

		new Promise((resolve:Function, reject:Function) => {

			let image = new Image();
			image.onload = (event:Event) => {
				this.animationOptionData.imageInfo.width = image.width;
				this.animationOptionData.imageInfo.height = image.height;
				resolve();
			};
			image.onerror = (event:Event) => {
				reject();
			};
			image.src = items[0].imagePath;
		}).then( () => {

			const promiseArr:Promise<any>[] = [];

			if (items.length <= 1) {
				return;
			}
			for (let i = 1; i < items.length; i++) {
				let promise = new Promise((resolve:Function, reject:Function) => {
					const path = items[i].imagePath;
					let image = new Image();
					image.onload = (event:Event) => {
						let errorFlag = false;
						if (this.animationOptionData.imageInfo.width === image.width
							&& this.animationOptionData.imageInfo.height === image.height) {
							// 何もしない
						} else {
							// 画像サイズが異なっていることを通知する
							alert(`${items[i].imageBaseName} の幅・高さが他の画像と異なっています。連番画像のサイズが統一されているか確認ください。`);
							errorFlag = true;
						}
						errorFlag ? reject() : resolve();
					};
					image.onerror = (event:Event) => {
						reject();
					};
					image.src = path;
				});
				promiseArr.push(promise);
			}
			Promise.all(promiseArr);
		});
	}
}


