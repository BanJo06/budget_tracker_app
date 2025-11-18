import * as React from "react";
import Svg, { Path, Rect } from "react-native-svg";
const AddActiveIconNight = (props) => (
  <Svg
    xmlns="http://www.w3.org/2000/svg"
    width={52}
    height={52}
    fill="none"
    {...props}
  >
    <Rect width={52} height={52} fill="#121212" rx={26} />
    <Path
      fill="#8938E9"
      d="M16.421 24.632h8.21v-8.21h2.737v8.21h8.21v2.736h-8.21v8.21h-2.736v-8.21h-8.21v-2.736ZM26 0a26 26 0 1 1 0 52 26 26 0 0 1 0-52Zm0 2.737a23.263 23.263 0 1 0 0 46.526 23.263 23.263 0 0 0 0-46.526Z"
    />
  </Svg>
);
export default AddActiveIconNight;
