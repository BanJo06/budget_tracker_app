import Svg, { ClipPath, Defs, G, Path } from "react-native-svg"
const TransferIcon = (props) => (
    <Svg
        xmlns="http://www.w3.org/2000/svg"
        width={24}
        height={24}
        fill="none"
        {...props}
    >
        <G clipPath="url(#a)">
            <Path
                fill="#000"
                d="M17.379 4.5H1.5v3h15.879l-2.25 2.25 2.121 2.12L23.121 6 17.25.129l-2.121 2.12 2.25 2.25Zm-10.758 15H22.5v-3H6.621l2.25-2.25-2.121-2.121-5.871 5.87 5.871 5.872 2.121-2.121-2.25-2.25Z"
            />
        </G>
        <Defs>
            <ClipPath id="a">
                <Path fill="#fff" d="M0 0h24v24H0z" />
            </ClipPath>
        </Defs>
    </Svg>
)
export default TransferIcon
