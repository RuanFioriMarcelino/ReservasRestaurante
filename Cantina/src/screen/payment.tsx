import {
  View,
  Text,
  SafeAreaView,
  TouchableOpacity,
  StyleSheet,
  Modal,
} from "react-native";
import AvatarBar from "../components/avatarBar";
import { Button } from "../components/button";
import { colors } from "../styles/colors";
import { AntDesign } from "@expo/vector-icons";
import { useState } from "react";
import { addDoc, collection, doc, setDoc } from "firebase/firestore";
import { auth, database } from "../config/firebaseconfig";

export default function Payment({ route, navigation }: any) {
  const { orderDetails, total } = route.params;

  console.log("Parametros: ", orderDetails, total);

  const [payment, setPayment] = useState("");
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedPayment, setSelectedPayment] = useState("");

  const handlePayment = (method: any) => {
    setSelectedPayment(method);
    setModalVisible(true);
  };

  const cadOrder = async () => {
    try {
      const user = auth.currentUser;
      if (!user) return;
      const userUID = user.uid;
      const orderCollectionRef = collection(database, "orders");
      await addDoc(orderCollectionRef, {
        addedAt: new Date(),
        userUID,
        orderDetails,
        total,
        paymentMethod: selectedPayment,
      });
      console.log("Pedido registrado com sucesso!");
    } catch (error) {
      console.error("Erro ao registrar pedido: ", error);
    }
  };
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

        <Modal
          transparent={true}
          visible={modalVisible}
          animationType="slide"
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
        </Modal>
      </SafeAreaView>
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
