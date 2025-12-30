import { Text } from "react-native"
import { fonts } from "../../styles/fonts"

export const PageTitle = ({title, isUpperCase=false, classOverride}) => {
    return (    
        <Text 
            className={`text-white text-6xl mt-1 ${isUpperCase ? "" : "lowercase"} ${classOverride}`} 
            style={fonts.lighter}
            numberOfLines={1}
            ellipsizeMode="tail"
        >
            {title} 
        </Text>
    )
}