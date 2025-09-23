import Svg, { Circle, G, Path } from "react-native-svg";

const BankTransferIcon = ({ size = 48, ...props })  => (
  <Svg
    xmlns="http://www.w3.org/2000/svg"
    width={size}
    height={size}
    viewBox="0 0 24 24" // Use a viewBox for a consistent coordinate system
    fill="none"
    {...props}
  >
    {/* The Circle (background) is now a proper Circle component */}
    <Circle cx={12} cy={12} r={12} fill="#8938E9" />

    {/* Use a Group (G) to transform the path independently */}
    <G transform="scale(1) translate(0, 0)">
      <Path
        fill="#fff"
        fillRule="evenodd"
        d="m12.447 5.478 5.666 3.167a1 1 0 0 1 .554.895v.96c0 .46-.374.833-.834.833h-.5v5.334H18A.667.667 0 0 1 18 18H6a.667.667 0 1 1 0-1.333h.667v-5.334h-.5a.834.834 0 0 1-.834-.833v-.96c0-.348.18-.668.471-.85l5.749-3.212a1 1 0 0 1 .894 0Zm2.886 5.855H8.667v5.334H10v-4h1.333v4h1.334v-4H14v4h1.333v-5.334ZM12 8a.667.667 0 1 0 0 1.334A.667.667 0 0 0 12 8Z"
        clipRule="evenodd"
      />
    </G>
  </Svg>
);

export default BankTransferIcon;