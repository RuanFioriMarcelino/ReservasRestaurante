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
import { storage } from "../config/firebaseconfig";

import * as ImagePicker from "expo-image-picker";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";

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
  const [image, setImage] = useState<string>("");
  const [progress, setProgress] = useState(0);

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [4, 4],
      quality: 1,
    });

    if (!result.canceled) {
      const { uri } = result.assets[0];
      uploadImage(uri);
    }
  };

  const uploadImage = async (uri: any) => {
    const response = await fetch(uri);
    const blob = await response.blob();
    const fileName = uri.split("/").pop();
    const storageRef = ref(storage, `imageUser/${fileName}`);

    const uploadTask = uploadBytesResumable(storageRef, blob);

    uploadTask.on(
      "state_changed",
      (snapshot) => {
        const progress =
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        setProgress(progress);
      },
      (error) => {
        alert(error);
      },
      () => {
        getDownloadURL(uploadTask.snapshot.ref).then((url) => {
          setImage(url);
        });
      }
    );
  };

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
        image: image,
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
        <View className="w-full">
          <Button
            bgcolor={colors.white}
            textColor={colors.laranja[100]}
            title="Insira sua foto de retrato"
            onPress={pickImage}
          />
        </View>
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
