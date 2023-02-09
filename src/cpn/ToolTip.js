import Animated, {useAnimatedStyle, withSpring, withTiming} from 'react-native-reanimated'
import {SC_H, SC_W} from "../core/helper";
import {ImageBackground} from "react-native";

export const ToolTip = (props) => {

    const showStyles = useAnimatedStyle(() => {
        return {
            opacity: withTiming(props.isShow.value ? 1 : 0),
            transform: [{scale: withSpring(props.isShow.value ? 1 : 0)}]
        }
    })

    return (
        <Animated.View
            ref={props.c_ref}
            style={[showStyles,props.c_style ? {...props.c_style} : {
                width: SC_W / 2.5,
                position: 'absolute',
                zIndex: 50,
                minHeight: 50,
                top: 33,
                borderRadius: 10,
                borderTopRightRadius: 0,
                right: 25,
                backgroundColor: props.bg
            }]}
        >
            <ImageBackground source={null} blurRadius={9}>
                {props.children}
            </ImageBackground>
        </Animated.View>
    )
}