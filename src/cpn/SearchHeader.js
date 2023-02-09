import {observer} from "mobx-react";
import {Box, HStack, VStack, Text} from "native-base";
import {TextInput, Keyboard} from "react-native";
import {styles} from "../core/styles";
import Ionicons from "react-native-vector-icons/Ionicons";
import {TapGestureHandler, TouchableOpacity} from "react-native-gesture-handler";
import HeaderSearchModel from "../model/HeaderSearchModel";
import {useLayoutEffect, useState} from "react";
import Animated, {
    useAnimatedGestureHandler,
    useAnimatedStyle,
    useSharedValue,
    withTiming
} from "react-native-reanimated";
import AntDesign from "react-native-vector-icons/AntDesign";
import {SC_W} from "../core/helper";
import {ToolTip} from "./ToolTip";
import {useNavigation} from "@react-navigation/native";
import downloadManagerModel from "../model/DownloadManagerModel";
import listFileModel from "../model/ListFileModel";
import AsyncStorage from "@react-native-async-storage/async-storage";
import authModel from "../model/AuthModel";

const SearchHeader = ({title, showMini,layoutConfig}) => {

    const nav = useNavigation()
    const showOption = useSharedValue(false)

    const toUploadScreenHandle = () => {
        nav.navigate('upload')
    }
    const handleChangeLayoutMode = (mode)=>{
        if(mode!==listFileModel.layoutConfig){
            listFileModel.setLayoutConfig(mode)
        }
    }
    const handleSelectAbleFile = ()=>{
        listFileModel.setSelectAble(!listFileModel.selectAble)
    }
   
    const toolTipsItem = [
        {
            id: 1,
            title: 'Thêm album mới',
            icon: 'copy-outline',
            size: '22',
            color: 'white',
            handle: toUploadScreenHandle
        },
        
        
        {id: 2, title: 'Chọn', select:true,icon: 'checkmark-done-outline', size: '22', color: 'white',handle:handleSelectAbleFile},
        {id: 3, title: 'Biểu tượng',layout:2, icon: 'appstore-o', size: '22', color: 'white', ant: true,handle:handleChangeLayoutMode},
        {id: 4, title: 'Danh sách', layout:1,icon: 'list-outline', size: '22', color: 'white',handle:handleChangeLayoutMode},
        {id: 5, title: 'Sắp xếp', icon: 'funnel-outline', size: '22', color: 'white'},
        {id: 6, title: 'Chia sẻ với tôi', icon: 'share-outline', size: '22',download:true, color: 'white',handle:()=>{nav.navigate('shared')}},
        {id: 7, title: 'Thông báo', icon: 'notifications-outline', size: '22',download:true, color: 'white',handle:()=>{nav.navigate('download')}},
        {id: 8, title: 'Quét mã', icon: 'scan', size: '22', color: 'white',handle:()=>{nav.navigate('scanner')}},
        {id: 9, title: 'Đăng xuất', icon: 'log-out-outline', size: '22', color: 'red',handle:authModel.onLogout},
        
    ]
    const handleClearQuery = () => {
        HeaderSearchModel.setQuery('')
    }
    useLayoutEffect(() => {
        const keyboardShow = Keyboard.addListener('keyboardWillShow', (e) => {
            titleShow.value = true
        })
        const keyboardHide = Keyboard.addListener('keyboardWillHide', (e) => {
            titleShow.value = false
        })
        return () => {
            keyboardShow.remove()
            keyboardHide.remove()
        }
    }, [])
    // layout animate
    const titleShow = useSharedValue(false)
    const inputStyle = useAnimatedStyle(() => {
        return {
            width: withTiming(titleShow.value ? '88%' : '100%', {duration: 150}),
        }
    })
    const titleHideStyles = useAnimatedStyle(() => {
        if (showMini.value === false) {
            return {
                marginVertical: withTiming(titleShow.value ? 0 : 12, {duration: 150}),
                height: withTiming(titleShow.value ? 0 : 40, {duration: 100}),
            }
        } else {
            return {}
        }

    })
    const optionBtnStyle = useAnimatedStyle(() => {
        return {
            height: withTiming(titleShow.value ? 0 : 40, {duration: 100}),
        }
    })
    const cancelBtnStyles = useAnimatedStyle(() => {
        return {
            opacity: titleShow.value ? withTiming(1, {duration: 300}) : 0,
            width: withTiming(titleShow.value ? '10%' : 0, {duration: 100})
        }
    })
    const cancelSearch = useAnimatedGestureHandler({
        onStart: () => {
            titleShow.value = false
        }
    })
    const showMiniStyle = useAnimatedStyle(() => {
        return {
            position: withTiming(showMini.value ? 'absolute' : 'relative'),
        }
    })
    const titleHideMiniStyle = useAnimatedStyle(() => {
        return {
            marginVertical: withTiming(showMini.value ? 0 : 12, {duration: 150}),
            height: withTiming(showMini.value ? 0 : 40, {duration: 100}),
        }
    })


    return (
        <Animated.View style={[showMiniStyle, {
            paddingVertical: 8,
            top: 0,
            zIndex: 10,
            justifyContent: 'center',
            alignItems: 'center',
            width: SC_W - 30,
            alignSelf: 'center',
        }]}>
            <Animated.View style={{
                flexDirection: 'row',
                width: '100%',
                justifyContent: 'space-between',
                alignItems: 'center'
            }}>
                <Animated.Text
                    style={[titleHideStyles, titleHideMiniStyle, {
                        color: 'white',
                        fontSize: 36,
                        fontWeight: '600',
                        width: '90%'
                    }]}>{title}</Animated.Text>
                <Animated.View style={[optionBtnStyle, {
                    justifyContent: 'flex-start',
                    flexDirection: 'row',
                    alignItems: 'center',
                }]}>
                    <TouchableOpacity onPress={() => {
                        showOption.value = !showOption.value
                    }} activeOpacity={1}>
                        {downloadManagerModel.downloadTask.length > 0 &&  
                        <Box position={'absolute'} w={3} h={3} bgColor={'red.500'} right={-3} top={-3} zIndex={100} borderRadius={100}></Box>
                        }
                        <AntDesign name={'appstore-o'} color={'#4D53FE'} size={22}/>
                    </TouchableOpacity>
                    <ToolTip bg={'rgba(100,100,100,.9)'} isShow={showOption}>
                        <VStack w={'100%'} py={1} justifyContent={'center'} alignItems={'center'} borderRadius={10}>
                            {toolTipsItem.map((val, index) => {
                                return (
                                    <TouchableOpacity key={val.id.toString()} onPress={val?.layout ? ()=>{
                                        val.handle(val.layout)
                                    } : val?.handle} style={{width: SC_W / 2.5}} activeOpacity={.1}>
                                        <HStack  w={'100%'} justifyContent={'space-between'} alignItems={'center'}>
                                            <HStack
                                                py={2} px={3}
                                                borderBottomWidth={index === toolTipsItem.length - 1 ? 0 : index === 0 || index === toolTipsItem.length - 2 ? 6 : .2}
                                                borderBottomColor={index === 0 || index === toolTipsItem.length - 2 ? 'black' : (val?.select && listFileModel.selectAble) ? '#77b6ff' :  'white'}
                                                alignItems={'center'}
                                                w={'100%'}
                                                justifyContent={'flex-start'} space={3}>
                                                {val?.ant ?
                                                    <AntDesign name={val.icon} color={val.select && listFileModel.selectAble ? '#77b6ff' : 'white'} size={22}/>
                                                    :
                                                    <Ionicons name={val.icon} size={22} color={val?.select && listFileModel.selectAble ? '#77b6ff' : 'white'}/>
                                                }
                                                <Text color={val.select && listFileModel.selectAble ? '#77b6ff' : 'white'}>{val.title}</Text>
                                                {/* { &&  <Ionicons name={'checkmark-outline'} color={'white'} size={22}/>} */}
                                                {val?.layout && listFileModel.layoutConfig === val.layout && <Ionicons name={'checkmark-outline'} color={'white'} size={22}/>}
                                            </HStack>
                                            {val?.download  && downloadManagerModel.downloadTask.length > 0 &&
                                            <Box w={6} mr={2} h={6} justifyContent={'center'} alignItems={'center'} bgColor={'red.400'} borderRadius={100}>
                                                <Text textAlign={'center'} color={'white'}>{downloadManagerModel.downloadTask.length}</Text>
                                            </Box>
                                            }
                                        </HStack>
                                    </TouchableOpacity>
                                )
                            })}
                        </VStack>
                    </ToolTip>
                </Animated.View>
            </Animated.View>
            <Box justifyContent={'space-between'} alignItems={'center'} flexDir={'row'}>
                <Animated.View style={[styles.searchHeaderInputContainer, inputStyle]}>
                    <TouchableOpacity activeOpacity={1}>
                        <Ionicons name={'search'} color={styles.icon_white_300} size={24}/>
                    </TouchableOpacity>
                    <TextInput
                        value={HeaderSearchModel.query}
                        onChangeText={text => {
                            HeaderSearchModel.setQuery(text)
                        }}
                        placeholder={'Tìm Kiếm'}
                        placeholderTextColor={'rgba(255,255,255,.6)'}
                        style={[styles.searchHeaderInput, {width: HeaderSearchModel.query !== "" ? '86%' : '92%'}]}
                    />
                    {HeaderSearchModel.query !== "" &&
                        <TouchableOpacity activeOpacity={1} onPress={handleClearQuery}>
                            <Ionicons name={'close-circle'} color={styles.icon_white_300} size={18}/>
                        </TouchableOpacity>
                    }
                </Animated.View>
                <TapGestureHandler onGestureEvent={cancelSearch}>
                    <Animated.Text
                        style={[cancelBtnStyles, {
                            color: '#4D53FE',
                            fontSize: 16,
                            textAlign: 'center'
                        }]}>Hủy</Animated.Text>
                </TapGestureHandler>
            </Box>
        </Animated.View>
    )
}
export default observer(SearchHeader)