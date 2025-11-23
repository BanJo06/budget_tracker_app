import * as React from "react";
import Svg, { ClipPath, Defs, G, Path } from "react-native-svg";

const AccountIcon = ({ color = "#fff", ...props }) => (
  <Svg
    xmlns="http://www.w3.org/2000/svg"
    width={17}
    height={17}
    fill="none"
    {...props}
  >
    <G clipPath="url(#a)">
      <Path
        stroke={color}
        d="M1.033 4.233v9.6A1.067 1.067 0 0 0 2.1 14.9h12.8a1.067 1.067 0 0 0 1.067-1.067V5.3A1.066 1.066 0 0 0 14.9 4.233H3.7m-2.667 0V3.167A1.067 1.067 0 0 1 2.1 2.1h8.533A1.067 1.067 0 0 1 11.7 3.167v1.066h-8m-2.667 0H3.7m6.4 6.4h3.2"
      />
    </G>
    <Defs>
      <ClipPath id="a">
        <Path fill="#fff" d="M.5.5h16v16H.5z" />
      </ClipPath>
    </Defs>
  </Svg>
);

export default AccountIcon;
