import { View, Text, TouchableWithoutFeedback } from "react-native";
import { Copy } from "react-native-feather";

const RoundedButton = ({ classOverrides = "", Icon, action, disabled=false }) => {
  return (
    <TouchableWithoutFeedback
      onPress={() => {
        action();
      }}
    >
      <View
        className={`rounded-full border-2 h-9 w-9 flex items-center justify-center ${
          disabled ? "border-[#8a8a8a]" : "border-white"
        } ${classOverrides}`}
      >
        {/* <Copy  width={20} stroke={"white"}/> */}
        {Icon}
      </View>
    </TouchableWithoutFeedback>
  );
};

export default RoundedButton;
