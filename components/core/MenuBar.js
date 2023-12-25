import { useState } from "react";
import { ScrollView, Text, TouchableWithoutFeedback, View } from "react-native";

const ShortMenu = ({ children, handleExpand }) => {
    return (
        <View className="bg-[#222222] h-14 w-full flex flex-row justify-between items-center">
            {children }
            <TouchableWithoutFeedback onPress={handleExpand}>
                <View className="w-[15%] h-full items-start justify-center flex flex-row gap-1 pt-2">
                    <View className="w-1 h-1 bg-white rounded-full" />
                    <View className="w-1 h-1 bg-white rounded-full" />
                    <View className="w-1 h-1 bg-white rounded-full" />
                </View>
            </TouchableWithoutFeedback>
        </View>
    )
}

const MenuBar = ({ options, controls, height=14 }) => {
    const [expanded, setExpanded] = useState(false);
    if (!expanded) {
        return (
            <ShortMenu handleExpand={() => setExpanded(true)}>
                {controls}
            </ShortMenu>
        )
    } else {
        return ( 
            <View className="bg-[#222222] h-2/5 w-full flex flex-col">
                <ShortMenu handleExpand={() => setExpanded(false)}>
                    {controls}
                </ShortMenu>
                <ScrollView className="w-full h-full">
                    <View className="flex flex-col gap-16 mx-4 w-full my-4">
                        {/* sadly there is no gap in react-native yet */}
                        {options}
                    </View>
                </ScrollView>
            </View>
        );
    }
}

export default MenuBar;