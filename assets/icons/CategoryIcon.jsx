import * as React from "react"
import Svg, { Path } from "react-native-svg"
const CategoryIcon = (props) => (
  <Svg
    xmlns="http://www.w3.org/2000/svg"
    width={17}
    height={17}
    fill="none"
    {...props}
  >
    <Path fill="#fff" d="M11 5.5H9v-2H8v2H6v1h2v2h1v-2h2v-1Z" />
    <Path
      fill="#fff"
      d="M14.5 12.5H9v-2h3a1.002 1.002 0 0 0 1-1v-7a1 1 0 0 0-1-1H5a1 1 0 0 0-1 1v7a1 1 0 0 0 1 1h3v2H2.5a1 1 0 0 0-1 1v2h1v-2H8v2h1v-2h5.5v2h1v-2a1 1 0 0 0-1-1ZM5 2.5h7l.001 7H5v-7Z"
    />
  </Svg>
)
export default CategoryIcon
