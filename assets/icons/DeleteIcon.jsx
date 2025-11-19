import * as React from "react"
import Svg, { Path, Rect } from "react-native-svg"
const DeleteIcon = (props) => (
  <Svg
    xmlns="http://www.w3.org/2000/svg"
    width={30}
    height={30}
    fill="none"
    {...props}
  >
    <Rect width={30} height={30} fill="#8938E9" rx={15} />
    <Path
      fill="#fff"
      d="M12 20h2v-9h-2v9Zm4 0h2v-9h-2v9Zm-8 4V9H7V7h5V6h6v1h5v2h-1v15H8Z"
    />
  </Svg>
)
export default DeleteIcon
