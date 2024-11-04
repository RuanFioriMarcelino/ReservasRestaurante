import React, { useState } from "react";
import {
  View,
  Text,
  SafeAreaView,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from "react-native";
import AvatarBar from "../components/avatarBar";
import { Button } from "../components/button";
import { colors } from "../styles/colors";
import { AntDesign } from "@expo/vector-icons";
import {
  addDoc,
  auth,
  collection,
  database,
  deleteDoc,
  doc,
} from "../config/firebaseconfig";
import { StatusBar } from "expo-status-bar";
import ModalOverlay from "../components/modal";

export default function Payment({ route, navigation }: any) {
  const { orderDetails, total } = route.params;
  const user = auth.currentUser?.uid;

  const [payment, setPayment] = useState("");
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedPayment, setSelectedPayment] = useState("");

  const handlePayment = (method: any) => {
    setSelectedPayment(method);
    setModalVisible(true);
  };

  const cadOrder = async () => {
    try {
      if (!user) return;
      const orderCollectionRef = collection(database, "orders");
      await addDoc(orderCollectionRef, {
        addedAt: new Date(),
        user,
        orderDetails,
        total,
        paymentMethod: selectedPayment,
        status: "Processando",
      });
      console.log("Pedido registrado com sucesso!");
      delCart(orderDetails);
      Alert.alert("Pedido", "Seu pedido foi feito com sucesso!", [
        {
          onPress: () => navigation.navigate("Cardapio"),
        },
      ]);
    } catch (error) {
      console.error("Erro ao registrar pedido: ", error);
    }
  };

  async function delCart(ids: any) {
    if (!user) return;
    console.log(ids);
    for (const i in ids) {
      const taskDocRef = doc(database, "cart", `${user}`, "data", `${ids[i]}`);
      await deleteDoc(taskDocRef);
    }
  }

  return (
    <>
      <AvatarBar />
      <Text className="text-center text-laranja-200 font-bold text-2xl">
        Formas de pagamento
      </Text>

      <SafeAreaView className="flex-1 h-screen justify-center relative">
        <View className="gap-4 justify-center p-6">
          <Button
            title="Cartão"
            textColor={colors.white}
            bgcolor={colors.laranja[100]}
            onPress={() => handlePayment("Cartão")}
          />

          <Button
            title="Vale alimentação"
            textColor={colors.white}
            bgcolor={colors.laranja[100]}
            onPress={() => handlePayment("Vale alimentação")}
          />

          {payment != "pix" ? (
            <Button
              title="Pix"
              textColor={colors.white}
              bgcolor={colors.laranja[100]}
              onPress={() => setPayment("pix")}
            />
          ) : (
            <View>
              <TouchableOpacity
                onPress={() => setPayment("")}
                activeOpacity={0.7}
              >
                <View className="bg-laranja-100 h-14 w-full justify-center items-center rounded-t-lg">
                  <Text className="text-white font-bold">PIX</Text>
                </View>
              </TouchableOpacity>

              <View className="bg-slate-50 shadow shadow-black">
                <AntDesign name="qrcode" size={350} />
              </View>
            </View>
          )}
        </View>
      </SafeAreaView>
      <ModalOverlay
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalText}>
              Confirma o pagamento com {selectedPayment}?
            </Text>
            <View className="w-full gap-4">
              <Button
                title="Confirmar"
                textColor={colors.white}
                bgcolor={colors.laranja[200]}
                onPress={() => {
                  cadOrder();
                  setModalVisible(false);
                }}
              />
              <Button
                title="Cancelar"
                textColor={colors.white}
                bgcolor={colors.laranja[100]}
                onPress={() => setModalVisible(false)}
              />
            </View>
          </View>
        </View>
      </ModalOverlay>
    </>
  );
}

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContent: {
    width: 300,
    padding: 20,
    backgroundColor: "white",
    borderRadius: 10,
    alignItems: "center",
  },
  modalText: {
    marginBottom: 15,
    fontSize: 18,
    textAlign: "center",
  },
});