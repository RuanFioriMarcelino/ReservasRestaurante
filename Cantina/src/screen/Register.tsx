import {
  View,
  Text,
  Alert,
  KeyboardAvoidingView,
  Platform,
  TouchableOpacity,
} from "react-native";
import { Input } from "../components/input";
import { Button } from "../components/button";

import { auth, database } from "../config/firebaseconfig";
import { collection, addDoc } from "firebase/firestore";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { useState } from "react";
import { colors } from "../styles/colors";

export default function Register({ navigation }: any) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState<string>("");
  const [isLoading, setIsLoading] = useState(false);

  const newUser = async () => {
    try {
      if (!name.trim() || !email.trim()) {
        return Alert.alert("Inscrição", "Preencha todos os campos!");
      }
      setIsLoading(true);
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );

      Alert.alert("Inscrição", "Inscrição realizada com sucesso!", [
        { text: "OK", onPress: () => navigation.navigate("/Cardapio") },
      ]);

      const userCollection = collection(database, "user");
      addDoc(userCollection, {
        name: name,
        idUser: userCredential.user.uid,
      });
      setName("");

      console.log("User registered:", userCredential.user);
      Alert.alert("conta criada");
      navigation.navigate("Signin");
    } catch (error) {
      console.log(error);
      setIsLoading(false);
      Alert.alert("Inscrição", "Não foi possivel fazer o registro.");
    }
  };

  return (
    <KeyboardAvoidingView
      className="bg-laranja-100 flex-1 p-8 items-center justify-center"
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <View className="gap-4 items-center">
        <Text className="text-5xl font-bold text-white uppercase">
          REGISTRE-SE
        </Text>
        <Input>
          <Input.Field placeholder="Nome" value={name} onChangeText={setName} />
        </Input>
        <Input>
          <Input.Field
            placeholder="E-Mail"
            value={email}
            onChangeText={setEmail}
          />
        </Input>
        <Input>
          <Input.Field
            placeholder="Senha"
            value={password}
            onChangeText={setPassword}
          />
        </Input>
      </View>
      <View className="w-11/12 mt-8">
        <Button
          title="Registrar"
          bgcolor={colors.white}
          textColor={colors.laranja[100]}
          onPress={newUser}
        />
      </View>
      <View className="flex-row mt-8">
        <Text className="text-white">Já Possui Uma Conta?</Text>
        <TouchableOpacity onPress={() => navigation.navigate("Login")}>
          <Text className="text-white font-medium"> Entrar Agora</Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}
