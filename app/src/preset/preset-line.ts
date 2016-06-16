import {CompressionType} from "../type/compression-type";
import {AnimationImageOptions} from "../data/animation-image-options";
import {PresetType} from "../type/preset-type";

/**
 * LINEアニメーションスタンプのプリセット設定です。
 */
export class PresetLine {

	static setPreset(data:AnimationImageOptions) {
		data.noLoop = false;
		data.loop = 4;
		//data.iterations = 15;
		data.fps = 20;
		data.compression = CompressionType.zlib;
		data.enabledPngCompress = true;

		data.enabledExportApng = true;
		data.enabledExportWebp = false;
		data.enabledExportHtml = false;

		data.preset = PresetType.LINE;

	}
}