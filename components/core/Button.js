import { Text, TouchableWithoutFeedback, View } from "react-native";
import { fonts } from "../../styles/fonts";

export const Button = ({
  text,
  onPress,
  disabled = false,
  classOverride = "",
  isLowerCase = true,
}) => {
  return (
    <TouchableWithoutFeedback onPress={onPress}>
      <View
        className={`w-fit flex items-center justify-center border-2 border-solid ${
          disabled ? "border-grey" : "border-white"
        } py-1 px-2 ${classOverride}`}
      >
        <Text
          className={`text-white text-[15px] ${isLowerCase && "lowercase"}`}
          style={fonts.regular}
        >
          {text}
        </Text>
      </View>
    </TouchableWithoutFeedback>
  );
};
