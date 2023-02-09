
import { observer } from "mobx-react"
import {VStack,HStack,Text, Box ,Image, useToast, useToken} from "native-base"
import Animated, { useAnimatedStyle, useSharedValue, withSpring, withTiming } from "react-native-reanimated"
import {ActivityIndicator, Alert, TouchableOpacity} from 'react-native'
import { SC_H ,SC_W} from "../core/helper"
import { ToolTip } from "./ToolTip"
import Ionicons from 'react-native-vector-icons/Ionicons'
import AntDesign from 'react-native-vector-icons/AntDesign'
import { useLayoutEffect, useRef, useState } from "react"
import listFileModel from "../model/ListFileModel"
import CachedImage from 'expo-cached-image'
import downloadManagerModel from "../model/DownloadManagerModel"
import  InputDiaLog  from "./InputDialog"
import qrManagerModel from "../model/QrManagerModal"
import ShareCollectionModal from "./ShareCollectionModal"
import { QR_ACTION } from "../core/types"
import authModel from "../model/AuthModel"
import { useNavigation } from "@react-navigation/native"
const FocusToast = ({isShow,isBottomSheetShow})=>{
    const nav = useNavigation();
    const toastRef = useRef(null)
    const nativeBaseToast = useToast()
    const [dialogShow,setDialogShow] = useState(false)
    const [name,setName] = useState('')
    const qrCodeModalVisible = useSharedValue(false)
    const focusStyles = useAnimatedStyle(()=>{
        return {
            transform:[{scale:withTiming(isShow.value ?  1 : 0)}]
        }
    })

    const handleDeletedCollection = async()=>{
        const handleDelete = async()=>{
            let result = await listFileModel.onDeletedFile()
            if(result){
                Alert.alert('Thành Công','Đã xóa đống ảnh đó rồi nhé.')
                isShow.value = false
            }else{
                Alert.alert('Thông báo','Có chút lỗi xảy ra vui long thử lại sau!')
            }
        }

        Alert.alert("Xóa Album?","Bạn thực sự muốn xóa đống ảnh này?",[
            {text:'Xóa',style:'destructive',onPress:handleDelete},
            {text:'Không',style:'default',onPress:()=>{}}
        ])
    }

    const handleGetFileInfo = ()=>{
        isBottomSheetShow.value = true
    }

    const handleDownload = ()=>{
        Alert.alert('Tải về','Bạn thực sự muốn tải về',[
            {text:'Đúng',style:'default',onPress:downloadManagerModel.onSyncDownloadCollection},
            {text:'Không',style:'destructive',onPress:()=>{}}
        ])
    }
    const handleChangeName = ()=>{
        setName(listFileModel.holdFile.name)
        setDialogShow(true)
    }

    const handleCancelDialog = ()=>{setName('');setDialogShow(false)}
    const handleSuccessDialog = async()=>{
        if(name.trim() !== ""){
            await listFileModel.onChangeName(name,setName,setDialogShow)
        }
    }

    const handleOpenShareManager = ()=>{
        nav.navigate("share_manager",{collectionId:listFileModel.holdFile.id});
    }
    
    const handleGenerateShareQrCode = async()=>{
        await qrManagerModel.generateCode(QR_ACTION.JOIN_COLLECTION,{collectionId:listFileModel.holdFile.id,userId:authModel.user.id,rules:{read:true,write:false}})
    }
    const listToolTip = [
        {id:1,title:'Thông tin chi tiết',icon:'information-circle-outline',handlePress:handleGetFileInfo},
        {id:2,title:'Đổi tên',icon:'pencil-sharp',handlePress:handleChangeName},
        {id:3,title:'Chia sẻ',loader:true,icon:'open-outline',handlePress:handleGenerateShareQrCode},
        {id:6,title:'Quản lý chia sẻ',icon:'list-outline',handlePress:handleOpenShareManager},
        {id:4,title:'Xóa',color:'#ffaab6',icon:'trash-outline',deleted:true,handlePress:handleDeletedCollection},
        // {id:5,title:'Tải về',color:'#2eaaff',icon:'cloud-download-outline',downloadSync:true,handlePress:handleDownload},
        {id:7,title:'Đóng',color:'#ff6381',icon:'close-outline',handlePress:()=>{
            if(!listFileModel.renaming && !qrManagerModel.generating && !listFileModel.deletingHoldFile){
                listFileModel.setHoldFile(null)
                isShow.value = false;
            }
        }},
    ]
    
    const toolTipShow = useSharedValue(true)

    useLayoutEffect(()=>{},[listFileModel.holdFile])
    
    useLayoutEffect(()=>{
        
    },[downloadManagerModel.downloadTask])
    
    useLayoutEffect(()=>{
        const sync = async()=>{
            await downloadManagerModel.onDownloadTaskUpdate()
        }
        sync()
        nativeBaseToast.show({
            description:'Nếu ảnh không load được thì thử mở lại nhé.',
            duration:3000
        })
    },[])

    useLayoutEffect(()=>{
        if(qrManagerModel.qrCode !== ""){
            qrCodeModalVisible.value = true;
        }
    },[qrManagerModel.qrCode])

    return (
        <Animated.View 
            style={[focusStyles,{
                width:SC_W,
                height:SC_H,
                backgroundColor:'rgba(0,0,0,.9)',
                position:'absolute',
                left:-10,
                zIndex:20
            }]}
        >
            <ShareCollectionModal toast={nativeBaseToast} visible={qrCodeModalVisible}/>
            <InputDiaLog loading={listFileModel.renaming} text={name} setText={setName} visible={dialogShow} handleCancel={handleCancelDialog} handleSuccess={handleSuccessDialog}/>
            <Box width={SC_W} height={SC_H}>
                <Box width={SC_W / 2} height={SC_H / 2} alignSelf={'flex-start'} marginTop={21} marginLeft={21}>
                    {listFileModel.holdFile && 
                        <CachedImage
                            cacheKey={`${listFileModel.holdFile?.id}`}
                            placeholderContent={(
                                <Box height={Math.round(Math.random() * (200 - 160) + 160)}>
                                    <ActivityIndicator 
                                        color={
                                            'gray'
                                        }
                                        size="small"
                                        style={{
                                            flex: 1,
                                            justifyContent: "center",
                                        }}
                                    />
                                </Box>
                            )}
                            resizeMode={'cover'} source={{uri: listFileModel.holdFile?.firstImage}} alt={'images'} style={{
                            width: '100%', height: '100%',
                            backgroundColor: 'rgba(255,255,255,.6)',
                            borderRadius: 12
                        }}/>
                        // <Image alt={'image'} backgroundColor={'gray.200'}  borderRadius={8} width={'100%'} height={'100%'} resizeMode={'cover'} source={{uri:listFileModel.holdFile?.firstImage}}/>
                    }
                </Box>
                <ToolTip c_ref={toastRef}
                    c_style={{
                        backgroundColor:'rgba(255,255,255,.3)',
                        width:SC_W/2.3,
                        borderRadius:8,
                        position:'absolute',
                        right:(SC_W / 2) - SC_W / 2 + 10, // sc_w / 2 + element width / 2
                        bottom:90,
                    }}
                    isShow={toolTipShow}>
                    <VStack w={'100%'} py={1} justifyContent={'center'} alignItems={'center'} borderRadius={10}>
                        {listToolTip.map((val, index) => {
                            return (
                                <TouchableOpacity activeOpacity={.8} key={val.id.toString()} onPress={val?.handlePress} style={{width: SC_W / 2.3}}>
                                    <HStack
                                        py={2} w={'100%'} px={3}
                                        borderBottomWidth={index === listToolTip.length - 1 ? 0 : index === 0 || index === listToolTip.length - 2 ? 6 : .2}
                                        borderBottomColor={index === 0 || index === listToolTip.length - 2 ? 'black' : 'white'}
                                        alignItems={'center'}
                                        justifyContent={'space-between'}>
                                        <HStack
                                            alignItems={'center'}
                                            justifyContent={'space-between'} space={3}
                                        >
                                            {val?.ant ?
                                                <AntDesign name={val.icon} color={val?.color || 'white'} size={22}/>
                                                :
                                                val?.deleted ? 
                                                listFileModel.deletingHoldFile ? 
                                                <ActivityIndicator color={'white'} size={22}/>:
                                                <Ionicons name={val.icon} size={22} color={val?.color || 'white'}/>:
                                                <Ionicons name={val.icon} size={22} color={val?.color || 'white'}/>
                                            }
                                            <Text color={val?.color || 'white'}>{val.title}</Text>
                                        </HStack>
                                        {val?.loader && qrManagerModel.generating && <ActivityIndicator color={'gray'} size={22}/>}
                                    </HStack>
                                </TouchableOpacity>
                            )
                        })}
                    </VStack>
                </ToolTip>
            </Box>
           
        </Animated.View>
    )
}
export default observer(FocusToast)