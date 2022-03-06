import React, {Component} from 'react';
import {StyleSheet, Modal, Pressable, StyleProp, ViewStyle, ModalProps, View} from 'react-native';

interface MaskProps extends ModalProps {
  visible: boolean;
  close: () => void,
  backgroundOnPress?: boolean,
  maskStyle?: StyleProp<ViewStyle>;
  children: React.ReactNode;
}

const Mask = (props: MaskProps) => {
    //showMask 是否显示Modal
    //close 关闭Modal
    //backgroundOnPress 点击背景是否可以关闭
    const {
      visible,
      close,
      backgroundOnPress = true,
      maskStyle,
      children,
      ...other
    } = props;
    const BackView = backgroundOnPress ? Pressable : View;
    const BackViewProp = {
      style: [styles.mask, maskStyle],
      onPress: backgroundOnPress ? () => {
        close?.();
      } : void 0,
    }
    return (
      <Modal
        animationType={'fade'}
        transparent={true}
        visible={visible}
        statusBarTranslucent={true}
        onRequestClose={close}
        {...other}
      >
        <BackView {...BackViewProp}>
          {children}
        </BackView>
      </Modal>
    );
}

const styles = StyleSheet.create({
  mask: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'center',
  },
});

export default Mask;
