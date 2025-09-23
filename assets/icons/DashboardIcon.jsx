import Svg, { Path } from "react-native-svg"
const DashboardIcon = (props) => (
  <Svg
    xmlns="http://www.w3.org/2000/svg"
    width={24}
    height={24}
    fill="none"
    {...props}
  >
    <Path
      stroke="#000"
      d="M2.5 9V2H9v7H2.5ZM12 9V2h9.5v7H12ZM2.5 22V12H9v10H2.5ZM12 22V12h9.5v10H12Z"
    />
  </Svg>
)
export default DashboardIcon
