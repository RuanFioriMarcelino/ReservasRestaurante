import React, { useState } from "react";
import {
  View,
  Text,
  SafeAreaView,
  TouchableOpacity,
  StyleSheet,
  Alert,
  Clipboard,
} from "react-native";

import QRCode from "react-native-qrcode-svg";
import { postCriarPix } from "../api/service";
import AvatarBar from "../components/avatarBar";
import { Button } from "../components/button";
import { colors } from "../styles/colors";
import {
  addDoc,
  auth,
  collection,
  database,
  deleteDoc,
  doc,
} from "../config/firebaseconfig";
import ModalOverlay from "../components/modal";
import { useGetUser } from "../components/getUser";

interface Detail {
  id: string;
  observation: string;
}

type Usuario = {
  email: string;
  cpf: string;
};

export default function Payment({ route, navigation }: any) {
  const { orderDetails, total, pickupTime } = route.params;
  const user: Usuario | null = useGetUser();
  const [qrCode, setQRcode] = useState("");
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedPayment, setSelectedPayment] = useState("");

  const MOCK_BODY = user
    ? {
        transaction_amount: total,
        description: `Horário de retirada: ${pickupTime}`,
        payment_method_id: "pix",
        email: user.email,
        identificationType: "CPF",
        number: user.cpf,
      }
    : null;

  const handlePayment = (method: string) => {
    setSelectedPayment(method);
    if (method !== "pix" && method !== "") {
      setModalVisible(true);
    }
    if (method === "pix" && MOCK_BODY) {
      postCriarPix(MOCK_BODY)
        .then((response) => {
          console.log("response", response.data);
          const qrCodeData =
            response.data?.point_of_interaction?.transaction_data?.qr_code;
          if (qrCodeData) {
            setQRcode(qrCodeData);
          } else {
            console.error("QR Code not found in response");
          }
        })
        .catch((error) => {
          console.error("Error:", error);
        });
    }
  };

  const flattenedOrderDetails = orderDetails.flat();

  const cadOrder = async () => {
    try {
      const userID = auth.currentUser?.uid;
      if (!userID) return;

      const orderCollectionRef = collection(database, "orders");
      await addDoc(orderCollectionRef, {
        addedAt: new Date(),
        userID,
        orderDetails: flattenedOrderDetails,
        total,
        paymentMethod: selectedPayment,
        status: "Processando",
        pickupTime,
      });
      console.log("Pedido registrado com sucesso!");

      const productIds = flattenedOrderDetails.map(
        (detail: Detail) => detail.id
      );
      delCart(productIds);

      Alert.alert("Pedido", "Seu pedido foi feito com sucesso!", [
        {
          onPress: () => navigation.navigate("Cardapio"),
        },
      ]);
    } catch (error) {
      console.error("Erro ao registrar pedido: ", error);
    }
  };

  const delCart = async (ids: string[]) => {
    const userId = auth.currentUser?.uid;
    if (!userId) return;
    console.log("del: ", ids);
    for (const id of ids) {
      const taskDocRef = doc(database, "cart", userId, "data", id);
      await deleteDoc(taskDocRef);
    }
  };

  const copyToClipboard = () => {
    Clipboard.setString(qrCode);
    Alert.alert("Copiado", "O QR Code foi copiado para sua área de trabalho");
  };

  return (
    <>
      <AvatarBar />
      <Text className="text-center text-laranja-200 font-bold text-2xl mt-2">
        Pagamento
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

          {selectedPayment !== "pix" ? (
            <Button
              title="Pix"
              textColor={colors.white}
              bgcolor={colors.laranja[100]}
              onPress={() => handlePayment("pix")}
            />
          ) : (
            <View>
              <TouchableOpacity
                onPress={() => handlePayment("")}
                activeOpacity={0.7}
              >
                <View className="bg-laranja-100 h-14 w-full justify-center items-center rounded-t-lg">
                  <Text className="text-white font-bold">PIX</Text>
                </View>
              </TouchableOpacity>

              <View className="bg-slate-50 shadow shadow-black justify-center items-center px-4 py-8">
                {qrCode ? (
                  <>
                    <View className="w-full">
                      <QRCode value={qrCode} size={314} />
                    </View>
                    <View className="bg-laranja-100 w-full rounded-b-md">
                      <TouchableOpacity
                        onPress={copyToClipboard}
                        activeOpacity={0.7}
                      >
                        <View className="h-14 w-full justify-center items-center">
                          <Text className="font-medium text-white">
                            Clique aqui para copiar seu QRCode
                          </Text>
                        </View>
                      </TouchableOpacity>
                    </View>
                  </>
                ) : (
                  <Text>Nenhum QRCode gerado</Text>
                )}
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
              Pagamento com {selectedPayment} será efetuado no momento da
              retirada. Deseja confirmar?
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
