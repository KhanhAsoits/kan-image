import {observer} from "mobx-react";
import {
    ActivityIndicator,
    ImageBackground,
    SafeAreaView,
    StyleSheet,
    TextInput,
    Touchable,
    TouchableOpacity
} from "react-native";
import {Box, HStack, KeyboardAvoidingView, NativeBaseProvider, Text, VStack} from "native-base";
import {SC_H, SC_W} from "../../core/helper";
import login_bg from '../../../assets/login_bg.jpg'
import Ionicons from "react-native-vector-icons/Ionicons";
import AuthModel from "../../model/AuthModel";

const SignInScreen = () => {
    return (
        <SafeAreaView style={{flex: 1}}>
            <NativeBaseProvider>
                <KeyboardAvoidingView style={{flex: 1}} behavior={'padding'}>
                    <ImageBackground blurRadius={9} imageStyle={{backgroundColor: 'black'}} source={login_bg}
                                     style={{flex: 1, transform: [{scale: 1}]}}
                                     resizeMode={'cover'}>
                        <VStack bgColor={'rgba(255,255,255,0.8)'} height={SC_H / 1.5} px={4} borderRadius={12}
                                position={'absolute'} top={SC_H / 10} space={10} width={SC_W - 66} alignSelf={'center'}
                                justifyContent={'center'} alignItems={'center'}>
                            <Text fontSize={36} fontWeight={'600'} color={'gray.900'}>Đăng Nhập</Text>
                            <TextInput
                                onChangeText={text => AuthModel.setAuthInfo({...AuthModel.authInfo, email: text})}
                                keyboardType={'email-address'}
                                placeholder={'Nhập email'}
                                placeholderTextColor={'rgba(0,0,0,0.6)'}
                                style={styles.inputStyle}
                            />
                            <TextInput
                                onChangeText={text => AuthModel.setAuthInfo({...AuthModel.authInfo, password: text})}
                                secureTextEntry={true}
                                keyboardType={'email-address'}
                                placeholder={'Nhập mật khẩu'}
                                placeholderTextColor={'rgba(0,0,0,0.6)'}
                                style={styles.inputStyle}
                            />
                            <TouchableOpacity onPress={async () => {
                                await AuthModel.onLogin(AuthModel.authInfo.email)
                            }} activeOpacity={.9} style={{
                                backgroundColor: '#567DF4',
                                width: '100%',
                                paddingVertical: 12,
                                borderRadius: 8,
                            }}>
                                {AuthModel.fetching ?
                                    <ActivityIndicator color={'white'} size={22}/>
                                    :
                                    <Text color={'white'} fontSize={16} fontWeight={'600'} textAlign={'center'}>
                                        Đăng Nhập
                                    </Text>
                                }

                            </TouchableOpacity>
                            <Text color={'gray.500'} fontSize={16} fontWeight={'600'} textAlign={'center'}>
                                Quên mật khẩu ?
                            </Text>
                            <Text color={'gray.500'} fontSize={12} marginY={-6} textAlign={'center'}>
                                --------- Liên hệ ---------
                            </Text>
                            <HStack space={2}>
                                <TouchableOpacity activeOpacity={1} style={{
                                    borderRadius: 50,
                                    backgroundColor: 'rgba(255,255,255,.8)',
                                    padding: 11,
                                }}>
                                    <Ionicons name={'logo-google'} color={'red'} size={20}/>
                                </TouchableOpacity>
                                <TouchableOpacity activeOpacity={1} style={{
                                    borderRadius: 50,
                                    backgroundColor: 'rgba(255,255,255,.8)',
                                    padding: 11,
                                }}>
                                    <Ionicons name={'logo-facebook'} color={'blue'} size={20}/>
                                </TouchableOpacity>
                            </HStack>
                        </VStack>
                    </ImageBackground>
                </KeyboardAvoidingView>
            </NativeBaseProvider>
        </SafeAreaView>
    )
}
const styles = StyleSheet.create({
    inputStyle: {
        width: '100%',
        borderRadius: 8,
        paddingVertical: 16,
        paddingHorizontal: 8,
        marginVertical: -12,
        backgroundColor: 'rgba(0,0,100,0.2)',
        fontSize: 16
    }
})
export default observer(SignInScreen)