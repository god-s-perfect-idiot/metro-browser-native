import React from "react";
import { ScrollView, Text, TouchableWithoutFeedback, View } from "react-native";
import { Check, Trash2, RefreshCw, X } from "react-native-feather";
import RoundedButton from "../core/RoundedButton";
import { TextBox } from "../core/TextBox";
import Link from "../core/Link";
import { fonts } from "../../styles/fonts";
import {MenuBar, QuickMenu} from "../core/MenuBar";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Fontisto from '@expo/vector-icons/Fontisto';

const Menu = ({
    navigation,
    methods,
    props
}) => {
    return (
        <QuickMenu 
            options={[
                {
                    text: "delete",
                    onPress: methods.delete,
                    Icon: <Fontisto name="trash" size={16} color={props.disabled ? "#8a8a8a" : "white"} />
                }
            ]}
            disabled={props.disabled}
        />
    )
}

export default Menu;

