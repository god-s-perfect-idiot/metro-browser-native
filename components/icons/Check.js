import React from 'react';
import Svg, { Path } from 'react-native-svg';

const Check = ({ color = "white", size = 60 }) => {
  return (
    <Svg width={size} height={size} viewBox="0 0 60 60">
      <Path 
        d="M14 32L26 44L46 16" 
        stroke={color} 
        strokeWidth="8" 
        strokeLinecap="butt" 
        strokeLinejoin="miter"
        fill="none"
      />
    </Svg>
  );
};

export default Check;