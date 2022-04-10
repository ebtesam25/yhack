import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import Register from './src/screens/register';
import Home from './src/screens/home';
import FlightInfo from './src/screens/flightInfo';
import AddContract from './src/screens/addContract';
import Contracts from './src/screens/allContracts';




const Stack = createStackNavigator();

function MiamiStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen 
        name="Register" 
        component={Register} 
        options={{ headerShown: false}} 
      />
      <Stack.Screen 
        name="Home" 
        component={Home} 
        options={{ headerShown: false}} 
      />
      <Stack.Screen 
        name="FlightInfo" 
        component={FlightInfo} 
        options={{ headerShown: false}} 
      />
      <Stack.Screen 
        name="AddContract" 
        component={AddContract} 
        options={{ headerShown: false}} 
      />
      <Stack.Screen 
        name="Contracts" 
        component={Contracts} 
        options={{ headerShown: false}} 
      />
    </Stack.Navigator>
  );
}

export default function App() {
  return (
    <NavigationContainer>
      <MiamiStack />
    </NavigationContainer>
  );
}