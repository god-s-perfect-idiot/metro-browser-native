import React from 'react';
import Svg, { Path } from 'react-native-svg';

const Close = ({ color = "white", size = 60 }) => {
  return (
    <Svg width={size} height={size} viewBox="0 0 60 60">
      <Path 
        d="M18 18L42 42M42 18L18 42" 
        stroke={color} 
        strokeWidth="6" 
        strokeLinecap="butt" 
      />
    </Svg>
  );
};

export default Close;