import {
  View,
  Text,
  SafeAreaView,
  TouchableOpacity,
  Modal,
  Alert,
} from "react-native";
import AvatarBar from "../components/avatarBar";
import { Button } from "../components/button";
import { colors } from "../styles/colors";
import { AntDesign } from "@expo/vector-icons";
import { useState } from "react";

export default function Payment() {
  const [isPix, setIsPix] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  return (
    <>
      <AvatarBar />
      <SafeAreaView className="flex-1 h-screen justify-center relative">
        <Modal
          animationType="slide"
          transparent={true}
          visible={modalVisible}
          onRequestClose={() => {
            Alert.alert("Cancelar pedido!", "Tem certeza que deseja cancelar?");
            setModalVisible(!modalVisible);
          }}
        >
          <View className="justify-center items-center flex-1">
            <View className="bg-slate-50 w-9/12 h-40 rounded-lg shadow-black shadow-sm">
              <Text> Olá</Text>
            </View>
          </View>
        </Modal>
        <View className="gap-4 justify-center p-6  ">
          <Button
            title="Cartão"
            textColor={colors.white}
            bgcolor={colors.laranja[100]}
            onPress={() => setModalVisible(!modalVisible)}
          />
          <Button
            title="Vale alimentação"
            textColor={colors.white}
            bgcolor={colors.laranja[100]}
          />
          {!isPix ? (
            <Button
              title="Pix"
              textColor={colors.white}
              bgcolor={colors.laranja[100]}
              onPress={() => setIsPix(true)}
            />
          ) : (
            <View>
              <TouchableOpacity
                onPress={() => setIsPix(false)}
                activeOpacity={0.7}
              >
                <View className="bg-laranja-100 h-14  w-full justify-center items-center rounded-t-lg">
                  <Text className="text-white font-bold">PIX</Text>
                </View>
              </TouchableOpacity>

              <View className="bg-slate-50 shadow shadow-black  ">
                <AntDesign name="qrcode" size={350} />
              </View>
            </View>
          )}
        </View>
      </SafeAreaView>
    </>
  );
}
