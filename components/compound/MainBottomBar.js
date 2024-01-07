import React from "react";
import { ScrollView, Text, TouchableWithoutFeedback, View } from "react-native";
import { Copy, Lock, RefreshCw } from "react-native-feather";
import RoundedButton from "../core/RoundedButton";
import { TextBox } from "../core/TextBox";
import Link from "../core/Link";
import { fonts } from "../../styles/fonts";
import {MenuBar} from "../core/MenuBar";
import AsyncStorage from "@react-native-async-storage/async-storage";

const Menu = ({
    url,
    onURLChange,
    onSubmitURL,
    navigation
}) => {
    return (
        <MenuBar 
            controls={
                <>
                    <View className="w-[15%] h-full flex justify-center items-center">
                        <RoundedButton Icon={<Copy  width={20} stroke={"white"}/> }/>
                    </View>
                    <View className="w-[70%] h-full flex justify-center items-center ">
                        <View className="w-full h-80% flex flex-row justify-center items-center bg-[#c9c9c9] px-6 my-2">
                            <Lock stroke={"#828382"} width={16} strokeWidth={"3px"} />
                            <TextBox defaultValue={url} onChangeText={onURLChange} onSubmitText={onSubmitURL} />
                            <RefreshCw stroke={"black"} width={16} strokeWidth={"3px"} />
                        </View>
                    </View>
                </>
            }
            options={
                <>
                    <Link to={"https://google.com"} classOverride="text-xl" text="favourites" onPress={() => navigation.navigate("Favourites")}/>
                    <Link to={"https://google.com"} classOverride="mt-4 text-xl" text="add to favourites"  
                    onPress={() => {
                        // AsyncStorage.getItem("favourites").then((favourites) => {
                        //     if (favourites) {
                        //         const favouritesArray = JSON.parse(favourites);
                        //         favouritesArray.push(url);
                        //         AsyncStorage.setItem("favourites", JSON.stringify(favouritesArray));
                        //     } else {
                        //         AsyncStorage.setItem("favourites", JSON.stringify([url]));
                        //     }
                        // })
                        navigation.navigate("AddToFavourites", {
                            url: url
                        })
                    }}/>
                    <Link to={"https://google.com"} classOverride="mt-4 text-xl" text="find on page" disabled />
                    <Link to={"https://google.com"} classOverride="mt-4 text-xl" text="share page" disabled />
                    <Link to={"https://google.com"} classOverride="mt-4 text-xl" text="pin to start"  disabled/>
                    <Link to={"https://google.com"} classOverride="mt-4 text-xl" text="recent"  disabled/>
                    <Link to={"https://google.com"} classOverride="mt-4 text-xl" text="settings"  disabled/>
                </>
            }
        />
    )
}

export default Menu;

