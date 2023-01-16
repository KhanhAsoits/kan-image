import UploadFile from "../../cpn/UploadFile";
import {observer} from "mobx-react";
import {SafeAreaView} from "react-native";
import {NativeBaseProvider} from "native-base";
import {useNavigation} from "@react-navigation/native";

const UploadScreen = () => {
    const nav = useNavigation()
    return (
        <SafeAreaView style={{flex: 1, backgroundColor: 'black',justifyContent:'center',alignItems:'center'}}>
            <NativeBaseProvider>
                <UploadFile goBack={true} nav={nav}/>
            </NativeBaseProvider>
        </SafeAreaView>
    )
}
export default observer(UploadScreen)