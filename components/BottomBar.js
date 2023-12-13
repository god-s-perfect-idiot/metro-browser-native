import React from "react";
import { View } from "react-native";
import { Lock, RefreshCw } from "react-native-feather";
import RoundedButton from "./core/RoundedButton";
import { TextBox } from "./core/TextBox";

const BottomBar = ({
    url,
    onURLChange,
    onSubmitURL
}) => {
    return (
        <View className="bg-[#222222] h-14 w-full flex flex-row justify-between items-center">
            <View className="w-[15%] h-full flex justify-center items-center">
                <RoundedButton />
            </View>
            <View className="w-[70%] h-full flex justify-center items-center ">
                <View className="w-full h-80% flex flex-row justify-center items-center bg-[#c9c9c9] px-6 my-2">
                    <Lock stroke={"#828382"} width={16} strokeWidth={"3px"}/>
                    <TextBox defaultValue={url} onChangeText={onURLChange} onSubmitText={onSubmitURL}/>
                    <RefreshCw stroke={"black"} width={16} strokeWidth={"3px"}/>
                </View>
            </View>
            <View className="w-[15%] h-full items-start justify-center flex flex-row gap-1 pt-2">
                <View className="w-1 h-1 bg-white rounded-full"/>
                <View className="w-1 h-1 bg-white rounded-full"/>
                <View className="w-1 h-1 bg-white rounded-full"/>
            </View>
        </View>
    )
}

export default BottomBar;

