import React, { useState } from "react";
import { View, Text, TouchableOpacity, Image } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { colors } from "../styles/colors";
import { useGetUser } from "../components/getUser";
import { useNavigation, useRoute } from "@react-navigation/native";
import { RootStackParamList } from "../types/navigation";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { signOut } from "firebase/auth";
import { Loading } from "./loading";
import { auth } from "../config/firebaseconfig";
import ModalOverlay from "../components/modal"; // Reutilizando o modal
import { Button } from "./button";

type NavigationProp = NativeStackNavigationProp<RootStackParamList, "Home">;

export default function AvatarBar() {
  const [confirmLogoutVisible, setConfirmLogoutVisible] = useState(false);
  const user = useGetUser();
  const navigation = useNavigation<NavigationProp>();
  const route = useRoute();

  const handleLogout = async () => {
    try {
      await signOut(auth); // Faz o logout do Firebase
      setConfirmLogoutVisible(false);
      navigation.navigate("Login"); // Redireciona para a tela de Login
    } catch (error) {
      console.error("Erro ao desconectar:", error);
    }
  };

  const showLogoutConfirmation = () => {
    setConfirmLogoutVisible(true);
  };

  const hideLogoutConfirmation = () => {
    setConfirmLogoutVisible(false);
  };

  if (!user) {
    return (
      <View className="w-full bg-laranja-100 h-24 rounded-b-3xl p-6 justify-center items-center">
        <Loading />
      </View>
    );
  }

  return (
    <>
      <View className="w-full bg-laranja-100 h-24 rounded-b-3xl p-6 justify-center">
        <View className="flex-row items-center gap-4">
     
          <View className="items-center">
            {user?.photoURL ? (
              <Image
                source={{ uri: user?.photoURL }}
                className="w-[65px] h-[65px] rounded-full border-white border"
              />
            ) : (
              <View className="w-[65px] h-[65px] bg-gray-400 rounded-full justify-center border-white border">
                <Loading />
              </View>
            )}
          </View>
        
          <TouchableOpacity onPress={showLogoutConfirmation} >
          <View className="flex flex-row items-center gap-2 ">
            <Text className="font-regular text-xl text-white">
              Olá, {user.name || "Usuário"}
            </Text>
          

         
            <MaterialIcons name="exit-to-app" size={20} color={colors.white} />
            </View>
          </TouchableOpacity>

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

      {/* Modal de confirmação */}
      <ModalOverlay
        visible={confirmLogoutVisible}
        onRequestClose={hideLogoutConfirmation}
      >
        <View className="flex-1 items-center justify-center bg-black/50">
          <View className="bg-white p-6 rounded-lg w-[80%] items-center">
            <Text className="text-lg font-bold mb-4">
              Deseja realmente sair?
            </Text>
            <View className="flex-col w-full gap-4">
              

              <Button title="Sim" bgcolor={colors.laranja[200]} textColor={colors.white} onPress={handleLogout}/>
              
             
              <Button title="Não" bgcolor={colors.laranja[100]} textColor={colors.white} onPress={hideLogoutConfirmation}/>
            </View>
          </View>
        </View>
      </ModalOverlay>
    </>
  );
}
