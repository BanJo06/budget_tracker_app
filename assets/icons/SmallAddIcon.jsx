import Svg, { Path } from "react-native-svg"
const SmallAddIcon = (props) => (
  <Svg
    xmlns="http://www.w3.org/2000/svg"
    width={15}
    height={15}
    fill="none"
    {...props}
  >
    <Path
      fill="#392F46"
      d="M7.5 2.833A4.672 4.672 0 0 1 12.167 7.5 4.672 4.672 0 0 1 7.5 12.167 4.672 4.672 0 0 1 2.833 7.5 4.672 4.672 0 0 1 7.5 2.833Zm0-1.166a5.833 5.833 0 1 0 0 11.666 5.833 5.833 0 0 0 0-11.666Zm2.917 5.25H8.083V4.583H6.917v2.334H4.583v1.166h2.334v2.334h1.166V8.083h2.334V6.917Z"
    />
  </Svg>
)
export default SmallAddIcon
