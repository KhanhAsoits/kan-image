import {TapGestureHandler, TouchableOpacity} from "react-native-gesture-handler";
import {Box} from "native-base";
import Animated, {
    useAnimatedGestureHandler,
    useAnimatedStyle,
    useSharedValue,
    withTiming
} from "react-native-reanimated";
import {faker} from "@faker-js/faker";
import {observer} from "mobx-react";
import {ActivityIndicator, Image} from 'react-native'
import Ionicons from "react-native-vector-icons/Ionicons";
import CachedImage from 'expo-cached-image'

const ImageRender = ({file, columnsRan, isCollection, nav}) => {
    const imageTapped = useSharedValue(false)
    const handleTappedEvent = useAnimatedGestureHandler({
        onStart: () => {
            imageTapped.value = true
        },
        onFinish:()=>{
            imageTapped.value = false
        },
        onEnd: () => {
            imageTapped.value = false
        }
    })
    const imageTappedStyles = useAnimatedStyle(() => {
        return {
            transform: [{scale: withTiming(imageTapped.value ? 1.2 : 1)}]
        }
    })
    return (
        <Box zIndex={1} style={{borderRadius: 12, overflow: 'hidden'}}
             flex={1 / ((columnsRan || 3))} mx={1} my={2}>
            {isCollection ?
                <TouchableOpacity onPress={() => {
                    nav.navigate('collection-detail', {collectionId: file.id})
                }} style={{position: 'relative'}} activeOpacity={.9}>
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
                                <ActivityIndicator // can be any react-native tag
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
                        backgroundColor: 'rgba(255,255,255,.6)',
                        borderRadius: 12
                    }}/>
                </TouchableOpacity>
                :
                <TapGestureHandler onGestureEvent={handleTappedEvent}>
                    <Animated.Image source={{uri: file.uri}} alt={'images'} style={[imageTappedStyles, {
                        width: '100%', height: 180,
                        backgroundColor: 'rgba(255,255,255,.8)',
                        borderRadius: 12
                    }]}/>
                </TapGestureHandler>
            }
        </Box>
    )
}
export default observer(ImageRender)