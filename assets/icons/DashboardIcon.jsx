import { useColorScheme } from "nativewind";
import Svg, { Path } from "react-native-svg";

const DashboardIcon = ({ color, ...props }) => {
  const { colorScheme } = useColorScheme();

  // Fallback color if prop is not provided
  const strokeColor = color || (colorScheme === "dark" ? "#fff" : "#000");

  return (
    <Svg
      xmlns="http://www.w3.org/2000/svg"
      width={24}
      height={24}
      fill="none"
      {...props}
    >
      <Path
        stroke={strokeColor}
        d="M2.5 9V2H9v7H2.5ZM12 9V2h9.5v7H12ZM2.5 22V12H9v10H2.5ZM12 22V12h9.5v10H12Z"
      />
    </Svg>
  );
};

export default DashboardIcon;
