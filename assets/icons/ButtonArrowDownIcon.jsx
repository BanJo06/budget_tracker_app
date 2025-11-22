import Svg, { Path } from "react-native-svg";

// Default color is set to black (#000) if not provided
const ButtonArrowDownIcon = ({ color = "#000", ...props }) => (
  <Svg
    xmlns="http://www.w3.org/2000/svg"
    width={15}
    height={15}
    fill="none"
    {...props}
  >
    <Path
      // Use the 'color' prop here
      fill={color}
      fillRule="evenodd"
      d="m7.5 9.57 3.613-3.613-.663-.664-2.95 2.95-2.95-2.95-.663.664L7.5 9.569Z"
      clipRule="evenodd"
    />
  </Svg>
);

export default ButtonArrowDownIcon;
