import { Text, View } from "react-native"
import { fonts } from "../../styles/fonts";

const Link = ({
    to,
    disabled = false,
    classOverride = "",
    text
}) => {
    return (
        <Text className={`${disabled ? "text-[#8a8a8a]" : "text-white"} ${classOverride} lowercase`} style={fonts.regular}>
            {text}
        </Text>
    )
}

export default Link;