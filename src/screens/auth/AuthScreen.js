import {observer} from "mobx-react";
import {Box, NativeBaseProvider, useLayout} from "native-base";
import {ImageBackground, Text, SafeAreaView, Touchable, TouchableOpacity, ActivityIndicator} from "react-native";
import login_bg from '../../../assets/login_bg.png'
import {SC_H, SC_W} from "../../core/helper";
import {useNavigation} from "@react-navigation/native";
import {useLayoutEffect} from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import AuthModel from "../../model/AuthModel";

const AuthScreen = ({route}) => {
    // auto login
   
    const nav = useNavigation()
    return (
        <SafeAreaView style={{flex: 1}}>
            <NativeBaseProvider>
                <Box flex={1} bgColor={'white'} overflow={'hidden'}>
                    <ImageBackground source={login_bg}
                                     style={{
                                         width: SC_W,
                                         flex: .96,
                                         justifyContent: 'center',
                                         alignItems: 'center',
                                         transform: [{scale: 1}]
                                     }}
                                     resizeMode={"cover"}>
                        <Box position={'absolute'} left={4} top={SC_H / 1.8}>
                            <Text style={{color: 'black', fontSize: 20, fontWeight: '500'}}>Welcome To</Text>
                            <Text style={{color: 'black', fontSize: 40, fontWeight: '600', marginBottom: 18}}>Kan
                                Images</Text>
                            <Text style={{color: 'gray', fontSize: 14, width: '22%', letterSpacing: 1.2}}>
                                Kan image là một phần mềm sử dụng để lưu trữ và chia sẻ ảnh,ghi âm,và những điều thú vị
                                trong cuộc sống.Khi tôi thực hiện dự án này , trong tôi chưa có bất cứ suy nghĩ gì về nó
                                cả,mọi thứ sẽ do bạn quyết định.
                            </Text>

                            <TouchableOpacity onPress={() => {
                                nav.navigate('sign_in_screen')
                            }} activeOpacity={.9} style={{
                                width: SC_W - 30,
                                backgroundColor: '#567DF4',
                                paddingVertical: 12,
                                borderRadius: 12,
                                marginVertical: SC_H / 20,
                                justifyContent: 'center',
                                alignItems: 'center',
                                flexDirection: 'row'
                            }}>
                                {AuthModel.fetching ?
                                    <ActivityIndicator size={22} color={'white'}/>
                                    :
                                    <Text
                                        style={{fontSize: 20, fontWeight: '500', color: 'white', marginHorizontal: 8}}>
                                        Đăng
                                        nhập</Text>
                                }
                            </TouchableOpacity>
                        </Box>
                    </ImageBackground>
                </Box>
            </NativeBaseProvider>
        </SafeAreaView>
    )
}
export default observer(AuthScreen)