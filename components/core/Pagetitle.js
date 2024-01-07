import { Text } from "react-native"
import { fonts } from "../../styles/fonts"

export const PageTitle = ({title}) => {
    return (
        <Text className="text-white text-5xl lowercase mt-3" style={fonts.light}>
            {title} 
        </Text>
    )
}