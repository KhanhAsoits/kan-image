import { NativeBaseProvider,Text,Box} from "native-base"
import { SafeAreaView } from "react-native-safe-area-context"
import { observer } from "mobx-react"
import { useLayoutEffect, useState } from "react"
import {BarCodeScanner} from 'expo-barcode-scanner'
import { SC_H, SC_W } from "../../core/helper"
import { ScannerView } from "../../cpn/ScannerView"
import { ActivityIndicator, TouchableOpacity, Vibration } from "react-native"
import * as ImagePicker from 'expo-image-picker'
import Ionicons from 'react-native-vector-icons/Ionicons'

import { useNavigation } from "@react-navigation/native"
import { BARCODE_TYPE } from "../../core/types"
import qrManagerModel from "../../model/QrManagerModal"
import Animated from "react-native-reanimated"
const QrScanner = ()=>{
    const [hasPermission,setHasPermission] = useState(null)
    const [scannedResult,setScannedResult] = useState('')
    const [image,setImage] = useState(null)
    const nav = useNavigation()
    // get perm 
    useLayoutEffect(()=>{
        const getScannerPermission = async()=>{
            const {status} = await BarCodeScanner.requestPermissionsAsync()
            setHasPermission(status === "granted")
        }
        getScannerPermission()
    },[])

    const pickImage = async ()=>{
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.All,
            allowsEditing: true,
            aspect: [4, 3],
            quality: 1,
          });
          if (!result.canceled) {
            setImage(result.assets[0].uri);
          }
    }

    const handleCodeScanned = ({type,data})=>{
        if(type === BARCODE_TYPE.QR){
            setScannedResult(data)
        }
    }
    
    const progressQR = async(qr,raw = true)=>{
        await qrManagerModel.processQrCode(qr,raw)

    }
    useLayoutEffect(()=>{
        if(scannedResult.trim() !== ""){
            Vibration.vibrate()
            progressQR(scannedResult)
        }
        if(image && image.trim() !== ""){
            progressQR(image,false)
        }
    },[scannedResult,image])

    return (
        <SafeAreaView style={{flex:1,backgroundColor:'black'}}>
            <NativeBaseProvider>
                    <>
                        {qrManagerModel.processing && 
                            <Box top={0} justifyContent={'center'} alignItems={'center'} left={0} borderRadius={12} zIndex={100} position={'absolute'} w={SC_W} h={SC_H}>
                                <Box top={SC_H / 2 -  (20 * 2)} justifyContent={'center'} alignItems={'center'} left={SC_W / 2 - (20 * 2)} borderRadius={12} zIndex={100} position={'absolute'} w={20} h={20} bgColor={'rgba(255,255,255,.9)'}>
                                    <ActivityIndicator color={'black'} size={50}/>
                                </Box>
                            </Box>
                        }
                        <TouchableOpacity onPress={()=>{nav.goBack()}} style={{
                            position:'absolute',
                            top:10,
                            left:10,
                            zIndex:100
                        }}>
                            <Ionicons name={'close'} color={'white'} size={30}/>
                        </TouchableOpacity>
                        <ScannerView width={SC_W/1.8} height={SC_W/1.8}/>
                        <TouchableOpacity onPress={pickImage} style={{
                            zIndex:100,
                            position:'absolute',
                            bottom:SC_H / 6,
                            left:SC_W / 2 - (45 / 2) 
                        }}>
                            <Ionicons name={'image'} size={45} color={'white'}/>
                            <Text textAlign={'center'} width={SC_W} position={'absolute'} bottom={-22} left={- SC_W  / 2 + (45 / 2)} color={'white'}>Chọn Qr từ thư viện</Text>
                        </TouchableOpacity>
                        <BarCodeScanner onBarCodeScanned={scannedResult.length !== 0 ? undefined : handleCodeScanned} style={{width:SC_W,height:SC_H}}/>
                    </>
            </NativeBaseProvider>
        </SafeAreaView>
    )
}

export default observer(QrScanner)