import { Text, TextInput, View } from "react-native";
import { fonts } from "../../styles/fonts";
import { useState, useRef, useEffect } from "react";

export const TextBox = ({
  defaultValue,
  onChangeText,
  onSubmitText,
  classOverrides = "",
  title = "",
  placeholder = "Enter URL",
  boxOverrides = "",
}) => {
  const [focused, setFocused] = useState(false);
  const inputRef = useRef(null);

  const handleFocus = () => {
    setFocused(true);
    // Use setTimeout to ensure the selection happens after focus
    setTimeout(() => {
      if (inputRef.current && defaultValue) {
        inputRef.current.setSelection(0, defaultValue.length);
      }
    }, 100);
  };

  const handleBlur = () => {
    setFocused(false);
  };

  useEffect(() => {
    if (!focused && inputRef.current) {
      inputRef.current.setSelection(0, 0);
    }
  }, [focused]);

  if (title === "") {
    return (
      <TextInput
        ref={inputRef}
        className={`bg-[#c9c9c9] w-full h-10 px-4 text-base ${classOverrides}`}
        style={fonts.regular}
        cursorColor={"black"}
        selectionColor={"#a013ec"}
        placeholder={placeholder}
        defaultValue={defaultValue}
        onChangeText={onChangeText}
        onSubmitEditing={onSubmitText}
        onFocus={handleFocus}
        onBlur={handleBlur}
        textAlign="left"
        autoCorrect={false}
        autoCapitalize="none"
      />
    );
  } else {
    return (
      <View className={`flex w-full ${classOverrides}`}>
        <Text className="text-[#b0b0b0] text-[13px] mb-1" style={fonts.light}>
          {title}
        </Text>
        <TextInput
          className={`${
            focused ? "bg-white" : "bg-[#bfbfbf]"
          }  w-full h-9 px-4 text-[15px] ${boxOverrides}`}
          style={fonts.regular}
          cursorColor={"black"}
          selectionColor={"#a013ec"}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          placeholder={placeholder}
          defaultValue={defaultValue}
          onChangeText={onChangeText}
          onSubmitEditing={onSubmitText}
        />
      </View>
    );
  }
};
