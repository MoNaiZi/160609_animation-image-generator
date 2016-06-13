import {CompressionType} from "../type/compression-type";
export class AnimationImageOptions {

	noLoop:boolean;
	loop:number;
	compression:CompressionType;
	iterations:number;
	fps:number;
	pngCompress:boolean;
	
	exportAPNG:boolean;
	exportWebP:boolean;
	exportHTML:boolean;

	/** 画像の情報です。 */
	imageInfo:{width:number, height:number, length:number} = {width: 0, height: 0, length: 0};
}