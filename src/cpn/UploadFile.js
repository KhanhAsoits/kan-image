import {observer} from "mobx-react";
import {Box, Center, Image, Text} from "native-base";
import {useState} from "react";
import {
    TouchableOpacity,
} from 'react-native'
import Ionicons from "react-native-vector-icons/Ionicons";
import {SC_H, SC_W} from "../core/helper";
import {useSharedValue} from "react-native-reanimated";
import {ImagePickerCustom} from "./ImagePickerCustom";
import {Uploading} from "./Uploading";

const UploadFile = ({goBack = false, nav}) => {
    const isOpen = useSharedValue(false)
    const [assets, setAssets] = useState([])
    const pickImage = () => {
        isOpen.value = true
    }

    return (
        <Center flex={1} justifyContent={'center'} bgColor={'black'} alignItems={'center'}>
            {assets.length === 0 && isOpen.value === false
                &&
                <TouchableOpacity activeOpacity={.9} onPress={pickImage}>
                    <Box borderStyle={'dashed'} justifyContent={'center'} alignItems={'center'} width={SC_W / 1.5}
                         borderWidth={3} borderRadius={18} borderColor={'gray.500'}
                         height={SC_H / 2}>
                        <Ionicons name={'duplicate-outline'} color={'rgba(255,255,255,.5)'} size={100}/>
                        <Text color={'gray.400'} fontSize={20} marginY={2}>Tải Lên Ảnh Mới</Text>
                    </Box>
                </TouchableOpacity>
            }
            <ImagePickerCustom setAssets={setAssets} isOpen={isOpen}/>
            {assets.length > 0 && isOpen.value === false
                &&
                <Uploading goBack={goBack} nav={nav} assets={assets}/>
            }
        </Center>
    )
}
export default observer(UploadFile)