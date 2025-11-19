import * as React from "react";
import Svg, { Circle, G, Path } from "react-native-svg";
const EntertainmentIcon = ({ size = 48, ...props }) => (
  <Svg
    xmlns="http://www.w3.org/2000/svg"
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    {...props}
  >
    <Circle cx={12} cy={12} r={12} fill="#8938E9" />
    <G transform="scale(1) translate(0, 0)">
      <Path
        fill="#fff"
        fillRule="evenodd"
        d="M17.332 8.158 11.2 10.15a.499.499 0 0 1-.24.08l-2.106.682h8.759a.5.5 0 0 1 .5.5v5a2.5 2.5 0 0 1-2.5 2.5h-7a2.5 2.5 0 0 1-2.5-2.5v-5c0-.106.033-.205.09-.287l-.195-.602a2.5 2.5 0 0 1 1.605-3.15L14.27 5.21a2.5 2.5 0 0 1 3.15 1.605l.232.713a.5.5 0 0 1-.321.63Zm-3.744.165 1.285-2.226a1.5 1.5 0 0 0-.293.064l-1.245.404-1.308 2.265 1.56-.507Zm2.295-1.979-.02.037-.854 1.48 1.538-.5-.077-.237a1.5 1.5 0 0 0-.587-.78Zm-3.97.683-1.56.507L9.043 9.8l1.56-.507 1.31-2.265Zm-4.876 3.425.587-.19L8.93 7.996l-1.008.328a1.5 1.5 0 0 0-.963 1.89l.077.238Z"
        clipRule="evenodd"
      />
    </G>
  </Svg>
);
export default EntertainmentIcon;
