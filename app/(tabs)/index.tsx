import { Text, View } from "react-native";
import Add from "../../icons/add.svg";

export default function Index() {
  return (
    <View className='flex-1 justify-center items-center'>
      <Text className='text-5xl text-blue-400 font-bold'>Edit app/index.tsx to edit this screen.</Text>
      <Add></Add>
      <Text className="text-red-500 font-bold text-lg">
  If you can see this text styled, Tailwind CSS is working!
</Text>
    </View>
  );
}

