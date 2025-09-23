import Svg, { Path } from "react-native-svg"
const ReportsActiveIcon = (props) => (
  <Svg
    xmlns="http://www.w3.org/2000/svg"
    width={18}
    height={24}
    fill="none"
    {...props}
  >
    <Path fill="#8938E9" stroke="#8938E9" d="M.5 2.9h17v20.6H.5z" />
    <Path stroke="#8938E9" d="M6.5 0v6M11.3 0v6" />
    <Path stroke="#fff" d="M3.6 10.3h10.8M3.6 13.9h10.8M3.6 17.5h10.8" />
  </Svg>
)
export default ReportsActiveIcon
