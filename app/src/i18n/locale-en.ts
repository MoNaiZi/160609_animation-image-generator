import {LocaleData} from "./locale-data";
"use strict";

export class LocaleEnData extends LocaleData {
	PROP_use:string = "Type";
	PROP_useItemLine:string = "LINE Animation Stamp";
	PROP_useItemWeb:string = "Animation Image for Website";

	PROP_tabAnim:string = "Animation";
	PROP_tabQuality:string = "Quality";

	PROP_tabAnimFps:string = "Framerate";
	PROP_tabAnimLoop:string = "Playback";
	PROP_tabAnimLoopNum:string = "Loop";
	PROP_tabAnimLoopInitiny:string = "Inifinity";

	PROP_tabAnimFpsTooltip:string = "";
	PROP_tabAnimLoopTooltip:string = "1 to 4 Loops";

	PROP_tabQualityApngOpt:string = "Optimization";
	PROP_tabQualityOptWay:string = "Compression Method";

	PROP_tabQualityApngOptTooltip:string = "";
	PROP_tabQualityOptWayZopfli:string = "";
	PROP_tabQualityOptWay7zip:string = "";
	PROP_tabQualityOptWayzlib:string = "";

	PROP_tabQualityHApng:string = "Export as APNG";
	PROP_tabQualityHWebp:string = "Export as WebP";
	PROP_tabQualityHHtml:string = "Export as HTML";

	ROP_tabQualityHApngTooltip:string = "";
	PROP_tabQualityHWebpTooltip:string = "";
	PROP_tabQualityHHtmlTooltip:string = "";


	PROP_btnSave:string = "Export";

	PREV_selectDrop:string = "Drop files (PNG)";
	PREV_selectOr:string = "or";
	PREV_btnSelect:string = "Select Files";

	PREV_infoFrameSize:string = "Frame Size";
	PREV_infoFrameNum:string = "Frame Amount";
	PREV_infoTime:string = "Time";
	PREV_infoTimeUnit:string = "sec";
	PREV_zoom:string = "Zoom";
	PREV_btnSelectRe:string = "Select Files";
	PREV_preview:string = "Preview Frame";

	TOP_version:string = "Version";
	TOP_icsTooltip:string = "Go Production Website";
	TOP_onlineHelpTooltip:string = "Report Issues";

	MENU_about:string = "About Animation Image Converter";
	MENU_quit:string = "Quit Animation Image Converter";
	MENU_help:string = "Help";
	MENU_helpOnline:string = "Online Help";
	MENU_helpQuestion:string = "Report Issues";
}