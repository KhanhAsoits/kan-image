import { Box ,Text} from "native-base";
import { TouchableOpacity } from "react-native";
import Animated, { useAnimatedStyle, withSpring } from "react-native-reanimated";
import { SC_H, SC_W } from "../core/helper";
import Ionicons from 'react-native-vector-icons/Ionicons'

export const Modal = (props)=>{
    const visible = props.visible;
    const visibleStyles = useAnimatedStyle(()=>{
        return {
            transform:[{scale:withSpring(visible?.value ? 1 : 0)}]
        }
    })
    return (
            <Animated.View style={[visibleStyles,{
                backgroundColor:'rgba(255,255,255,0.06)',
                justifyContent:'center',
                alignItems:'center',
                position:'absolute',
                width:SC_W,
                height:SC_H,
                top:0,
                left:0,
                zIndex:50
            }]}>
                <TouchableOpacity onPress={()=>{visible.value = false}} style={{
                    position:'absolute',
                    zIndex:100,
                    backgroundColor:'black',
                    width:30,
                    top:10,
                    right:10,
                    height:30
                }}>
                    <Ionicons name={'close'} size={30} color={'white'}/>
                </TouchableOpacity>
                <Animated.View
                    style={[{
                            backgroundColor:props.bg,
                            width:props?.w || SC_W - 100,
                            alignSelf:'center',
                            height:props?.h || SC_H  / 1.5,
                            position:'absolute',
                            zIndex:100,
                            borderRadius:12
                    }]}>
                    {props.children}
                </Animated.View>
            </Animated.View>
    )
}