import React from "react";
import { ScrollView, Text, TouchableWithoutFeedback, View } from "react-native";
import { Check, Lock, RefreshCw, X } from "react-native-feather";
import RoundedButton from "../core/RoundedButton";
import { TextBox } from "../core/TextBox";
import Link from "../core/Link";
import { fonts } from "../../styles/fonts";
import {MenuBar, QuickMenu} from "../core/MenuBar";
import AsyncStorage from "@react-native-async-storage/async-storage";

const Menu = ({
    navigation,
    methods
}) => {
    return (
        <QuickMenu 
            options={[
                {
                    text: "done",
                    onPress: methods.accept,
                    Icon: <Check width={20} stroke={"white"} strokeWidth={3}/>
                },
                {
                    text: "cancel",
                    onPress: methods.cancel,
                    Icon: <X width={20} stroke={"white"} strokeWidth={3}/>
                }
            ]}
        />
    )
}

export default Menu;

