import { observer } from "mobx-react"
import { Modal } from "../cpn/Modal"
import QRCode from 'react-native-qrcode-svg'
import { Box ,HStack,Text, useToast} from "native-base"
import qrManagerModel from "../model/QrManagerModal"
import { ActivityIndicator, Alert, Linking, PermissionsAndroid, Platform, TouchableOpacity } from "react-native"
import Ionicons from 'react-native-vector-icons/Ionicons'
import { useRef, useState } from "react"
import * as MediaLibrary from 'expo-media-library'
import * as FileSystem from 'expo-file-system'
import { getAndroidWriteExternalStoragePermission, getSharedPermission, slugify } from "../core/helper"
import listFileModel from "../model/ListFileModel"
import { configs } from "../core/configs"
import * as Sharing from 'expo-sharing'
const ShareCollectionModal = (props)=>{
    const [saving,setSaving] = useState(false)
    const handleSave = async()=>{
       if(Platform.OS === 'android'){
        var isGranted = await getAndroidWriteExternalStoragePermission()
       };
       if(isGranted !== PermissionsAndroid.RESULTS.GRANTED && Platform.OS !== "ios"){
            props.toast.show({
                description:'không có quyền truy cập vào bộ nhớ nên không lưu được huhu...',
                duration:2000
            })
            await getAndroidWriteExternalStoragePermission()
            return;
       }
       
       // if granted
        //    get base 64 data for qr code 
        const getData = async(dataURL)=>{
            try{
                if(!saving){
                    setSaving(true)
                    props.toast.show({description:'đang lưu...'})
                    setTimeout(async()=>{
                        const filename = FileSystem.documentDirectory + slugify(listFileModel.holdFile.name)+".png"
                        // write to storage
                        await FileSystem.writeAsStringAsync(filename,dataURL,{encoding:FileSystem.EncodingType.Base64})
                                    
                        // after write to storage save to library 
                        const asset =  await MediaLibrary.createAssetAsync(filename)
                        const getAlbum = await MediaLibrary.getAlbumAsync(configs.download_album_name)
                        if(getAlbum){
                            // has exit add to album 
                            await MediaLibrary.addAssetsToAlbumAsync(asset,getAlbum,true)
                        }else{
                            // create 
                            await MediaLibrary.createAlbumAsync(configs.download_album_name,asset,true)
                        }
                        props.toast.closeAll()
                        props.toast.show({
                            description:'Đã lưu',
                            duration:2000
                        })
                        setSaving(false)
                        // show shared 
                        // get permission 
                        var isSharing = await getSharedPermission()
                        if(!isSharing){
                            props.toast.show({
                                description:'không có quyền chia sẻ huhu...',
                                duration:2000
                            })
                            return;
                        }
                        // if granted
                        await Sharing.shareAsync(filename)
                        props.toast.show({
                            description:'đã gửi'
                        })
                    },2000)
                }
            }catch(e){
                props.toast.show({
                    description:'có chút lỗi xảy ra hãy thử lại sau nhé.'
                })
            }
        }
        //    get data
        qrRef.current.toDataURL(getData)

    }
    const handleShared = async()=>{
        handleSave()
    }

    const visible = props?.visible
    const qrRef = useRef()
    return (
        <Modal bg={'black'} visible={visible}>
            <Box w={'100%'} h={'100%'} justifyContent={'center'} alignItems={'center'}>
                <HStack space={5} pb={8}>
                    <TouchableOpacity onPress={handleShared} style={{
                        width:'36%',
                        paddingVertical:8,
                        paddingHorizontal:20,
                        borderRadius:6,
                        borderWidth:1,
                        flexDirection:'row',
                        alignItems:'center',
                        borderColor:'white'
                    }}>
                        <Ionicons name={'arrow-redo'} color={'white'} size={22}/>
                        <Text textAlign={'center'} mx={2} color={'white'}>Chia Sẻ</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={handleSave} style={{
                        width:'36%',
                        paddingVertical:8,
                        paddingHorizontal:20,
                        borderRadius:6,
                        flexDirection:'row',
                        alignItems:'center',
                        justifyContent:'center',
                        borderWidth:1,
                        borderColor:'white'
                    }}>
                        {saving ? 
                            <ActivityIndicator color={'gray'} size={22}/>
                        :
                            <>
                            <Ionicons name={'download-outline'} color={'white'} size={22}/>
                            <Text color={'white'} mx={2} textAlign={'center'}>Lưu</Text>        
                            </>
                        }
                        
                    </TouchableOpacity>
                </HStack>
                
                <Box p={4} bgColor={'white'}>
                <QRCode
                    value={qrManagerModel?.qrCode || 'test'}
                    size={200}
                    logoBackgroundColor='transparent'
                    getRef={qrRef}
                    />
                </Box>
                <Text color={'gray.400'} fontSize={12} mt={6}>Code sẽ có hiệu lực trong 15 phút</Text>
            </Box>
        </Modal>
    )
}
export default observer(ShareCollectionModal)