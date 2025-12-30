import React, { useRef, useEffect, useState } from "react";
import { View, Text, Modal, TouchableWithoutFeedback, Animated } from "react-native";
import { fonts } from "../../styles/fonts";
import { Button } from "./Button";

export const Alert = ({
  visible,
  title,
  message,
  buttons = [],
  onClose,
}) => {
  const flipAnim = useRef(new Animated.Value(0)).current;
  const opacityAnim = useRef(new Animated.Value(0)).current;
  const [modalVisible, setModalVisible] = useState(visible);
  const [isClosing, setIsClosing] = useState(false);
  const pendingCloseCallback = useRef(null);

  useEffect(() => {
    if (visible) {
      // Reset closing state immediately when visible becomes true
      setIsClosing(false);
      // Stop any ongoing animations
      flipAnim.stopAnimation();
      opacityAnim.stopAnimation();
      // Show modal first
      setModalVisible(true);
      // Start from 90 degrees (flipped) and transparent
      flipAnim.setValue(90);
      opacityAnim.setValue(0);
      // Animate to 0 degrees (normal) and opaque
      Animated.parallel([
        Animated.spring(flipAnim, {
          toValue: 0,
          useNativeDriver: true,
          tension: 50,
          friction: 7,
        }),
        Animated.spring(opacityAnim, {
          toValue: 1,
          useNativeDriver: true,
          tension: 50,
          friction: 7,
        }),
      ]).start();
    }
  }, [visible, flipAnim, opacityAnim]);

  useEffect(() => {
    if ((!visible || isClosing) && modalVisible) {
      // Animate from 0 to -90 degrees (flip out in same direction) and fade out
      Animated.parallel([
        Animated.spring(flipAnim, {
          toValue: -90,
          useNativeDriver: true,
          tension: 50,
          friction: 7,
        }),
        Animated.spring(opacityAnim, {
          toValue: 0,
          useNativeDriver: true,
          tension: 50,
          friction: 7,
        }),
      ]).start(() => {
        // Hide modal after animation completes
        setModalVisible(false);
        // Call pending callbacks after animation completes
        const callback = pendingCloseCallback.current;
        const shouldCallOnClose = isClosing;
        // Reset states
        setIsClosing(false);
        pendingCloseCallback.current = null;
        // Call callbacks after state reset
        if (callback) {
          callback();
        }
        // Call onClose after animation completes if it was triggered by button click
        if (onClose && shouldCallOnClose) {
          onClose();
        }
      });
    }
  }, [visible, isClosing, modalVisible, flipAnim, opacityAnim, onClose]);

  const handleClose = () => {
    // Set closing state to trigger exit animation
    setIsClosing(true);
  };

  const rotateX = flipAnim.interpolate({
    inputRange: [-90, 0, 90],
    outputRange: ['-90deg', '0deg', '90deg'],
  });

  if (!modalVisible) return null;

  return (
    <Modal
      transparent
      visible={modalVisible}
      animationType="none"
      onRequestClose={handleClose}
      className="absolute top-0 left-0 right-0 bottom-0"
    >
      <TouchableWithoutFeedback onPress={handleClose}>
        <Animated.View 
          className="justify-center items-center bg-[#222]"
          style={{ 
            opacity: opacityAnim,
          }}
        >
          <TouchableWithoutFeedback onPress={(e) => e.stopPropagation()}>
            <Animated.View 
              className="p-2 w-full" 
              style={{ 
                maxWidth: 400,
                transform: [{ rotateX }, { perspective: 1000 }],
              }}
            >
              {title && (
                <Text className="text-white text-xl mb-3" style={fonts.semiBold}>
                  {title}
                </Text>
              )}
              {message && (
                <Text className="text-white text-base mb-6" style={fonts.regular}>
                  {message}
                </Text>
              )}
              <View className="flex flex-row justify-start">
                {buttons.map((button, index) => {
                  const isDestructive = button.style === "destructive";
                  const isCancel = button.style === "cancel";
                  
                  let buttonClassOverride = "px-4";
                  
                  return (
                    <View key={index} style={{ flex: 1, marginRight: index < buttons.length - 1 ? 12 : 0, maxWidth: '50%' }}>
                      <Button
                        text={button.text}
                        onPress={() => {
                          // Store the button's onPress callback to call after animation
                          if (button.onPress) {
                            pendingCloseCallback.current = button.onPress;
                          }
                          // Start exit animation (will call onClose after animation completes)
                          handleClose();
                        }}
                        classOverride={buttonClassOverride}
                      />
                    </View>
                  );
                })}
              </View>
            </Animated.View>
          </TouchableWithoutFeedback>
        </Animated.View>
      </TouchableWithoutFeedback>
      <Animated.View className="flex-1" style={{ backgroundColor: "#00000050", opacity: opacityAnim }}/>
    </Modal>
  );
};

