import { Modal, StyleSheet } from "react-native";
import { ReactNode } from "react";
import { StatusBar } from "expo-status-bar";

export default function ModalOverlay({
  children,
  visible,
  onRequestClose,
}: {
  children: ReactNode;
  visible: boolean;
  onRequestClose: () => void;
}) {
  return (
    <Modal
      transparent={true}
      visible={visible}
      animationType="fade"
      onRequestClose={onRequestClose}
    >
      <StatusBar backgroundColor="rgba(0, 0, 0, 0.5)" />
      {children}
    </Modal>
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
