import { Box, Text} from "native-base"
import { useLayoutEffect } from "react"
import { TouchableOpacity } from "react-native-gesture-handler"
import Animated, { Keyframe, useAnimatedStyle, useSharedValue, withRepeat, withSpring, withTiming } from "react-native-reanimated"
import { SC_H, SC_W } from "../core/helper"

export const ScannerView = ({width,height})=>{
    const scannerLine = useSharedValue(6)
    const scannerLineStyles = useAnimatedStyle(()=>{
        return  {
            height:`${scannerLine.value}%`,
        }
    })
    useLayoutEffect(()=>{
        scannerLine.value = withRepeat(withTiming(98,{duration:2000}),0,false)
    },[])
    
    return (
        <Animated.View 
            style={{
                width:SC_W,
                height:SC_H,
                position:'absolute',
                borderColor:'rgba(0,0,0,0.6)',
                borderTopWidth:SC_H / 3,
                borderBottomWidth:SC_H / 3,
                borderLeftWidth:SC_W / 5,
                borderRightWidth:SC_W /  5,
                zIndex:50,
            }}>
                <TouchableOpacity activeOpacity={1} style={{
                    position:'absolute',
                    top:-SC_H / 9,
                    width:SC_W,
                    left:-SC_W / 5
                }}>
                    <Text fontSize={18}  textAlign={'center'} fontWeight={'500'} color={'white'}>Di chuyển camera đến mã QR để quét</Text>
                </TouchableOpacity>
                <Box position={'absolute'} borderWidth={1} transform={[{scale:1.05}]} borderColor={'white'} width={'100%'} height={'100%'}>
                    <Animated.View style={[scannerLineStyles,{
                        width:'96%',
                        alignSelf:'center',
                        backgroundColor:'transparent',
                        borderBottomWidth:3,
                        borderBottomColor:'white',
                        borderRadius:1
                    }]}></Animated.View>
                </Box>
        </Animated.View>
    )
}