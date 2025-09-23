import Svg, { Path, Rect } from "react-native-svg"
const ShopIcon = (props) => (
  <Svg
    xmlns="http://www.w3.org/2000/svg"
    width={30}
    height={30}
    fill="none"
    {...props}
  >
    <Rect width={30} height={30} fill="#fff" rx={15} />
    <Path
      fill="#8938E9"
      d="M16 16.5v3a.5.5 0 0 0 .5.5h3a.5.5 0 0 0 .5-.5v-3a.5.5 0 0 0-.5-.5h-3a.5.5 0 0 0-.5.5Zm1 2.5v-2h2v2h-2ZM10 7a.5.5 0 0 0-.384.18l-2.5 3A.5.5 0 0 0 7 10.5V12c0 .888.386 1.687 1 2.236V22.5a.5.5 0 0 0 .5.5h13a.5.5 0 0 0 .5-.5v-8.264c.614-.55 1-1.348 1-2.236v-1.518c0-.09 0-.162-.116-.302l-2.5-3A.5.5 0 0 0 20 7H10Zm0 7a2 2 0 0 1-2-2v-1h4v1a2 2 0 0 1-2 2Zm5 0a2 2 0 0 1-2-2v-1h4v1a2 2 0 0 1-2 2Zm5 0a2 2 0 0 1-2-2v-1h4v1a2 2 0 0 1-2 2Zm-10 8H9v-7.17a3 3 0 0 0 3.5-1.17 3 3 0 0 0 5-.001 3 3 0 0 0 3.5 1.17V22h-6v-5.5a.5.5 0 0 0-.5-.5h-4a.5.5 0 0 0-.5.5V22Zm2.14-12H8.568l1.666-2h2.572l-.666 2Zm4.666 0h-3.612l.666-2h2.28l.666 2Zm1.054 0-.666-2h2.572l1.667 2H17.86ZM11 22v-5h3v5h-3Z"
    />
  </Svg>
)
export default ShopIcon
