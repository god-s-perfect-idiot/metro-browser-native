import { Text } from "react-native"
import { fonts } from "../../styles/fonts"

export const PageTitle = ({title, isUpperCase=false}) => {
    return (
        <Text className={`text-white text-5xl mt-5 ${isUpperCase ? "" : "lowercase"}`} style={fonts.light}>
            {title} 
        </Text>
    )
}