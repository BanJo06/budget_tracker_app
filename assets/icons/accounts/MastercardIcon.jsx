import Svg, { Circle, G, Path } from "react-native-svg"
const MastercardIcon = ({ size = 48, ...props })  => (
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
        d="M11.562 16.02c.04.034.08.066.12.098a4.943 4.943 0 1 1-.002-8.237c-.04.034-.08.066-.11.1a5.306 5.306 0 0 0-1.36 6.228 5.336 5.336 0 0 0 1.352 1.812Zm3.494-8.964a4.919 4.919 0 0 0-2.737.825c.04.034.08.066.11.1a5.308 5.308 0 0 1 1.36 6.228 5.334 5.334 0 0 1-1.351 1.812 4 4 0 0 1-.12.097c.81.54 1.763.827 2.737.825a4.943 4.943 0 1 0 .001-9.887ZM12 8.116A4.933 4.933 0 0 0 10.113 12 4.926 4.926 0 0 0 12 15.885 4.934 4.934 0 0 0 13.887 12 4.927 4.927 0 0 0 12 8.116Z"
        clipRule="evenodd"
      />
    </G>
  </Svg>
)
export default MastercardIcon