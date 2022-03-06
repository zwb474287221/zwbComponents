//判断是否有定位权限
import {PermissionsAndroid, Platform} from 'react-native';
import {isAndroid} from './ScreenUtil';

/**
 * android获取定位权限
 */
export const checkPermissionsLocation = (callback) => {
  if (isAndroid && Platform.Version >= 23) {
    const permissions = [
      PermissionsAndroid.PERMISSIONS.ACCESS_COARSE_LOCATION,
      PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
    ];
    PermissionsAndroid.requestMultiple(permissions).then(granted => {
      if (
        granted['android.permission.ACCESS_COARSE_LOCATION'] === 'granted' &&
        granted['android.permission.ACCESS_FINE_LOCATION'] === 'granted'
      ) {
        callback && callback(granted['android.permission.ACCESS_FINE_LOCATION'] === 'granted');
      }
    });
  }
};
