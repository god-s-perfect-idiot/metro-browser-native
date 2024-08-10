import { Text, TouchableWithoutFeedback, View } from "react-native";
import { fonts } from "../../styles/fonts";

const Link = ({
  to,
  disabled = false,
  classOverride = "",
  onPress = () => {},
  isLowerCase = true,
  text,
  numberOfLines = 1,
  helper,
}) => {
  return (
    <TouchableWithoutFeedback onPress={onPress}>
      <View className="flex flex-col items-start">
        <Text
          className={`${
            disabled ? "text-[#8a8a8a]" : "text-white"
          } ${classOverride} ${isLowerCase && "lowercase"}`}
          style={fonts.light}
          numberOfLines={numberOfLines}
        >
          {text}
        </Text>
        {helper && <Text className="text-[#8a8a8a]" numberOfLines={1}>{helper}</Text>}
      </View>
    </TouchableWithoutFeedback>
  );
};

export default Link;
