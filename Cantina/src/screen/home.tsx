import {
  Image,
  SafeAreaView,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import AvatarBar from "../components/avatarBar";
import { colors } from "../styles/colors";

export default function Home() {
  const date = new Date().getDate();
  const month = new Date().getMonth() + 1;

  return (
    <SafeAreaView className="flex-1">
      <AvatarBar />
      <Text className="text-center text-laranja-200 font-bold text-2xl mt-2">
        Cardápio dia {date}/{month < 10 ? "0" + month : month}
      </Text>
      <ScrollView className="p-6 ">
        <View className="w-2/4 h-52 p-1 rounded-[25] bg-slate-50 mt-20">
          <View className="relative">
            <Image
              source={require("../assets/prato.png")}
              className="absolute -mt-24"
            />
          </View>

          <View className="flex-1 items-center justify-end">
            <Text className="text-laranja-200 font-bold text-xl ">
              Filé de Frango
            </Text>
            <Text className="">
              Arroz, feijão, filé de frango, batata frita, salada
            </Text>
            <View className="flex-row items-center gap-2 py-2">
              <View className="bg-laranja-200 p-1 px-2 rounded-2xl">
                <TouchableOpacity>
                  <MaterialIcons
                    name="add-shopping-cart"
                    size={24}
                    color={colors.white}
                  />
                </TouchableOpacity>
              </View>
              <Text className="text-laranja-200 font-medium text-xl">
                R$25,00
              </Text>
            </View>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
