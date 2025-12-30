import React, { useRef, useEffect, useState } from "react";
import { View, Text, Animated } from "react-native";
import { fonts } from "../../styles/fonts";

export const Toast = ({
  visible,
  message,
  type = "error", // 'error' or 'success'
  duration = 2000,
  onHide,
}) => {
  const opacityAnim = useRef(new Animated.Value(0)).current;
  const [toastVisible, setToastVisible] = useState(visible);

  useEffect(() => {
    if (visible) {
      setToastVisible(true);
      // Reset animation
      opacityAnim.setValue(0);
      
      // Fade in
      Animated.spring(opacityAnim, {
        toValue: 1,
        useNativeDriver: true,
        tension: 50,
        friction: 7,
      }).start();

      // Auto-dismiss after duration
      const timer = setTimeout(() => {
        handleHide();
      }, duration);

      return () => clearTimeout(timer);
    } else {
      handleHide();
    }
  }, [visible, duration]);

  const handleHide = () => {
    Animated.spring(opacityAnim, {
      toValue: 0,
      useNativeDriver: true,
      tension: 50,
      friction: 7,
    }).start(() => {
      setToastVisible(false);
      if (onHide) {
        onHide();
      }
    });
  };

  if (!toastVisible) return null;

  const backgroundColor = "#046ab8";

  return (
    <Animated.View
      style={{
        position: "absolute",
        top: 0,
        left: 0,
        right: 0,
        zIndex: 9999,
        opacity: opacityAnim,
      }}
    >
      <View
        className="px-4 py-3 rounded"
        style={{ backgroundColor }}
      >
        <Text className="text-white text-base" style={fonts.regular}>
          {message}
        </Text>
      </View>
    </Animated.View>
  );
};

