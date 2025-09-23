import Svg, { Circle, G, Path } from "react-native-svg"
const CashIcon = ({ size = 48, ...props })  => (
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
      <Path fill="#fff" d="M12 14a2 2 0 1 0 0-4 2 2 0 0 0 0 4Z" />
      <Path
        fill="#fff"
        fillRule="evenodd"
        d="M4 8a1 1 0 0 1 1-1h14a1 1 0 0 1 1 1v8a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V8Zm3 0a2 2 0 0 1-2 2v4a2 2 0 0 1 2 2h10a2 2 0 0 1 2-2v-4a2 2 0 0 1-2-2H7Z"
        clipRule="evenodd"
      />
    </G>
  </Svg>
)
export default CashIcon