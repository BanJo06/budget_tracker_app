import Svg, { Circle, ClipPath, Defs, G, Path } from "react-native-svg";

const OtherIncomeIcon = ({ size = 48, ...props }) => (
  <Svg
    xmlns="http://www.w3.org/2000/svg"
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    {...props}
  >
    <Circle cx={12} cy={12} r={12} fill="#8938E9" />
    <G stroke="#fff" strokeWidth={2} clipPath="url(#a)">
      <Path
        strokeLinejoin="round"
        d="M11.6 5.4 5.47 11.53a.667.667 0 0 0 0 .942L11.6 18.6a.666.666 0 0 0 .943 0l6.128-6.128a.667.667 0 0 0 0-.943L12.542 5.4a.667.667 0 0 0-.942 0Z"
      />
      <Path strokeLinecap="round" d="M10 12h4m-2-2v4" />
    </G>
    <Defs>
      <ClipPath id="a">
        <Path fill="#fff" d="M4 4h16v16H4z" />
      </ClipPath>
    </Defs>
  </Svg>
);

export default OtherIncomeIcon;
