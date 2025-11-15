import { useColorScheme } from "nativewind";
import Svg, { Path } from "react-native-svg";
const EllipsisIcon = ({ color, ...props }) => {
  const { colorScheme } = useColorScheme();

  // Fallback color if prop is not provided
  const strokeColor = color || (colorScheme === "dark" ? "#fff" : "#392F46");
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
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M12 13a1 1 0 1 0 0-2 1 1 0 0 0 0 2ZM19 13a1 1 0 1 0 0-2 1 1 0 0 0 0 2ZM5 13a1 1 0 1 0 0-2 1 1 0 0 0 0 2Z"
      />
    </Svg>
  );
};
export default EllipsisIcon;
