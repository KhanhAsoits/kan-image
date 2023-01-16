import {observer} from "mobx-react";
import {createNativeStackNavigator} from "@react-navigation/native-stack";
import {NavigationContainer} from '@react-navigation/native'
import HomeScreen from "../screens/home/HomeScreen";
import AuthModel from "../model/AuthModel";
import AuthScreen from "../screens/auth/AuthScreen";
import SignInScreen from "../screens/auth/SignInScreen";

const AppNav = () => {
    const Stack = createNativeStackNavigator()
    return (
        <NavigationContainer>
            <Stack.Navigator>
                {AuthModel.isLogin ?
                    <Stack.Screen options={{headerShown: false, gestureEnabled: false}} name={'home_screen'}
                                  component={HomeScreen}/>
                    :
                    <Stack.Group>
                        <Stack.Screen name={'auth_screen'} options={{headerShown: false, gestureEnabled: false}}
                                      component={AuthScreen}></Stack.Screen>
                        <Stack.Screen name={'sign_in_screen'} options={{headerShown: false, gestureEnabled: true}}
                                      component={SignInScreen}></Stack.Screen>

                    </Stack.Group>
                }
            </Stack.Navigator>
        </NavigationContainer>
    )
}
export default observer(AppNav)