import { Text, TouchableWithoutFeedback, View, Animated, Easing } from "react-native";
import { fonts } from "../../styles/fonts";
import { useEffect, useState, useRef } from "react";
import * as Animatable from "react-native-animatable";

export const Select = ({
  options,
  onChange,
  title,
  classOverride = "",
  defaultValue,
}) => {
  const [selected, setSelected] = useState(null);
  const [expanded, setExpanded] = useState(false);
  const [expandedHeight, setExpandedHeight] = useState(40);
  const heightAnim = useRef(new Animated.Value(40)).current;
  const contentRef = useRef(null);
  
  const AnimatedView = Animatable.createAnimatableComponent(View);

  useEffect(() => {
    if (options && options.length > 0) {
      // Try to find the option matching defaultValue
      const foundOption = options.find((option) => option.value === defaultValue);
      if (foundOption) {
        setSelected(foundOption);
      } else {
        // Fallback to first option if defaultValue not found
        setSelected(options[0]);
      }
    }
  }, [defaultValue, options]);

  useEffect(() => {
    Animated.timing(heightAnim, {
      toValue: expanded ? expandedHeight : 40,
      duration: 150,
      easing: Easing.out(Easing.cubic),
      useNativeDriver: false,
    }).start();
  }, [expanded, expandedHeight]);

  // Don't render if no options or no selected option
  if (!options || options.length === 0 || !selected) {
    return (
      <View className={`flex ${classOverride}`}>
        <Text className="text-[#b0b0b0] text-base" style={fonts.light}>
          {title}
        </Text>
        <View className="mt-2 w-full pr-4 pl-2 py-1 text-base border-white border-[2.5px] border-solid justify-center item-center">
          <Text className="text-white text-base" style={fonts.regular}>
            Loading...
          </Text>
        </View>
      </View>
    );
  }

  return (
    <View className={`flex ${classOverride}`}>
      <Text className="text-[#b0b0b0] text-sm" style={fonts.regular}>
        {title}
      </Text>
      <View className="mt-2 w-full overflow-hidden">
        <Animated.View
          style={{
            height: heightAnim,
            overflow: 'hidden',
          }}
        >
          {expanded ? (
            <View
              ref={contentRef}
              style={{
                backgroundColor: 'white',
                borderColor: '#a013ec',
                borderWidth: 2,
                paddingVertical: 8,
                paddingRight: 16,
                paddingLeft: 8,
              }}
              onLayout={(event) => {
                const { height } = event.nativeEvent.layout;
                if (height > 0 && Math.abs(expandedHeight - height) > 1) {
                  setExpandedHeight(Math.ceil(height));
                }
              }}
            >
              {options.map((option, index) => {
                return (
                  <View
                    key={index}
                  >
                    <TouchableWithoutFeedback
                      onPress={async () => {
                        setSelected(option);
                        await onChange(option);
                        setExpanded(false);
                      }}
                    >
                      <View
                        className={`flex flex-row items-center justify-between py-1`}
                      >
                        <Text
                          className={`text-base ${
                            selected.value === option.value
                              ? "text-[#a013ec]"
                              : "text-black"
                          }`}
                          style={fonts.regular}
                        >
                          {option.name}
                        </Text>
                      </View>
                    </TouchableWithoutFeedback>
                  </View>
                );
              })}
            </View>
          ) : (
            <View className="w-full pr-4 pl-2 py-1 text-base border-white border-[2.5px] border-solid justify-center item-center">
              <TouchableWithoutFeedback onPress={() => setExpanded(true)}>
                <View className="flex flex-row items-center">
                  <Text className="text-white text-base" style={fonts.regular}>
                    {selected.name}
                  </Text>
                </View>
              </TouchableWithoutFeedback>
            </View>
          )}
        </Animated.View>
      </View>
    </View>
  );
};
