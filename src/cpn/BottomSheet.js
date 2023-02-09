import { observer } from "mobx-react"
import Animated, { useAnimatedStyle, withSpring, withTiming } from "react-native-reanimated"
import { SC_H, SC_W } from "../core/helper"

const BottomSheet = (props)=>{
    const headerHeight  = 100;
    const isShow = props.isShow
    const bottomSheetShowStyle = useAnimatedStyle(()=>{
        return {
            height:withSpring(isShow.value ? SC_H - headerHeight : 0),
            opacity:withTiming(isShow.value ? 1 : 0,{duration:300})
        }
    })
    return (
        <Animated.View style={[bottomSheetShowStyle,{
            zIndex:100,
            width:SC_W,
            position:'absolute',
            bottom:0,
            borderTopLeftRadius:12,
            borderTopRightRadius:12,
            left:-7,
            backgroundColor:props?.bg || 'gray'
        }]}>
            {props.children}
        </Animated.View>
    )
}
export default observer(BottomSheet)