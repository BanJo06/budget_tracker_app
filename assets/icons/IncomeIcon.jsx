import * as React from "react";
import Svg, { Circle, Path, Rect } from "react-native-svg";
const IncomeIcon = (props) => (
  <Svg
    xmlns="http://www.w3.org/2000/svg"
    width={48}
    height={48}
    fill="none"
    {...props}
  >
    <Rect width={48} height={48} fill="#489840" rx={15} />
    <Path stroke="#fff" strokeWidth={2} d="M33 7h5v9h4l-6.5 9-6.5-9h4V7Z" />
    <Circle
      cx={18.5}
      cy={29.5}
      r={11.5}
      fill="#489840"
      stroke="#fff"
      strokeWidth={2}
    />
    <Path
      fill="#fff"
      d="M24.182 25.523v1.25H13.796v-1.25h10.386Zm0 1.863v1.25H13.796v-1.25h10.386Zm-5.046 3.41h-2.772v-1.25h2.772c.622 0 1.114-.108 1.478-.324.367-.22.628-.518.784-.893.159-.378.238-.806.238-1.284 0-.477-.08-.897-.238-1.26a1.77 1.77 0 0 0-.79-.859c-.367-.208-.866-.312-1.494-.312h-2.478V35h-1.409V23.364h3.887c.909 0 1.651.162 2.227.488.576.322 1 .762 1.273 1.319.272.553.409 1.178.409 1.875 0 .696-.137 1.329-.41 1.897a3.132 3.132 0 0 1-1.266 1.352c-.572.334-1.31.5-2.21.5Z"
    />
  </Svg>
);
export default IncomeIcon;
