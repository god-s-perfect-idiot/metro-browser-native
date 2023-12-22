import React from "react";
import { ScrollView, Text, TouchableWithoutFeedback, View } from "react-native";
import { Lock, RefreshCw } from "react-native-feather";
import RoundedButton from "./core/RoundedButton";
import { TextBox } from "./core/TextBox";
import Link from "./core/Link";
import { fonts } from "../styles/fonts";

const ExpandedBar = ({
    url,
    onURLChange,
    onSubmitURL,
    onOptionClick
}) => {
    return (
        <View className="bg-[#222222] h-2/5 w-full flex flex-col">
            <BottomBar url={url} onURLChange={onURLChange} onSubmitURL={onSubmitURL} onOptionClick={onOptionClick} />
            <ScrollView className="w-full h-full">
                <View className="flex flex-col gap-16 mx-4 w-full my-4">
                    {/* sadly there is no gap in react-native yet */}
                    <Link to={"https://google.com"} classOverride="text-xl" text="favourites" disabled/>
                    <Link to={"https://google.com"} classOverride="mt-4 text-xl" text="add to favourites"  disabled/>
                    <Link to={"https://google.com"} classOverride="mt-4 text-xl" text="find on page" disabled />
                    <Link to={"https://google.com"} classOverride="mt-4 text-xl" text="share page" disabled />
                    <Link to={"https://google.com"} classOverride="mt-4 text-xl" text="pin to start"  disabled/>
                    <Link to={"https://google.com"} classOverride="mt-4 text-xl" text="recent"  disabled/>
                    <Link to={"https://google.com"} classOverride="mt-4 text-xl" text="settings"  disabled/>
                </View>
            </ScrollView>
        </View>
    )
}

const BottomBar = ({
    url,
    onURLChange,
    onSubmitURL,
    onOptionClick
}) => {
    return (
        <View className="bg-[#222222] h-14 w-full flex flex-row justify-between items-center">
            <View className="w-[15%] h-full flex justify-center items-center">
                <RoundedButton />
            </View>
            <View className="w-[70%] h-full flex justify-center items-center ">
                <View className="w-full h-80% flex flex-row justify-center items-center bg-[#c9c9c9] px-6 my-2">
                    <Lock stroke={"#828382"} width={16} strokeWidth={"3px"} />
                    <TextBox defaultValue={url} onChangeText={onURLChange} onSubmitText={onSubmitURL} />
                    <RefreshCw stroke={"black"} width={16} strokeWidth={"3px"} />
                </View>
            </View>
            <TouchableWithoutFeedback onPress={onOptionClick}>
                <View className="w-[15%] h-full items-start justify-center flex flex-row gap-1 pt-2">
                    <View className="w-1 h-1 bg-white rounded-full" />
                    <View className="w-1 h-1 bg-white rounded-full" />
                    <View className="w-1 h-1 bg-white rounded-full" />
                </View>
            </TouchableWithoutFeedback>
        </View>
    )
}

const BarContainer = ({
    url,
    onURLChange,
    onSubmitURL
}) => {
    const [expanded, setExpanded] = React.useState(false);
    React.useEffect(() => {
        console.log(expanded)
    }, [])
    if (expanded) {
        return (
            <ExpandedBar url={url} onURLChange={onURLChange} onSubmitURL={onSubmitURL} onOptionClick={() => setExpanded(false)} />
        )
    } else {
        return (
            <BottomBar url={url} onURLChange={onURLChange} onSubmitURL={onSubmitURL} onOptionClick={() => setExpanded(true)} />
        )
    }
}

export default BarContainer;

