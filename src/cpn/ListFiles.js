import {observer} from "mobx-react";
import {Box, FlatList, HStack, Text, useToast, VStack} from "native-base";
import {useLayoutEffect, useMemo} from "react";
import ImageRender from "./ImageRender";
import SearchHeader from "./SearchHeader";
import {useSharedValue} from "react-native-reanimated";
import ListFileModel from "../model/ListFileModel";
import {useNavigation} from "@react-navigation/native";
import searchHeaderModel from "../model/HeaderSearchModel";
import listFileModel from "../model/ListFileModel";
import FocusToast from "./FocusToast";
import Ionicons from 'react-native-vector-icons/Ionicons'
import { TouchableOpacity, Vibration } from "react-native";
import { playingTappedSound, SC_H, SC_W } from "../core/helper";
import SyncSuggestToast from "./SyncSuggestToast";
import realtimeListenerModel from "../model/RealTimeListenderModel";
import FocusBottomSheet from "./FocusBottomSheet";
import DownloadToast from "./DonwloadToast";
import downloadManagerModel from "../model/DownloadManagerModel";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { FileDisplayMode } from "../core/types";
import { ActivityIndicator } from "react-native";

const ListFiles = ({isCollection}) => {
    const showMiniHeader = useSharedValue(false)
    const columnsRan = 3
    const focusToastShow = useSharedValue(false)
    const focusBottomSheetShow = useSharedValue(false)
    const layoutConfig = useSharedValue(FileDisplayMode.GRID)
    const nav = useNavigation()
    const renderGridFile = ({item: file, index}) => {
        return <ImageRender type={FileDisplayMode.GRID} focusToastShow={focusToastShow} isCollection={isCollection} nav={nav} file={file} columnsRan={columnsRan}/>
    }
    const renderListFile = ({item:file,index})=>{
        return <ImageRender type={FileDisplayMode.LIST} focusToastShow={focusToastShow} isCollection={isCollection} nav={nav} file={file} columnsRan={columnsRan}/>
    }

    const renderGridFilesMemo = useMemo(() => renderGridFile, [ListFileModel.files])
    const renderListFileMemo = useMemo(()=>renderListFile,[listFileModel.files])

    useLayoutEffect(()=>{
        searchHeaderModel.setResult(listFileModel.files)
    },[listFileModel.files])


    useLayoutEffect(()=>{

    },[listFileModel.selectAble])

    // listen realtime change
    useLayoutEffect(()=>{
        const sync = async()=>{
            await ListFileModel.onChildUpdate()
        } 
        sync()
    },[])

    useLayoutEffect(()=>{
        // load layout
        const getSyncLayout = async()=>{
            const layoutConfigs = await AsyncStorage.getItem('@layout_config')
            console.log(listFileModel.layoutConfig)
            if(layoutConfigs){
                listFileModel.setLayoutConfig(layoutConfig)
            }
        }
        getSyncLayout()
    },[])

    useLayoutEffect(()=>{
        searchHeaderModel.search()
    },[searchHeaderModel.query])

    useLayoutEffect(()=>{
        // download 
        downloadManagerModel.onSyncDownload()
    },[downloadManagerModel.downloadingTask])

    const nativeBaseToast = useToast()
    // data 
    const longPressHandle = async(desc)=>{
        nativeBaseToast.show({
            description:desc,
            placement:'top',
            duration:2000
        })
    }
    const listToolWhenSelectData = [
        {id:1,icon:'pencil',color:'white',handle:()=>{},desc:'Đổi tên tất cả các file đã chọn.'},
        {id:2,icon:'trash-outline',color:'#ff7a90',handle:()=>{},desc:'Xóa tất cả các file đã chọn.'},
        {id:3,icon:'information-circle-outline',color:'#5ad2ff',handle:()=>{},desc:'Thông tin chi tiết tất cả các file đã chọn.'},
        {id:4,icon:'share-outline',color:'white',handle:()=>{},desc:'Xóa chia sẻ tất cả các file đã chọn.'}
    ]
    return (
        <Box flex={1} bgColor={'black'} px={2}>
            <SyncSuggestToast handleSync={listFileModel.syncUpdate} syncNotificationModel={'ảnh'} remainSecond={5} isShow={realtimeListenerModel.collectionSync} setShow={realtimeListenerModel.setCollectionSync}/>
            <FocusToast isBottomSheetShow={focusBottomSheetShow} isShow={focusToastShow}/>
            <FocusBottomSheet isShow={focusBottomSheetShow}/>
            {downloadManagerModel.downloadSync  && <DownloadToast/>}

            {listFileModel.selectAble && 
                <Text position={'absolute'} bottom={160} fontSize={12} width={SC_W} textAlign={'center'} color={'gray.400'}>Giữ vào biểu tượng để biết tác dụng của nó.</Text>
            }
            {listFileModel.selectAble && 
                <HStack borderRadius={8} justifyContent={'space-between'} alignItems={'center'} zIndex={10} position={'absolute'} bottom={100} left={SC_W / 2 - ((SC_W - 200) / 2)} width={SC_W - 200} py={3} bgColor={'gray.800'}>
                    {listToolWhenSelectData.map((val,index)=>{
                        return (
                            <TouchableOpacity key={index.toString()} onPress={val.handle} onLongPress={async()=>{await longPressHandle(val.desc)}} delayLongPress={300}>
                                <VStack space={2} px={3} justifyContent={'center'} alignItems={'center'}>
                                    <Ionicons name={val.icon} color={val.color} size={26}/>
                                </VStack>
                            </TouchableOpacity>
                        )
                    })}
                </HStack>
            
            }
            <SearchHeader title={'Ảnh'} showMini={showMiniHeader}/>
            {listFileModel.files.filter((val)=>val.state).length === 0 ?
                    <Box w={'100%'} height={'100%'} justifyContent={'flex-start'} alignItems={'center'}>
                        <Text color={'gray.400'} fontWeight={'500'} mt={5}>Có một vài thứ ở thùng rác đó.</Text>
                        <Box justifyContent={'center'} alignItems={'center'} w={SC_W/1.5} h={SC_H/2} borderRadius={20} mt={20} borderColor={'gray.600'} borderStyle={'dashed'} borderWidth={2}>
                            <TouchableOpacity>
                                <Ionicons name="trash-outline" color={'rgba(255,255,255,.4)'} size={120}/>
                            </TouchableOpacity>
                        </Box>
                    </Box>
                    :
                    searchHeaderModel.loading ? 
                    <Box flex={.7} justifyContent={'center'} alignItems={'center'}>
                        <ActivityIndicator color={'gray'} size={22}/>
                    </Box>
                    :
                    <FlatList
                        onScroll={(e) => {
                            if (e.nativeEvent.contentOffset.y >= 200) {
                                if (showMiniHeader.value === false) {
                                    showMiniHeader.value = true
                                }
                            } else {
                                if (showMiniHeader.value === true) {
                                    showMiniHeader.value = false
                                }
                            }
                        }}
                        _contentContainerStyle={{paddingBottom:6}}
                        key={listFileModel.layoutConfig === FileDisplayMode.GRID ? 3 : 1}
                        ListHeaderComponentStyle={{marginVertical: 12}}
                        data={searchHeaderModel.result.filter((val)=>val.state)}
                        numColumns={listFileModel.layoutConfig === FileDisplayMode.GRID ? 3 : 1}
                        renderItem={listFileModel.layoutConfig === FileDisplayMode.GRID ? renderGridFilesMemo : renderListFileMemo}
                        keyExtractor={item => item?.id}
                    /> 
            }
        </Box>
    )
}
export default observer(ListFiles)