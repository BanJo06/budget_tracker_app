import Svg, { Circle, G, Path } from "react-native-svg"
const ClothingIcon = ({ size = 48, ...props }) => (
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
                d="M7.76 6H10v.473c.005.01.026.059.102.147.103.12.265.263.473.4.422.277.952.48 1.425.48.473 0 1.004-.203 1.425-.48.208-.137.37-.28.474-.4.075-.088.096-.137.101-.147V6h2.24l2.312 2.89-1.237 4.327-1.815-.908V18h-7v-5.691l-1.815.908-1.237-4.328L7.76 6Z"
                clipRule="evenodd"
            />
        </G>
    </Svg>
)
export default ClothingIcon
