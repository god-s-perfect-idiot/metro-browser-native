import { Text, TouchableWithoutFeedback, View } from "react-native"
import { fonts } from "../../styles/fonts";

const Link = ({
    to,
    disabled = false,
    classOverride = "",
    onPress = () => {},
    text
}) => {
    return (
        <TouchableWithoutFeedback onPress={onPress}>
            <Text className={`${disabled ? "text-[#8a8a8a]" : "text-white"} ${classOverride} lowercase`} style={fonts.light}>
                {text}
            </Text>
        </TouchableWithoutFeedback> 
    )
}

export default Link;