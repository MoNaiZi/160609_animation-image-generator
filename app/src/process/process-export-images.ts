import {AnimationImageOptions} from "../data/animation-image-options";
import {ImageData} from "../data/image-data";
import {PresetType} from "../type/preset-type";
import {LineStampValidator} from "../validators/LineStampValidator";
import {CompressionType} from "../type/compression-type";

declare function require(value:String):any;

export class ProcessExportImage {

	private temporaryPath:string;
	private selectedPath:string;
	private selectedDirectory:string;
	private selectedBaseName:string;
	private itemList:ImageData[];

	private animationOptionData:AnimationImageOptions;

	constructor() {

		//	テンポラリパス生成
		const remote = require('electron').remote;
		const app = remote.app;
		const path = require('path');

		this.temporaryPath = path.join(app.getPath('temp'), "a-img-generator");
	}

	public  exec(filePath:string, itemList:ImageData[], animationOptionData:AnimationImageOptions):Promise<any> {
		const path = require('path');
		this.itemList = itemList;

		this.animationOptionData = animationOptionData;
		this.selectedPath = filePath;
		const pathArr = filePath.split("/");
		this.selectedBaseName = pathArr.pop().split(".").shift();
		this.selectedDirectory = pathArr.join("/");

		return new Promise((resolve:Function, reject:Function) => {

			this._cleanTemporary()
				.then(() => {
					return this._copyTemporaryDirectory();
				})
				.then(() => {
					console.log("copyTemporaryDirectory1:success");
					// APNG書き出しが有効になっている場合
					if (this.animationOptionData.enabledExportApng == true) {
						return this._generateApng();
					}
				})
				.then(() => {
					console.log("copyTemporaryDirectory2:success");
					// WebP書き出しが有効になっている場合
					if (this.animationOptionData.enabledExportWebp == true) {
						return this._generateWebp();
					}
				})
				.then(()=> {
					console.log("copyTemporaryDirectory3:success");
					// APNGとWebP画像の両方書き出しが有効になっている場合
					if (this.animationOptionData.enabledExportHtml == true) {
						this._generateHtml();
					}
				})
				.then(()=> {
					// エクスプローラーで開くでも、まだいいかも
					const {shell} = require('electron');
					shell.showItemInFolder(this.selectedPath);

					resolve();
				})
				.catch(()=> {
					reject();
				});

		});

	}

	/**
	 * 作業用フォルダーのクリーンアップ
	 * @returns {Promise<any>}
	 * @private
	 */
	private _cleanTemporary():Promise<any> {
		return new Promise(((resolve:Function, reject:Function) => {

			const del = require('del');
			const path = require('path');
			const pngTemporary = path.join(this.temporaryPath, "*.*");

			del([pngTemporary], {force: true}).then((paths:string[]) => {
				const fs = require('fs');

				let stat:any = fs.statSync(this.temporaryPath);

				// フォルダーが存在していなければ
				if (stat.isDirectory() == false) {
					// フォルダーを作成
					fs.mkdirSync(this.temporaryPath);
				}
				console.log("clean-temporary:success");
				resolve();
			});
		}));
	}

	private _copyTemporaryDirectory() {
		const promises:Promise<any>[] = this.itemList.map((item) => {
			return this._copyTemporaryImage(item);
		});
		return Promise.all(promises);
	}

	private _copyTemporaryImage(item):Promise<any> {
		return new Promise((resolve:Function, reject:Function) => {

			const fs = require('fs');
			const path = require('path');
			const src = item.imagePath;

			const destination:string = path.join(this.temporaryPath, `frame${item.frameNumber}.png`);

			const r = fs.createReadStream(src);
			const w = fs.createWriteStream(destination);

			r.on("error", (err:any) => {
				reject(err);
			});
			w.on("error", (err:any) => {
				reject(err);
			});
			w.on("close", (ex:any) => {
				resolve();
			});
			r.pipe(w);
		});
	}

	/**
	 * APNG画像を保存します。
	 * @returns {Promise<T>}
	 * @private
	 */
	private _generateApng():Promise<any> {
		return new Promise(((resolve:Function, reject:Function) => {
			const remote = require('electron').remote;
			const path = require('path');
			const app = remote.app;
			const appPath:string = app.getAppPath();

			const exec = require('child_process').execFile;
			const pngPath = path.join(this.temporaryPath, "frame*.png");

			const compressOptions = this.getCompressOption(this.animationOptionData.compression);
			const loopOption = "-l" + ( this.animationOptionData.noLoop ? 0 : this.animationOptionData.loop - 1 );
			const options = [
				`${this.selectedDirectory}/${this.selectedBaseName}.png`,
				pngPath,
				"1",
				this.animationOptionData.fps,
				compressOptions,
				loopOption];

			exec(`${appPath}/bin/apngasm`, options, (err:any, stdout:any, stderr:any) => {

				if (!err) {
					// TODO 書きだしたフォルダーを対応ブラウザーで開く (OSで分岐)
					//exec(`/Applications/Safari.app`, [this.apngPath]);

					if (this.animationOptionData.preset == PresetType.LINE) {
						const validateArr = LineStampValidator.validate(this.selectedPath, this.animationOptionData);

						if (validateArr.length > 0) {
							alert(validateArr.join("\n\n"));
						}
					}
					console.error("generateAPNG:success");
					resolve();
				} else {
					console.error("generateAPNG:error\n→" + stderr);
					reject();
				}
			});
		}));

	}

	/**
	 * WEBP アニメーション画像を作ります。
	 * @returns {Promise<T>}
	 * @private
	 */
	private _generateWebp():Promise<any> {
		return new Promise(((resolve:Function, reject:Function) => {
			const remote = require('electron').remote;
			const path = require('path');
			const app = remote.app;
			const appPath:string = app.getAppPath();

			const execFile = require('child_process').execFile;
			const pngPath = path.join(this.temporaryPath);

			const options:string[] = [];
			const frameMs = Math.round(1000 / this.animationOptionData.fps);

			const pngFiles:string[] = [];
			for (let i = 0; i < this.itemList.length; i++) {
				// なんかおかしい
				options.push(`-frame`);
				options.push(`${pngPath}/frame${i}.png.webp`);
				options.push(`+${frameMs}+0+0+1`);
				pngFiles.push(`${pngPath}/frame${i}.png`);
			}

			if (this.animationOptionData.noLoop == false) {
				options.push(`-loop`);
				options.push(`${this.animationOptionData.loop - 1}`);
			}

			options.push(`-o`);
			options.push(`${this.selectedDirectory}/${this.selectedBaseName}.webp`);

			this._convertPng2Webps(pngFiles).then(()=> {
				execFile(`${appPath}/bin/webpmux`, options, (err:string, stdout:string, stderr:string) => {
					if (!err) {
						resolve();
					} else {
						console.error(stderr);
						reject();
					}
				});
			}).catch(()=> {
				reject();
			});
		}));

	}

	private _convertPng2Webps(pngPaths:string[]):Promise<any> {
		const promises:Promise<any>[] = [];
		for (let i = 0; i < pngPaths.length; i++) {
			promises.push(this._convertPng2Webp(pngPaths[i]));
		}

		return new Promise(((resolve:Function, reject:Function)=> {
			Promise.all(promises).then(()=> {
				resolve();
			}).catch(()=> {
				reject();
			})
		}));
	}

	private _convertPng2Webp(filePath:string):Promise<any> {
		const remote = require('electron').remote;
		const appPath:string = remote.app.getAppPath();
		const execFile = require('child_process').execFile;

		return new Promise(((resolve:Function, reject:Function)=> {
			execFile(`${appPath}/bin/cwebp`, [filePath, `-o`, `${filePath}.webp`],
				(err:any, stdout:any, stderr:any) => {
					if (!err) {
						resolve();
					} else {
						reject();
						console.error(stderr);
					}
				});
		}));
	}

	/**
	 * HTMLファイルを作成します。
	 * @private
	 */
	private _generateHtml():void {

		const fs = require('fs');

		const fileName:string = this.selectedBaseName;

		let imageElement:string;

		if (this.animationOptionData.enabledExportApng && this.animationOptionData.enabledExportWebp) {
			imageElement = `
    <!-- Chrome と Firefox と Safari で再生可能 (IE, Edge ではアニメは再生できません) -->	
    <picture>
	  <!-- Chrome 用 -->
      <source type="image/webp" srcset="${fileName}.webp" />
      <!-- Firefox, Safari 用 -->
      <img src="${fileName}.png" width="${this.animationOptionData.imageInfo.width}" height="${this.animationOptionData.imageInfo.height}" alt="" />
    </picture>`;
		} else if (this.animationOptionData.enabledExportApng) {
			imageElement = `
	<!-- Firefox と Safari で再生可能 (Chrome, IE, Edge ではアニメは再生できません) -->
    <img src="${fileName}.png" width="${this.animationOptionData.imageInfo.width}" height="${this.animationOptionData.imageInfo.height}" alt="" />`;
		} else if (this.animationOptionData.enabledExportWebp) {
			imageElement = `
	<!-- Chrome で再生可能 (IE, Edge, Firefox, Safari では表示できません) -->
    <img src="${fileName}.webp" width="${this.animationOptionData.imageInfo.width}" height="${this.animationOptionData.imageInfo.height}" alt="" />`;
		} else {
			return;
		}

		let data = `<!DOCTYPE html>
<html>
  <head>
    <meta charset="UTF-8" />
  </head>
  <body>
  	${imageElement}
  	
  </body>
</html>`;

		fs.writeFileSync(`${this.selectedDirectory}/${this.selectedBaseName}.html`, data);
	}

	private getCompressOption(type:CompressionType) {
		switch (type) {
			case CompressionType.zlib:
				return "-z0";
			case CompressionType.zip7:
				return "-z1";
			case CompressionType.Zopfli:
				return "-z2";
		}
	}

}