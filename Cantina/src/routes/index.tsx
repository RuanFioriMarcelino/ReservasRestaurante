import { createStackNavigator } from "@react-navigation/stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Ionicons, FontAwesome5 } from "@expo/vector-icons";
import { colors } from "../styles/colors";
import { View } from "react-native";
import { useEffect, useState } from "react";
import { onAuthStateChanged } from "firebase/auth"; // Importa a função para monitorar mudanças de autenticação

import Home from "../screen/home";
import Cart from "../screen/cart";
import Register from "../screen/Register";
import Login from "../screen/login";
import Notification from "../screen/notification";
import Payment from "../screen/payment";
import ListOrders from "../screen/listOrders";
import { auth } from "../config/firebaseconfig";
import { SafeAreaView } from "react-native";

import { Loading } from "../components/loading";

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

export function MyStack() {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (authUser: any) => {
      setUser(authUser); // Define o usuário autenticado (ou null se não autenticado)
      setIsLoading(false); // Define isLoading como false após obter o estado do usuário
    });

    return unsubscribe; // Desinscreve o listener quando o componente desmonta
  }, []);

  // Mostra uma tela de carregamento enquanto verifica o estado de autenticação
  if (isLoading) {
    return (
      <SafeAreaView className="flex-1 bg-laranja-100 pt-8 justify-center items-center">
        <Loading />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-laranja-100 ">
      <Stack.Navigator initialRouteName={user ? "Home" : "Login"}>
        {!user ? (
          <>
            <Stack.Screen
              name="Register"
              component={Register}
              options={{ headerShown: false }}
            />
            <Stack.Screen
              name="Login"
              component={Login}
              options={{ headerShown: false }}
            />
          </>
        ) : null}

        <>
          <Stack.Screen
            name="Home"
            component={MyTab}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="Notification"
            component={Notification}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="Payment"
            component={Payment}
            options={{ headerShown: false }}
          />
        </>
      </Stack.Navigator>
    </SafeAreaView>
  );
}

export function MyTab() {
  return (
    <Tab.Navigator
      screenOptions={{
        tabBarStyle: {
          backgroundColor: colors.laranja[100],
          borderTopLeftRadius: 20,
          borderTopRightRadius: 20,
          height: 80,
        },
        tabBarLabelStyle: { fontSize: 14, color: colors.white },
        tabBarIconStyle: { marginTop: 5 },
        tabBarItemStyle: { paddingVertical: 5 },
      }}
    >
      <Tab.Screen
        options={{
          headerShown: false,
          title: "Cardápio",
          tabBarIcon: ({ focused }) => (
            <View
              style={{
                paddingHorizontal: 14,
                paddingVertical: 6,
                borderRadius: 18,
                backgroundColor: focused
                  ? colors.laranja[200]
                  : colors.laranja[100],
              }}
            >
              <Ionicons name="home" size={24} color={colors.white} />
            </View>
          ),
        }}
        name="Cardapio"
        component={Home}
      />

      <Tab.Screen
        options={{
          headerShown: false,
          title: "Carrinho",
          tabBarIcon: ({ focused }) => (
            <View
              style={{
                paddingHorizontal: 14,
                paddingVertical: 6,
                borderRadius: 18,
                backgroundColor: focused
                  ? colors.laranja[200]
                  : colors.laranja[100],
              }}
            >
              <Ionicons name="cart" size={24} color={colors.white} />
            </View>
          ),
        }}
        name="Cart"
        component={Cart}
      />
      <Tab.Screen
        options={{
          headerShown: false,
          title: "Meus Pedidos",
          tabBarIcon: ({ focused }) => (
            <View
              style={{
                paddingHorizontal: 14,
                paddingVertical: 6,
                borderRadius: 18,
                backgroundColor: focused
                  ? colors.laranja[200]
                  : colors.laranja[100],
              }}
            >
              <FontAwesome5
                name="clipboard-list"
                size={24}
                color={colors.white}
              />
            </View>
          ),
        }}
        name="ListOrders"
        component={ListOrders}
      />
    </Tab.Navigator>
  );
}
