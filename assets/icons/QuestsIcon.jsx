import { useColorScheme } from "nativewind";
import Svg, { Path } from "react-native-svg";
const QuestsIcon = ({ color, ...props }) => {
  const { colorScheme } = useColorScheme();

  // Fallback color if prop is not provided
  const strokeColor = color || (colorScheme === "dark" ? "#fff" : "#000");
  return (
    <Svg
      xmlns="http://www.w3.org/2000/svg"
      width={27}
      height={24}
      fill="none"
      {...props}
    >
      <Path
        stroke={strokeColor}
        d="m13.5 22 11-13.333M13.5 22 2.5 8.667M13.5 22V8.667m11 0L17.9 2h-3.3m9.9 6.667h-6.6m-15.4 0L9.1 2h3.3M2.5 8.667h6.6m4.4 0H9.1m4.4 0h4.4m-8.8 0L12.4 2m0 0h2.2m3.3 6.667L14.6 2"
      />
    </Svg>
  );
};
export default QuestsIcon;
