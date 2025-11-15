import { useColorScheme } from "nativewind";
import Svg, { Mask, Path } from "react-native-svg";

const GraphsIcon = ({ color, ...props }) => {
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
      <Mask id="a" fill="#fff">
        <Path d="M24 12.923a11.077 11.077 0 0 1-4.566 8.961l-6.51-8.96H24Z" />
      </Mask>
      <Path
        stroke={strokeColor}
        strokeWidth={2}
        d="M24 12.923a11.077 11.077 0 0 1-4.566 8.961l-6.51-8.96H24Z"
        mask="url(#a)"
      />
      <Mask id="b" fill="#fff">
        <Path d="M17.588 20.961A11.077 11.077 0 1 1 11.077.923V12l6.51 8.961Z" />
      </Mask>
      <Path
        stroke={strokeColor}
        strokeWidth={2}
        d="M17.588 20.961A11.077 11.077 0 1 1 11.077.923V12l6.51 8.961Z"
        mask="url(#b)"
      />
      <Mask id="c" fill="#fff">
        <Path d="M23.077 11.077A11.076 11.076 0 0 0 12 0v11.077h11.077Z" />
      </Mask>
      <Path
        stroke={strokeColor}
        strokeWidth={2}
        d="M23.077 11.077A11.076 11.076 0 0 0 12 0v11.077h11.077Z"
        mask="url(#c)"
      />
    </Svg>
  );
};
export default GraphsIcon;
