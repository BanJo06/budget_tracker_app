import Svg, { Circle, G, Path } from "react-native-svg"
const CardIcon = ({ size = 48, ...props })  => (
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
        d="M5 17a.5.5 0 0 0 .5.5h13a.5.5 0 0 0 .5-.5v-6.063H5V17Zm2.063-4.313a.25.25 0 0 1 .25-.25h2.875a.25.25 0 0 1 .25.25v2a.25.25 0 0 1-.25.25H7.312a.25.25 0 0 1-.25-.25v-2ZM18.5 6.5h-13A.5.5 0 0 0 5 7v2.063h14V7a.5.5 0 0 0-.5-.5Z"
        clipRule="evenodd"
      />
    </G>
  </Svg>
)
export default CardIcon