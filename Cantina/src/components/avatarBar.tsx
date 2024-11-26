import React from "react";
import { View, Text, TouchableOpacity, Image } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { colors } from "../styles/colors";
import { useGetUser } from "../components/getUser"; // Função que retorna o usuário
import { useNavigation, useRoute } from "@react-navigation/native";
import { RootStackParamList } from "../types/navigation"; // Importe o tipo de navegação
import { NativeStackNavigationProp } from "@react-navigation/native-stack"; // Importa o tipo de navegação
import { signOut } from "firebase/auth"; // Importe o método de logout
import { Loading } from "./loading";
import { auth } from "../config/firebaseconfig";

type NavigationProp = NativeStackNavigationProp<RootStackParamList, "Home">;

export default function AvatarBar() {
  const user = useGetUser(); // Obtém o usuário autenticado
  const navigation = useNavigation<NavigationProp>(); // Agora o navigation está tipado
  const route = useRoute();

  const handleLogout = async () => {
    try {
      await signOut(auth); // Faz o logout do Firebase
      navigation.navigate("Login"); // Redireciona para a tela de Login
    } catch (error) {
      console.error("Erro ao desconectar:", error);
    }
  };

  if (!user) {
    return (
      <View className="w-full bg-laranja-100 h-24 rounded-b-3xl p-6 justify-center items-center">
        <Loading />
      </View>
    );
  }

  return (
    <View className="w-full bg-laranja-100 h-24 rounded-b-3xl p-6 justify-center">
      <View className="flex-row items-center gap-4">
        <View className="items-center">
          {user?.photoURL ? (
            <Image
              source={{ uri: user?.photoURL }}
              className="w-[65px] h-[65px] rounded-full border-white border"
            />
          ) : (
            <View className="w-[65px] h-[65px] bg-gray-400 rounded-full justify-center  border-white border">
              <Loading />
            </View>
          )}
        </View>

        <View>
          <Text className="font-regular text-xl text-white">
            Olá, {user.name || "Usuário"}
          </Text>
        </View>

        <TouchableOpacity onPress={handleLogout}>
          <MaterialIcons name="exit-to-app" size={20} color={colors.white} />
        </TouchableOpacity>

        {/* Verifica se a rota não é 'Notification' para exibir o ícone de notificações */}
        {route.name !== "Notification" && (
          <View className="w-full flex-1 items-end">
            <TouchableOpacity
              activeOpacity={0.5}
              onPress={() => navigation.navigate("Notification")}
            >
              <MaterialIcons
                name="notifications-none"
                size={30}
                color={colors.white}
              />
            </TouchableOpacity>
          </View>
        )}
      </View>
    </View>
  );
}
