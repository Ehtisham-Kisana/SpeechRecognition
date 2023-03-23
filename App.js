import * as React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import AudioScreen from "./components/AudioScreen";
import Result from "./components/Result";

const Stack = createNativeStackNavigator();

function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Speech Recognition">
        <Stack.Screen
          name="Speech Recognition"
          component={AudioScreen}
          options={{
            title: 'Speech Recognition',
            headerStyle: {
              backgroundColor: '#708090',
            },
            headerTintColor: '#fff',
            headerTitleStyle: {
              fontWeight: 'bold',
              
            },
            headerTitleAlign: 'center',
          }}
        />
        <Stack.Screen name="Result" component={Result} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default App;
