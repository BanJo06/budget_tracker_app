import Svg, { Circle, G, Path } from "react-native-svg"
const TuitionIcon = ({ size = 48, ...props }) => (
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
                d="M12 15.5a.5.5 0 0 1-.248-.066l-4.377-2.502A.25.25 0 0 0 7 13.15v2.35a.5.5 0 0 0 .257.438l4.5 2.5a.5.5 0 0 0 .486 0l4.5-2.5A.5.5 0 0 0 17 15.5v-2.35a.249.249 0 0 0-.25-.251.25.25 0 0 0-.125.033l-4.377 2.502A.5.5 0 0 1 12 15.5Z"
                clipRule="evenodd"
            />
            <Path
                fill="#fff"
                fillRule="evenodd"
                d="M19.497 9.953V9.95a.5.5 0 0 0-.25-.384l-7-4a.5.5 0 0 0-.496 0l-7 4a.5.5 0 0 0 0 .868l7 4a.5.5 0 0 0 .497 0l6.158-3.519a.062.062 0 0 1 .094.054v4.517c0 .269.207.5.476.513a.5.5 0 0 0 .524-.499V10a.49.49 0 0 0-.003-.047Z"
                clipRule="evenodd"
            />
        </G>
    </Svg>
)
export default TuitionIcon
