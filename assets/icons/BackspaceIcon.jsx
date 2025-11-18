import { useColorScheme } from "nativewind";
import Svg, { Path } from "react-native-svg";

const BackspaceIcon = ({ color, ...props }) => {
  const { colorScheme } = useColorScheme();

  // Fallback color if prop is not provided
  const fillColor = color || (colorScheme === "dark" ? "#9CA3AF" : "#392F46");

  return (
    <Svg
      xmlns="http://www.w3.org/2000/svg"
      width={36}
      height={37}
      fill="none"
      {...props}
    >
      <Path
        fill={fillColor}
        d="m24.621 18.5 2.121-2.121a1.5 1.5 0 0 0-2.121-2.121L22.5 16.379l-2.121-2.121a1.501 1.501 0 0 0-2.579 1.055 1.501 1.501 0 0 0 .458 1.066l2.121 2.121-2.121 2.121a1.501 1.501 0 1 0 2.121 2.121l2.121-2.121 2.121 2.121a1.501 1.501 0 0 0 2.579-1.055 1.5 1.5 0 0 0-.458-1.066L24.621 18.5ZM14.742 8H30a3 3 0 0 1 3 3v15a3 3 0 0 1-3 3H14.742a3 3 0 0 1-2.121-.879l-8.56-8.56a1.5 1.5 0 0 1 0-2.122l8.56-8.56A3 3 0 0 1 14.742 8Z"
      />
    </Svg>
  );
};
export default BackspaceIcon;
