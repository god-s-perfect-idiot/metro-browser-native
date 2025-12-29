import React from "react";
import Svg, { Path } from "react-native-svg";
import { View } from "react-native";

const Plus = ({ color = "white", size = 60 }) => {
  return (
    <View>
      <Svg height={size} width={size} viewBox="0 0 60 60">
        <Path
          d="M30 18V42M18 30H42"
          stroke="white"
          strokeWidth="5"
          strokeLinecap="butt"
        />
      </Svg>
    </View>
  );
};

export default Plus;
