import * as React from "react";
import Svg, { ClipPath, Defs, G, Path, Rect } from "react-native-svg";
const PlannedBudgetsIcon = (props) => (
  <Svg
    xmlns="http://www.w3.org/2000/svg"
    width={40}
    height={40}
    fill="none"
    {...props}
  >
    <Rect width={40} height={40} fill="#8938E9" rx={20} />
    <G
      stroke="#fff"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={1.5}
      clipPath="url(#a)"
    >
      <Path d="M14.69 21.52a1.76 1.76 0 0 0 1.52.79m0 0a1.56 1.56 0 0 0 1.69-1.4 1.56 1.56 0 0 0-1.69-1.41 1.56 1.56 0 0 1-1.68-1.41 1.56 1.56 0 0 1 1.68-1.4m0 5.62v.94m0-6.56a1.73 1.73 0 0 1 1.52.79m-1.52-.79v-.94m5.79 7.5v-3m3.5 3v-6m-16-8.5h21s.75 0 .75.75V12s0 .75-.75.75h-21s-.75 0-.75-.75V9.5s0-.75.75-.75Z" />
      <Path d="M20 30.25V26m0 4.25c.83 0 1.5.45 1.5 1m-1.5-1c-.83 0-1.5.45-1.5 1M8.75 26h22.5m-21-13.25h19.5V26h-19.5V12.75Z" />
    </G>
    <Defs>
      <ClipPath id="a">
        <Path fill="#fff" d="M8 8h24v24H8z" />
      </ClipPath>
    </Defs>
  </Svg>
);
export default PlannedBudgetsIcon;
