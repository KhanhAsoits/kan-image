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

const SearchHeader = ({title, showMini}) => {

    const showOption = useSharedValue(false)

    const toolTipsItem = [
        {id: 1, title: 'Thêm album mới', icon: 'copy-outline', size: '22', color: 'white'},
        {id: 2, title: 'Chọn', icon: 'checkmark-done-outline', size: '22', color: 'white'},
        {id: 3, title: 'Biểu tượng', icon: 'appstore-o', size: '22', color: 'white', ant: true},
        {id: 4, title: 'Danh sách', icon: 'list-outline', size: '22', color: 'white'},
        {id: 5, title: 'Sắp xếp', icon: 'funnel-outline', size: '22', color: 'white'},
        {id: 6, title: 'Tải về', icon: 'arrow-down-circle-outline', size: '22', color: 'white'},
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
                    justifyContent: 'center',
                    flexDirection: 'row',
                    alignItems: 'center'
                }]}>
                    <TouchableOpacity onPress={() => {
                        showOption.value = !showOption.value
                        console.log(showOption.value)
                    }} activeOpacity={1}>
                        <AntDesign name={'appstore-o'} color={'#4D53FE'} size={22}/>
                    </TouchableOpacity>
                    <ToolTip bg={'rgba(255,250,250,.3)'} isShow={showOption}>
                        <VStack w={'100%'} py={1} justifyContent={'center'} alignItems={'center'} borderRadius={10}>
                            {toolTipsItem.map((val, index) => {
                                return (
                                    <TouchableOpacity style={{width: SC_W / 2.5}} activeOpacity={.1}>
                                        <HStack
                                            py={2} w={'100%'} px={3}
                                            borderBottomWidth={index === toolTipsItem.length - 1 ? 0 : index === 0 || index === toolTipsItem.length - 2 ? 6 : .2}
                                            borderBottomColor={index === 0 || index === toolTipsItem.length - 2 ? 'black' : 'white'}
                                            alignItems={'center'}
                                            justifyContent={'flex-start'} space={3}>
                                            {val?.ant ?
                                                <AntDesign name={val.icon} color={'white'} size={22}/>
                                                :
                                                <Ionicons name={val.icon} size={22} color={'white'}/>
                                            }
                                            <Text color={'white'}>{val.title}</Text>
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