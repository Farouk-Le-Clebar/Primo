import { StatusBar } from 'expo-status-bar';
import { Text, View } from 'react-native';
import PrimoSVG from './assets/primo.svg';
import "./index.css";

export default function App() {
  return (
    <View className="flex-1 items-center justify-center bg-black flex-row gap-2">
      <Text className="text-4xl text-white font-bold">Welcome on</Text>
      <View className="h-[4%] w-[20%] mt-1">
        <PrimoSVG width="100%" height="100%" />
      </View>
    </View>
  );
}
