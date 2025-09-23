import Svg, { Circle, G, Path } from "react-native-svg"
const SidelineIcon = ({ size = 48, ...props }) => (
    <Svg
        xmlns="http://www.w3.org/2000/svg"
        width={size}
        height={size}
        viewBox="0 0 24 24"
        fill="none"
        {...props}
    >
        <Circle cx={12} cy={12} r={12} fill="#8938E9" />
        <G transform="scale(1) translate(0, 0)">
            <Path
                fill="#fff"
                fillRule="evenodd"
                d="M11.493 11.196a2.871 2.871 0 1 0 0-5.743 2.871 2.871 0 0 0 0 5.743ZM13.333 16.444h3.112v.623h-3.112v-.623Z"
                clipRule="evenodd"
            />
            <Path
                fill="#fff"
                fillRule="evenodd"
                d="M10.667 17.333v1.334a.444.444 0 0 0 .444.444h7.556a.444.444 0 0 0 .444-.444v-4.445a.444.444 0 0 0-.444-.444h-3.112v-.654a.444.444 0 0 0-.888 0v.654h-.89v-1.591A14.226 14.226 0 0 0 11.494 12a11.556 11.556 0 0 0-4.889 1.062 1.458 1.458 0 0 0-.835 1.334v2.937h4.898Zm7.555.89h-6.667v-3.556h3.112v.186a.445.445 0 1 0 .889 0v-.186h2.666v3.555Z"
                clipRule="evenodd"
            />
        </G>
    </Svg>
)
export default SidelineIcon
