import {observer} from "mobx-react";
import {Box, KeyboardAvoidingView, NativeBaseProvider} from "native-base";
import {SafeAreaView, Platform, ActivityIndicator} from "react-native";
import {SC_H, SC_W} from "../../core/helper";
import ListFiles from "../../cpn/ListFiles";
import UploadFile from "../../cpn/UploadFile";
import {useLayoutEffect} from "react";
import ListFileModel from "../../model/ListFileModel";
import {useNavigation} from "@react-navigation/native";

const HomeScreen = ({route}) => {
    const nav = useNavigation()

    useLayoutEffect(() => {
        //     check files
        const sync = async () => {
            await ListFileModel.getAllFile()
        }
        sync()
    }, [])

    return (
        <SafeAreaView style={{flex: 1}}>
            <NativeBaseProvider>
                <Box width={SC_W} height={SC_H} bgColor={'black'} justifyContent={'center'} alignItems={'center'}>
                    {ListFileModel.fetching ?
                        <ActivityIndicator color={'white'} size={30}/>
                        :
                        ListFileModel.files.length > 0 ?
                            <Box width={SC_W} flex={1} bgColor={'black'} px={2} py={1}>
                                <KeyboardAvoidingView style={{flex: 1}}
                                                      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
                                    <ListFiles isCollection={true}/>
                                </KeyboardAvoidingView>
                            </Box>
                            :
                            <UploadFile/>
                    }
                </Box>
            </NativeBaseProvider>
        </SafeAreaView>
    )
}
export default observer(HomeScreen)