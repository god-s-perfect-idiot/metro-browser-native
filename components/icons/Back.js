import React from "react";
import Svg, { Path } from "react-native-svg";

const Back = ({ color = "white", size = 60 }) => {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill={color}>
      <Path
        d="M20 10H8.5L13.5 5H9.5L2 12.5L9.5 20H13.5L8.5 15H20V10Z"
        strokeWidth="3"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
};

export default Back;
