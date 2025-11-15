import { useColorScheme } from "nativewind";
import Svg, { Path } from "react-native-svg";

const ReportsIcon = ({ color, ...props }) => {
  const { colorScheme } = useColorScheme();

  // Fallback color if prop is not provided
  const strokeColor = color || (colorScheme === "dark" ? "#fff" : "#000");
  return (
    <Svg
      xmlns="http://www.w3.org/2000/svg"
      width={18}
      height={24}
      fill="none"
      {...props}
    >
      <Path
        stroke={strokeColor}
        d="M.5 2.9h17v20.6H.5zM6.5 0v6M11.3 0v6M3.6 10.3h10.8M3.6 13.9h10.8M3.6 17.5h10.8"
      />
    </Svg>
  );
};
export default ReportsIcon;
