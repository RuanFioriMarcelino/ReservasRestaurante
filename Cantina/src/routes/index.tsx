import { createStackNavigator } from "@react-navigation/stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { MaterialCommunityIcons, Ionicons } from "@expo/vector-icons";
import { colors } from "../styles/colors";
import { View } from "react-native";

import Home from "../screen/home";
import Drinks from "../screen/drinks";
import Cart from "../screen/cart";
import Register from "../screen/Register";
import Login from "../screen/login";
import Notification from "../screen/notification";
import { auth } from "../config/firebaseconfig";

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

export function MyStack() {
  const user = auth.currentUser;
  return (
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
      </>
    </Stack.Navigator>
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
          title: "Início",
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
        name="Home"
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
          title: "Bebidas",
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
              <MaterialCommunityIcons
                name="cup"
                size={24}
                color={colors.white}
              />
            </View>
          ),
        }}
        name="Drinks"
        component={Drinks}
      />
    </Tab.Navigator>
  );
}
