import React from "react";
import { ScrollView, Text, TouchableWithoutFeedback, View } from "react-native";
import Check from "../icons/Check";
import { QuickMenu} from "../core/MenuBar";
import Close from "../icons/Close";

const Menu = ({
    navigation,
    methods,
}) => {
    return (
        <QuickMenu 
            options={[
                {
                    text: "done",
                    onPress: methods.accept,
                    Icon: <Check color="white" size={26} />
                },
                {
                    text: "cancel",
                    onPress: methods.cancel,
                    Icon: <Close color="white" size={30} />
                }
            ]}
        />
    )
}

export default Menu;

