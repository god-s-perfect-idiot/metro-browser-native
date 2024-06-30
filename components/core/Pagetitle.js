import { Text } from "react-native"
import { fonts } from "../../styles/fonts"

export const PageTitle = ({title, isUpperCase=false, classOverride}) => {
    return (    
        <Text className={`text-white text-5xl mt-3 ${isUpperCase ? "" : "lowercase"} ${classOverride}`} style={fonts.light}>
            {title} 
        </Text>
    )
}