import Svg, { Circle, G, Path } from "react-native-svg"
const LotteryIcon = ({ size = 48, ...props }) => (
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
                d="M14.373 6.783A4 4 0 0 0 12 8.455a4 4 0 0 0-2.373-1.672 2.666 2.666 0 0 1 4.746 0ZM6.705 13.36a5.336 5.336 0 0 1 4.656-4.656 3.334 3.334 0 1 0-4.657 4.657m10.59 0a3.332 3.332 0 1 0-4.657-4.657 5.336 5.336 0 0 1 4.658 4.657ZM12 18.667a4.666 4.666 0 1 0 0-9.333 4.666 4.666 0 0 0 0 9.333Zm-1.667-5.834a.5.5 0 0 1 .5-.5h2.834a.5.5 0 0 1 .33.876l-.009.008-.035.033a6.393 6.393 0 0 0-.617.699c-.371.487-.792 1.18-1.02 2.016a.5.5 0 0 1-.965-.263c.272-.997.768-1.805 1.188-2.359l.008-.01h-1.714a.5.5 0 0 1-.5-.5Z"
                clipRule="evenodd"
            />
        </G>
    </Svg>
)
export default LotteryIcon
