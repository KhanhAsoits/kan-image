import {Box, FlatList, HStack} from 'native-base'
import {observer} from 'mobx-react'
import { SC_H, SC_W } from "../core/helper"
import collectionDetailModel from "../model/CollectionDetailModel"
import { useLayoutEffect, useMemo, useRef } from "react"
import { PinchGestureHandler, State, TouchableOpacity } from 'react-native-gesture-handler'
import IonIcon from 'react-native-vector-icons/Ionicons'
import Animated, { useAnimatedGestureHandler, useAnimatedStyle, useSharedValue, withSpring, withTiming } from 'react-native-reanimated'
const CollectionView = ({isShow})=>{
    const flatListRef = useRef(null)
    useLayoutEffect(()=>{
        if(collectionDetailModel.indexShow >= 1)
        {
            flatListRef.current &&
            flatListRef.current.scrollToIndex({
                index:collectionDetailModel.indexShow
            })
        }
    },[collectionDetailModel.indexShow])
    const pinched = useSharedValue(1)
    const lastScale = useSharedValue(1)
    const scaleStyle = useAnimatedStyle(()=>{
        return {
            transform:[{scale:withSpring(pinched.value)}]
        }
    })
    const pinchHandler = useAnimatedGestureHandler({
        onActive:(e,ctx)=>{
            pinched.value = e.scale
        },
    })
    const onStateChange = (e)=>{
        if(e.nativeEvent.oldState === State.ACTIVE){
            lastScale.value = e.nativeEvent.scale
        }
        if(e.nativeEvent.state === State.BEGAN){
            pinched.value = lastScale.value
        }
    }
    const displayStyle = useAnimatedStyle(()=>{
        return  {
            transform:[{scale:withTiming(isShow.value ? 1 : 0)}]
        }
    })

    const renderItem = ({item:image,index})=>{
        return (
            <Box overflow={'hidden'} width={SC_W} position={'relative'} height={SC_H} justifyContent={'center'} alignItems={'center'}>
                <PinchGestureHandler onHandlerStateChange={onStateChange} onGestureEvent={pinchHandler}>
                    <Animated.Image style={[{
                            resizeMode:'contain',
                            alignSelf:'center',
                            borderRadius:20,
                            width:SC_W - 100,
                            height:SC_H - 100,
                    },scaleStyle]}  source={{uri:image.uri}} />
                </PinchGestureHandler>
            </Box>
        )
    }

    // get current item

    const scrollToEnd = (e)=>{
        let pageNumber = Math.min(Math.max(Math.floor(e.nativeEvent.contentOffset.x / SC_W + 0.5) + 1, 0), collectionDetailModel.listImage.length);
        collectionDetailModel.setIndexShow(pageNumber - 1)
    }

    const renderItemMemo = useMemo(()=>renderItem,[collectionDetailModel.listImage])

    return (
        <Animated.View
            style={[displayStyle,{
                position:'absolute',
                width:SC_W,
                height:SC_H,
                top:0,
                left:0,
                zIndex:10,
                backgroundColor:'rgba(0,0,0,0.8)'
            }]}
        >
            <HStack position={'absolute'} width={SC_W} height={10} zIndex={10} justifyContent={'flex-end'} alignItems={'center'} p={2}>
                <TouchableOpacity onPress={()=>{
                    isShow.value = false
                }}>
                    <IonIcon name={'close'} size={30} color={'white'}/>
                </TouchableOpacity>
            </HStack>
            <FlatList 
                ref={flatListRef}
                getItemLayout={(item,index)=>({
                    length:SC_W,
                    offset:SC_W * index,
                    index
                })}
                data={collectionDetailModel.listImage}
                keyExtractor={(item)=>item?.id}
                pagingEnabled={true}
                onMomentumScrollEnd={scrollToEnd}
                renderItem={renderItemMemo}
                horizontal={true}
                showsHorizontalScrollIndicator={false}
            />
        </Animated.View>
    )
}
export default observer(CollectionView)