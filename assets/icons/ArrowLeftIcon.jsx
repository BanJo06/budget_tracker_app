import { useColorScheme } from "nativewind";
import Svg, { Path } from "react-native-svg";

const ArrowLeftIcon = ({ color, ...props }) => {
  const { colorScheme } = useColorScheme();

  // Fallback color if prop is not provided
  const fillColor = color || (colorScheme === "dark" ? "#fff" : "#000");
  return (
    <Svg
      xmlns="http://www.w3.org/2000/svg"
      width={24}
      height={24}
      fill="none"
      {...props}
    >
      <Path
        fill={fillColor}
        d="M12 2.25c-5.376 0-9.75 4.374-9.75 9.75s4.374 9.75 9.75 9.75 9.75-4.374 9.75-9.75S17.376 2.25 12 2.25Zm0 1.5A8.239 8.239 0 0 1 20.25 12 8.239 8.239 0 0 1 12 20.25 8.239 8.239 0 0 1 3.75 12 8.239 8.239 0 0 1 12 3.75Zm-.54 3.446L7.196 11.46l-.54.54.54.54 4.265 4.265 1.079-1.055-3-3h7.71v-1.5H9.54l3-3-1.08-1.054Z"
      />
    </Svg>
  );
};
export default ArrowLeftIcon;
