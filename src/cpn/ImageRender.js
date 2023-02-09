import {TouchableOpacity} from "react-native";
import {Box,HStack,Text, VStack} from "native-base";
import {observer} from "mobx-react";
import {ActivityIndicator} from 'react-native'
import Ionicons from "react-native-vector-icons/Ionicons";
import CachedImage from 'expo-cached-image'
import collectionDetailModel from "../model/CollectionDetailModel";
import Animated, { useAnimatedGestureHandler, useAnimatedStyle, useSharedValue, withSpring, withTiming } from "react-native-reanimated";
import listFileModel from "../model/ListFileModel";
import { formatBytes, playingTappedSound } from "../core/helper";
import { FileDisplayMode } from "../core/types";
import { TapGestureHandler } from "react-native-gesture-handler";
import { Image } from "react-native";
import { useLayoutEffect, useState } from "react";

const ImageRender = ({type,focusToastShow,isCachedImage = true,index,file, columnsRan, isCollection, nav,showCollection}) => {
    const isHold = useSharedValue(false)
    const [selected,setSelected] = useState(false)
    const handleLongPress = async()=>{
        await playingTappedSound()
        if(focusToastShow){
            listFileModel.setHoldFile(file)
            focusToastShow.value = true
        }
    }
   

    const focusStyles = useAnimatedStyle(()=>{
        return {
            transform:[{scale:withSpring(isHold.value ? .9 : 1)}]
        }
    })

    const tapEvent = useAnimatedGestureHandler({
        onStart:()=>{
            isHold.value = true;
        },
        onFinish:()=>{
            isHold.value = false
        },
        onEnd:()=>{
            isHold.value  = false;
        }
        
    })
    const handleCollectionPress = ()=>{
        if(!listFileModel.selectAble){
            nav.navigate('collection-detail', {collectionId: file.id,isCachedImage:true})
        }
        //  selectable

        if(selected){
            listFileModel.removeSelectedFile(file.id)
            setSelected(false)
        }else{
            listFileModel.selectFile(file.id)
            setSelected(true)
        }
    }
  
    return (
        <>
            <Animated.View style={[{
                flex:1/ ((columnsRan || 3)),
                marginHorizontal:4,
                marginVertical:8,
                borderRadius: 12,
                overflow: 'hidden',
            }]}>
                {isCollection ?
                    <TouchableOpacity delayLongPress={300} onLongPress={handleLongPress} onPress={handleCollectionPress} style={{position: 'relative'}} activeOpacity={.9}>
                        <TapGestureHandler onGestureEvent={tapEvent}>

                            {type === FileDisplayMode.GRID ? 
                                <Animated.View style={[focusStyles]}>
                                    {listFileModel.selectAble && 
                                     <Box style={{
                                        top: 9,
                                        position: 'absolute',
                                        zIndex: 10,
                                        width: 26,
                                        height: 26,
                                        left: 10,
                                        backgroundColor:selected ? 'white':'black',
                                        borderRadius:6
                                        }}>
                                    </Box>
                                    }
                                   

                                    <Box style={{
                                        top: 9,
                                        position: 'absolute',
                                        zIndex: 10,
                                        width: 30,
                                        height: 30,
                                        right: 0
                                    }}>
                                        <Ionicons name={'copy-outline'} color={'white'} size={22}/>
                                    </Box>
                                    <CachedImage
                                        cacheKey={`${file.id}`}
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
                                        resizeMode={'cover'} source={{uri: file.firstImage}} alt={'images'} style={{
                                        width: '100%', height: 180,
                                        borderRadius: 12
                                    }}/>
                                    <Text numberOfLines={1} my={1} fontSize={12} fontWeight={'500'} color={'white'}>{file.name}</Text>
                                </Animated.View>
                                :
                                <Animated.View style={[focusStyles,{
                                    flexDirection:'row',
                                    justifyContent:'space-between',
                                    alignItems:'center',
                                    backgroundColor:'rgba(255,255,255,.1)',
                                    width:'100%',
                                    // transform:[{scaleX:1.1}]
                                }]}>
                                <CachedImage
                                    cacheKey={`${file.id}`}
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
                                    resizeMode={'cover'} source={{uri: file.firstImage}} alt={'images'} style={{
                                    width: 68, height: 80,
                                    backgroundColor: 'rgba(255,255,255,.6)',
                                    borderRadius: 4
                                }}/>
                                <HStack width={'76%'} height={'100%'}>
                                    <VStack width={'70%'} height={'100%'} justifyContent={'center'} alignItems={'flex-start'}>
                                        <Text numberOfLines={1} my={1} fontSize={14} fontWeight={'500'} color={'white'}>{file.name}</Text>
                                        <Text numberOfLines={1} my={1} fontSize={11} fontWeight={'500'} color={'gray.400'}>{new Date(file.updatedAt).toLocaleDateString()}</Text>
                                        <Text numberOfLines={1} my={1} fontSize={11} fontWeight={'500'} color={'gray.400'}>{isCollection ? 'Tập ảnh - ' : 'Ảnh' } { formatBytes(file.size)}</Text>
                                    </VStack>
                                    <VStack>

                                    </VStack>
                                </HStack>
                            </Animated.View>
                            }
                        </TapGestureHandler>
                    </TouchableOpacity>
                   
                    :
                    <TouchableOpacity onPress={()=>{
                        collectionDetailModel.setIndexShow(index)
                        showCollection.value = true
                    }}>
                        {isCachedImage ? 
                            <CachedImage
                                    cacheKey={`${file.id}-thumb`}
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
                                    resizeMode={'cover'} source={{uri: file.uri}} alt={'images'} style={{
                                    width: '100%', height: 180,
                                    backgroundColor: 'rgba(255,255,255,.6)',
                                    borderRadius: 12
                                }}/>
                                :
                                <Image source={{uri:file.uri}} alt={'image'} style={{
                                    width: '100%', height: 180,
                                    backgroundColor: 'rgba(255,255,255,.6)',
                                    borderRadius: 12
                                }}/>
                            }
                    </TouchableOpacity>
                }
            </Animated.View>
        </>
    )
}
export default observer(ImageRender)