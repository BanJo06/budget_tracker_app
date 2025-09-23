import Svg, { Path } from "react-native-svg"
const ShopBackButtonIcon = (props) => (
  <Svg
    xmlns="http://www.w3.org/2000/svg"
    width={30}
    height={30}
    fill="none"
    {...props}
  >
    <Path
      fill="#fff"
      d="M15 0C6.73 0 0 6.73 0 15s6.73 15 15 15 15-6.73 15-15S23.27 0 15 0Zm0 2.308A12.675 12.675 0 0 1 27.692 15 12.675 12.675 0 0 1 15 27.692 12.675 12.675 0 0 1 2.308 15 12.675 12.675 0 0 1 15 2.308Zm-.83 5.3L7.61 14.17 6.779 15l.83.83 6.563 6.562 1.659-1.623-4.616-4.615h11.862v-2.308H11.215l4.616-4.615-1.662-1.623Z"
    />
  </Svg>
)
export default ShopBackButtonIcon
