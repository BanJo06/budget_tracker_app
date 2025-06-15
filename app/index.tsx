import { Text, View } from "react-native";
import Add from "../icons/add.svg";

export default function Index() {
  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Text>Edit app/index.tsx to edit this screen.</Text>
      <Add></Add>
    </View>
  );
}
