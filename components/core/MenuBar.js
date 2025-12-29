import { useState, useRef, useEffect, memo  } from "react";
import {
  View,
  Text,
  TouchableWithoutFeedback,
  LayoutAnimation,
  Platform,
  UIManager,
  ScrollView,
  Animated,
} from "react-native";
import RoundedButton from "./RoundedButton";
import * as Animatable from "react-native-animatable";
import { fonts } from "../../styles/fonts";

// Enable LayoutAnimation for Android
if (
  Platform.OS === "android" &&
  UIManager.setLayoutAnimationEnabledExperimental
) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

const ShortMenu = ({ children, handleExpand }) => {
  return (
    <View className="bg-[#222222] h-14 w-full flex flex-row justify-between items-center">
      {children}
      <TouchableWithoutFeedback onPress={handleExpand}>
        <View className="w-[15%] h-full items-start justify-center flex flex-row gap-1 pt-2">
          
        <View
            style={{
              width: 5,
              height: 5,
              backgroundColor: "white",
              borderRadius: 5,
            }}
          />
          <View
            style={{
              width: 5,
              height: 5,
              backgroundColor: "white",
              borderRadius: 5,
            }}
          />
          <View
            style={{
              width: 5,
              height: 5,
              backgroundColor: "white",
              borderRadius: 5,
            }}
          />
        </View>
      </TouchableWithoutFeedback>
    </View>
  );
};

const MenuBarComponent = ({ options, controls, height = 14, navBarRef, keyboardHeight = 0 }) => {
  const { state: expanded, handler: setExpanded } = navBarRef

  const contentHeight = useRef(new Animated.Value(60)).current;
  const bottomPosition = useRef(new Animated.Value(0)).current;
  const keyboardHeightRef = useRef(keyboardHeight);
  
  const animateExpand = () => {
    // Start height animation
    Animated.timing(contentHeight, {
      toValue: expanded ? 350 : 60,
      duration: 250,
      useNativeDriver: false,
    }).start();
  }

  useEffect(() => {
    animateExpand()
  }, [expanded])

  useEffect(() => {
    // Only animate if keyboardHeight actually changed
    if (keyboardHeightRef.current !== keyboardHeight) {
      keyboardHeightRef.current = keyboardHeight;
      Animated.timing(bottomPosition, {
        toValue: keyboardHeight,
        duration: 250,
        useNativeDriver: false,
      }).start();
    }
  }, [keyboardHeight])

  const toggleExpand = () => {
    // Start height animation
    animateExpand();
    // Update state after animation starts
    setExpanded(!expanded);
  };

  return (
    <Animated.View 
      style={{
        height: contentHeight,
        marginBottom: 0,
        flexDirection: 'row',
        backgroundColor: '#222',
        position: 'absolute',
        bottom: bottomPosition,
        width: '100%',
        overflow: 'hidden', // Important to prevent content from showing during animation
      }}
    >
      <View className="w-full">
        <ShortMenu handleExpand={toggleExpand}>
          {controls}
        </ShortMenu>
        
        {expanded && (
          <ScrollView className="w-full">
            <View className="w-full">
              {options}
            </View>
          </ScrollView>
        )}
      </View>
    </Animated.View>
  );
};

export const MenuBar = memo(MenuBarComponent, (prevProps, nextProps) => {
  // Re-render only if these props change (keyboardHeight changes handled via useEffect)
  const shouldUpdate = (
    prevProps.options !== nextProps.options ||
    prevProps.controls !== nextProps.controls ||
    prevProps.height !== nextProps.height ||
    prevProps.navBarRef.state !== nextProps.navBarRef.state ||
    prevProps.navBarRef.handler !== nextProps.navBarRef.handler
  );
  // Return true to prevent re-render, false to allow it
  return !shouldUpdate;
});

export const QuickMenu = ({ options, disabled = false }) => {
  const [expanded, setExpanded] = useState(false);
  const heightAnim = useRef(new Animated.Value(60)).current;

  const toggleExpand = () => {
    setExpanded(!expanded);
    Animated.timing(heightAnim, {
      toValue: expanded ? 60 : 80,
      duration: 150,
      useNativeDriver: false,
    }).start();
  };

  return (
    <Animated.View
      style={{
        height: heightAnim,
        marginBottom: 0,
        flexDirection: "row",
        backgroundColor: "#222",
        position: "absolute",
        bottom: 0,
        width: "100%",
      }}
    >
      <View style={{ width: "15%" }} />
      <View
        style={{ width: "70%", justifyContent: "center", flexDirection: "row" }}
      >
        {options.map((option, index) => {
          return (
            <View
              style={{
                flexDirection: "column",
                justifyContent: "center",
                alignItems: "center",
                marginHorizontal: 16,
                marginVertical: 8,
                marginBottom: 12,
                paddingHorizontal: 4,
              }}
              key={index}
            >
              <RoundedButton
                Icon={option.Icon}
                action={option.onPress}
                disabled={disabled}
              />
              {expanded && (
                <Animatable.View
                  animation="fadeIn"
                  duration={300}
                  style={{
                    flex: 1,
                    flexDirection: "row",
                    justifyContent: "center",
                    marginTop: 4,
                  }}
                >
                  <Text
                    className="text-xs"
                    style={[
                      { color: disabled ? "#8a8a8a" : "white" },
                      fonts.light,
                    ]}
                  >
                    {option.text}
                  </Text>
                </Animatable.View>
              )}
            </View>
          );
        })}
      </View>
      <TouchableWithoutFeedback onPress={toggleExpand}>
        <View
          style={{
            width: "15%",
            height: "100%",
            alignItems: "flex-start",
            justifyContent: "center",
            flexDirection: "row",
            gap: 4,
            paddingTop: 8,
          }}
        >
          <View
            style={{
              width: 5,
              height: 5,
              backgroundColor: "white",
              borderRadius: 5,
            }}
          />
          <View
            style={{
              width: 5,
              height: 5,
              backgroundColor: "white",
              borderRadius: 5,
            }}
          />
          <View
            style={{
              width: 5,
              height: 5,
              backgroundColor: "white",
              borderRadius: 5,
            }}
          />
        </View>
      </TouchableWithoutFeedback>
    </Animated.View>
  );
};
