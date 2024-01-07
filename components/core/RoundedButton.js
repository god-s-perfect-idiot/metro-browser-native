import { View, Text } from "react-native";
import { Copy } from "react-native-feather";

const RoundedButton = ({
    classOverrides = "",
    Icon
}) => {
    return (
        <View className={`rounded-full border-white border-2 h-9 w-9 flex items-center justify-center ${classOverrides}`}>
            {/* <Copy  width={20} stroke={"white"}/> */}
            {Icon}
        </View>
    )
}

export default RoundedButton; 