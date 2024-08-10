import { useState } from "react";
import {
  View,
  Text,
  TouchableWithoutFeedback,
  LayoutAnimation,
  Platform,
  UIManager,
  ScrollView,
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
          <View className="w-1 h-1 bg-white rounded-full" />
          <View className="w-1 h-1 bg-white rounded-full" />
          <View className="w-1 h-1 bg-white rounded-full" />
        </View>
      </TouchableWithoutFeedback>
    </View>
  );
};

export const MenuBar = ({ options, controls, height = 14 }) => {
  const [expanded, setExpanded] = useState(false);
  return <Animatable.View
    transition={["height"]}
    duration={250}
    style={{
      // if this looks ugly, its probable because of the hardcoded values
      height: expanded ? 350 : 60,
      marginBottom: 0,
      flexDirection: "row",
      backgroundColor: "#222",
      position: "absolute",
      bottom: 0,
      width: "100%",
    }}
  >
    {expanded ? (
      <View className={`bg-[#222222] w-full flex flex-col`}>
        <ShortMenu handleExpand={() => setExpanded(false)}>
          {controls}
        </ShortMenu>
        <ScrollView className="w-full h-full">
          <View className="flex flex-col gap-16 w-full">
            {/* sadly there is no gap in react-native yet */}
            {options}
          </View>
        </ScrollView>
      </View>
    ) : (
      <ShortMenu handleExpand={() => setExpanded(true)}>{controls}</ShortMenu>
    )}
  </Animatable.View>;
  // if (!expanded) {
  //   return (
  //   );
  // } else {
  //   return (

  //   );
  // }
};

export const QuickMenu = ({ options, disabled = false }) => {
  const [expanded, setExpanded] = useState(false);

  const toggleExpand = () => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setExpanded(!expanded);
    console.log(options)
  };

  return (
    <Animatable.View
      transition={["height"]}
      duration={500}
      style={{
        // if this looks ugly, its probable because of the hardcoded values
        height: expanded ? 80 : 60,
        marginBottom: 0,
        flexDirection: "row",
        backgroundColor: "#222",
        position: "absolute",
        bottom: 0,
        width: "100%",
      }}
    >
      <View className="w-[15%] flex" />
      <View className="w-[70%] justify-center flex-row">
        {options.map((option, index) => {
          return (
            <View
              className="flex flex-col justify-center items-center mx-4 my-2 mb-3 px-1"
              key={index}
            >
              <RoundedButton Icon={option.Icon} action={option.onPress} disabled={disabled}/>
              {expanded && (
                <View className="flex flex-1 flex-row justify-center mt-1">
                  <Text className={`${disabled ? "text-[#8a8a8a]" : "text-white"} text-[10px]`} style={fonts.light}>
                    {option.text}
                  </Text>
                </View>
              )}
            </View>
          );
        })}
      </View>
      <TouchableWithoutFeedback onPress={toggleExpand}>
        <View className="w-[15%] h-full items-start justify-center flex flex-row gap-1 pt-2">
          <View className="w-1 h-1 bg-white rounded-full" />
          <View className="w-1 h-1 bg-white rounded-full" />
          <View className="w-1 h-1 bg-white rounded-full" />
        </View>
      </TouchableWithoutFeedback>
    </Animatable.View>
  );
};
