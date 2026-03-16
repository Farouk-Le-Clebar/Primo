import { Image, Text, View } from "react-native"
import { MapPin } from "lucide-react";

const Localisation = () => {
    return (
        <View className="w-90/100 h-80 bg-white rounded-2xl shadow-lg p-4">
            <View>
                <MapPin />
                <Text className="text-lightGreen font-bold text-xl">LOCALISATION</Text>
            </View>
        </View>
    )
}

export default Localisation;