/*
设备的像素密度，例如：
PixelRatio.get() === 1          mdpi Android 设备 (160 dpi)
PixelRatio.get() === 1.5        hdpi Android 设备 (240 dpi)
PixelRatio.get() === 2          iPhone 4, 4S,iPhone 5, 5c, 5s,iPhone 6,xhdpi Android 设备 (320 dpi)
PixelRatio.get() === 3          iPhone 6 plus , xxhdpi Android 设备 (480 dpi)
PixelRatio.get() === 3.5        Nexus 6       */
import {Dimensions, Platform, PixelRatio} from 'react-native';

export const isAndroid = Platform.OS === 'android';
export const isIos = Platform.OS === 'ios';
//手机屏幕的高度
export const deviceWidth = Dimensions.get('window').width; // 设备的宽度
export const deviceHeight = Dimensions.get('screen').height; // 设备的高度


const defaultPixel = PixelRatio.get(); // iphone6的像素密度

const fontScale = PixelRatio.getFontScale(); // 返回字体大小缩放比例
const pixelRatio = PixelRatio.get(); // 当前设备的像素密度
export const RVW = deviceWidth / 100;
export const RVH = deviceHeight / 100;
export const RFT = RVW / fontScale;
export const RPX = 1 / pixelRatio;

// px转换成dp
export const w2 = 375 / defaultPixel;
const scale = deviceWidth / w2; // 获取缩放比例

export function scaleSize(size: number) {
  size = Math.floor(size * scale);
  return size / defaultPixel;
}

//字体缩放比例，一般情况下不用考虑。
//当应用中的字体需要根据手机设置中字体大小改变的话需要用到缩放比例
export const fontscale = PixelRatio.getFontScale();
