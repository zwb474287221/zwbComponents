import React from 'react';
import {Image, StyleProp, View, ImageStyle, StyleSheet} from "react-native";

export interface AvatarProps {
  uri?: string | number;
  size?: number;
  radius?: number;
  style?: StyleProp<ImageStyle>;
  children?: React.ReactNode;
}

const AvatarStyle = (size: number, radius?: number) => {
  return {
    height: size,
    width: size,
    borderRadius: radius ?? size / 2,
  };
};

const Avatar = (props: AvatarProps) => {
  const {uri, size = 60, radius, style, children, ...other} = props;
  const source = typeof uri === 'string' ? {uri} : uri;
  return <View>
    <View style={[AvatarStyle(size, radius), {overflow: "hidden"}, style]}>
      <Image
        style={{flex:1}}
        source={source}
        resizeMode={"cover"}
        {...other}
      />
      <View style={StyleSheet.absoluteFillObject}>
        {children}
      </View>
    </View>
  </View>
}

export default React.memo(Avatar);
