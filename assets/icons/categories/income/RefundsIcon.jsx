import Svg, { Circle, G, Path } from "react-native-svg"
const RefundsIcon = ({ size = 48, ...props }) => (
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
                d="M8 5.6a1.6 1.6 0 0 0-1.6 1.6v11.2l2.8-1.6 2.8 1.6 2.8-1.6 2.8 1.6V7.2A1.6 1.6 0 0 0 16 5.6H8Zm3.766 2.966a.8.8 0 0 0-1.132-1.132l-2.4 2.4a.8.8 0 0 0 0 1.132l2.4 2.4a.8.8 0 0 0 1.132-1.131L10.73 11.2H12a2.4 2.4 0 0 1 2.4 2.4v.8a.8.8 0 1 0 1.6 0v-.8a4 4 0 0 0-4-4h-1.269l1.035-1.034Z"
                clipRule="evenodd"
            />
        </G>
    </Svg>
)
export default RefundsIcon
