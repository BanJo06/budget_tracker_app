import Svg, { ClipPath, Defs, G, Path, Rect } from "react-native-svg";

const CryptocurrencyIcon = ({ size = 48, ...props }) => (
  <Svg
    xmlns="http://www.w3.org/2000/svg"
    width={size}
    height={size}
    fill="none"
    viewBox="0 0 24 24"
    {...props}
  >
    <Rect width={24} height={24} fill="#8938E9" rx={12} />
    <G clipPath="url(#a)">
      <Path
        fill="#fff"
        d="M12 4a8 8 0 1 0 0 16 8 8 0 0 0 0-16Zm-2.74 6.713 2.333-3.333a.514.514 0 0 1 .814 0l2.333 3.333a.493.493 0 0 1-.08.667l-2.333 2a.507.507 0 0 1-.667 0l-2.333-2a.493.493 0 0 1-.067-.667Zm5.493 4.434-2.313 2a.667.667 0 0 1-.88 0l-2.313-2a.669.669 0 0 1 .88-1.007L12 15.78l1.873-1.64a.668.668 0 1 1 .88 1.007Z"
      />
    </G>
    <Defs>
      <ClipPath id="a">
        <Path fill="#fff" d="M4 4h16v16H4z" />
      </ClipPath>
    </Defs>
  </Svg>
);

export default CryptocurrencyIcon;
