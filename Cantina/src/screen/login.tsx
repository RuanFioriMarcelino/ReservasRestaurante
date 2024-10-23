import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { Input } from "../components/input";
import { auth, onAuthStateChanged } from "../config/firebaseconfig";
import { signInWithEmailAndPassword } from "firebase/auth";

import { Button } from "../components/button";
import { colors } from "../styles/colors";

export default function Login({ navigation }: any) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<boolean>();

  const LoginUser = async () => {
    try {
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password
      );

      navigation.navigate("Home", { idUser: userCredential.user.uid });
    } catch (error) {
      console.error("Erro ao fazer login:", error);
      setError(true);
    }
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        navigation.navigate("Home", { idUser: user.uid });
      }
    });

    return unsubscribe;
  }, []);

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      className="bg-laranja-100 flex-1 p-8 items-center justify-center"
    >
      <View className="items-center w-full gap-4">
        <Text className="text-5xl font-bold text-white uppercase">Entrar</Text>
        <Input>
          <Input.Field
            placeholder="Email"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
          />
        </Input>
        <Input>
          <Input.Field
            placeholder="Senha"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
          />
        </Input>
        <View className="w-full items-start">
          <TouchableOpacity activeOpacity={0.7}>
            <Text className="text-white font-bold text-center  underline">
              Esqueci minha senha
            </Text>
          </TouchableOpacity>
        </View>

        {error && (
          <View>
            <Text>Email ou senha inválidos</Text>
          </View>
        )}
      </View>

      {email === "" || password === "" ? (
        <View className="w-11/12 h-16 mt-8">
          <Button
            title="Entrar"
            disabled
            bgcolor={colors.white}
            textColor={colors.laranja[100]}
          />
        </View>
      ) : (
        <View className="w-11/12 h-16 mt-8">
          <Button
            title="Entrar"
            onPress={LoginUser}
            bgcolor={colors.white}
            textColor={colors.laranja[100]}
          />
        </View>
      )}

      <View className="flex-row mt-8">
        <Text className="text-white">Não Tem Uma Conta?</Text>
        <TouchableOpacity onPress={() => navigation.navigate("Register")}>
          <Text className="text-white font-medium"> Criar Agora</Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}
