import Svg, { Circle, G, Path } from "react-native-svg"
const PaypalIcon = ({ size = 48, ...props })  => (
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
        d="M10.62 12.66c.067 0 1.613.067 2.533-.16h.007c1.06-.26 2.533-1.007 2.913-3.447 0 0 .847-3.053-3.353-3.053H9.113a.672.672 0 0 0-.66.56L6.92 16.267c-.033.2.127.386.327.386h2.286l.56-3.546a.531.531 0 0 1 .527-.447Z"
        clipRule="evenodd"
      />
      <Path
        fill="#fff"
        fillRule="evenodd"
        d="M16.66 9.527c-.54 2.486-2.24 3.8-4.947 3.8h-.98l-.686 4.346a.283.283 0 0 0 .28.327h1.266a.466.466 0 0 0 .46-.393c.054-.267.347-2.214.407-2.547a.466.466 0 0 1 .46-.393h.293c1.88 0 3.354-.767 3.787-2.974.173-.893.08-1.626-.34-2.166Z"
        clipRule="evenodd"
      />
    </G>
  </Svg>
)
export default PaypalIcon