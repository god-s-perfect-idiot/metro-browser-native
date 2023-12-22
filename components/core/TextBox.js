import { TextInput } from "react-native"
import { fonts } from "../../styles/fonts"

export const TextBox = ({
    defaultValue,
    onChangeText,
    onSubmitText
}) => {
    return (
        <TextInput 
            className="bg-[#c9c9c9] w-full h-10 px-4 text-base" 
            style={fonts.regular} 
            cursorColor={"black"} 
            selectionColor={"#a013ec"} 
            placeholder={"Enter URL"} 
            defaultValue={defaultValue} 
            onChangeText={onChangeText}
            onSubmitEditing={onSubmitText}
        />
    )
}