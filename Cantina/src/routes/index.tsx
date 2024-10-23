import { createStackNavigator } from "@react-navigation/stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Ionicons, FontAwesome5 } from "@expo/vector-icons";
import { colors } from "../styles/colors";
import { View } from "react-native";

import Home from "../screen/home";

import Cart from "../screen/cart";
import Register from "../screen/register";
import Login from "../screen/login";
import Notification from "../screen/notification";
import { auth } from "../config/firebaseconfig";
import Payment from "../screen/payment";
import { SafeAreaView } from "react-native";
import ListOrders from "../screen/listOrders";

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

export function MyStack() {
  const user = auth.currentUser;
  return (
    <SafeAreaView className="flex-1 bg-laranja-100 pt-8">
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
