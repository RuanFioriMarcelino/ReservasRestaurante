import { createStackNavigator } from '@react-navigation/stack'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { MaterialCommunityIcons, Ionicons } from "@expo/vector-icons"; 
import Home from '../screen/home';
import { colors } from '../styles/colors';
import Drinks from '../screen/drinks';
import Cart from '../screen/cart';
import { View } from 'react-native';

/* export default function MyStack() {
    return (
        <Stack.Navigator>
            <Stack.Screen name='Home' component={Home}/>
        </Stack.Navigator>
    )
} */

const Tab = createBottomTabNavigator();

interface background {
  home: string,
  cart: string,
  drinks: string

}

export default function MyTab({home, cart, drinks}:background) {

  return (
      <Tab.Navigator screenOptions={{
        tabBarStyle: {backgroundColor: colors.laranja[100], borderTopLeftRadius: 20, borderTopRightRadius: 20, height:80,},
      }}>
        <Tab.Screen options={{headerShown: false, title: 'Início', tabBarLabelStyle: { fontSize: 16, color: colors.white },tabBarIcon: (tabInfo) => { 
        return ( 
          <View style={{paddingHorizontal: 14, paddingVertical: 6, borderRadius:18, backgroundColor: tabInfo.focused ? home=colors.laranja[200] : home=colors.laranja[100]}}>
            <Ionicons 
              name="home"
              size={24} 
              color={colors.white}
        /></View>
           )}

          
        }} name="home" component={Home} />
        <Tab.Screen options={{headerShown: false, title: 'Carrinho', tabBarLabelStyle: { fontSize: 16, color: colors.white },tabBarIcon: (tabInfo) => { 
        return ( 
          <View style={{paddingHorizontal: 14, paddingVertical: 6, borderRadius:18, backgroundColor: tabInfo.focused ? home=colors.laranja[200] : home=colors.laranja[100]}}>
            <Ionicons 
              name="cart"
              size={24} 
              color={colors.white}
        /></View>
           )}

          
        }} name="Cart" component={Cart} />

      <Tab.Screen options={{headerShown: false, title: 'Bebidas', tabBarLabelStyle: { fontSize: 16, color: colors.white },tabBarIcon: (tabInfo) => { 
        return ( 
          <View style={{paddingHorizontal: 14, paddingVertical: 6, borderRadius:18, backgroundColor: tabInfo.focused ? home=colors.laranja[200] : home=colors.laranja[100]}}>
            <MaterialCommunityIcons 
              name="cup"
              size={24} 
              color={colors.white}
        /></View>
           )}

          
        }} name="Bebidas" component={Drinks} />
      </Tab.Navigator>
  );
}