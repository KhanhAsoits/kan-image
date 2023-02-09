import {observer} from "mobx-react";
import {createNativeStackNavigator} from "@react-navigation/native-stack";
import {NavigationContainer} from '@react-navigation/native'
import HomeScreen from "../screens/home/HomeScreen";
import AuthModel from "../model/AuthModel";
import AuthScreen from "../screens/auth/AuthScreen";
import SignInScreen from "../screens/auth/SignInScreen";
import UploadScreen from "../screens/upload/UploadScreen";
import CollectionDetailScreen from "../screens/collection/CollectionDetailScreen";
import DownloadScreen from "../screens/download/DownloadScreen";
import QrScanner from "../screens/scanner/QrScanner";
import { useLayoutEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import SharedScreen from "../screens/shared/SharedScreen";
import ShareManager from "../screens/shared/ShareManager";

const AppNav = () => {
    useLayoutEffect(() => {
        const sync = async () => {
            const email = await AsyncStorage.getItem("@auth_email")
            if (email !== null && email !== "") {
                //     auto login
                console.log('Auto login with email : ', email)
                await AuthModel.onLogin(email, true)
            }
        }
        sync()
    }, [])

    useLayoutEffect(() => {
        if (AuthModel.user?.email && AuthModel.user.email !== "") {
            const async = async () => {
                const email = await AsyncStorage.getItem("@auth_email")
                if (email === null || email === "") {
                    await AsyncStorage.setItem("@auth_email", AuthModel.user.email)
                }
                AuthModel.setIsLogin(true)
            }
            async()
        }else{
            AuthModel.setIsLogin(false)
        }
        console.log('user:',AuthModel.user)
    }, [AuthModel.user])
    const Stack = createNativeStackNavigator()
    return (
        <NavigationContainer>
            <Stack.Navigator>
                {AuthModel.isLogin ?
                    <Stack.Group>
                        <Stack.Screen options={{headerShown: false, gestureEnabled: false}} name={'home_screen'}
                                      component={HomeScreen}/>
                        <Stack.Screen name={'upload'} options={{headerShown: false, gestureEnabled: true}}
                                      component={UploadScreen}
                        />
                        <Stack.Screen name={'collection-detail'} options={{headerShown: false}}
                                      component={CollectionDetailScreen}
                        ></Stack.Screen>
                        <Stack.Screen name={'download'} options={{headerShown: false}}
                                      component={DownloadScreen}
                        ></Stack.Screen>
                        <Stack.Screen name={'scanner'} options={{headerShown:false,gestureEnabled:false}} component={QrScanner}>
                        </Stack.Screen>
                        <Stack.Screen name={'shared'} options={{headerShown:false,gestureEnabled:true}} component={SharedScreen}>
                        </Stack.Screen>
                        <Stack.Screen name={"share_manager"} options={{headerShown:false}} component={ShareManager}></Stack.Screen>
                    </Stack.Group>
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