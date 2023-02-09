import Animated, {useAnimatedStyle, withSpring, withTiming} from "react-native-reanimated";
import {StyleSheet} from "react-native";
import {SC_H, SC_W} from "../core/helper";
import {ImagePicker} from "expo-image-multiple-picker";
import {PickerHeader} from "./PickerHeader";
import {PickerAlbum} from "./PickerAlbum";
import {PickerCheck} from "./PickerCheck";

export const ImagePickerCustom = ({setAssets, isOpen}) => {
    const openStyles = useAnimatedStyle(() => {
        return {
            bottom: withSpring(isOpen.value ? 0 : -(SC_H + 200), {damping: 12, mass: 1})
        }
    })

    return (
        <Animated.View style={[openStyles, styles.container]}>
            <ImagePicker
                theme={{
                    header: (props) => <PickerHeader setAssets={setAssets} isOpen={isOpen} {...props}/>,
                    album: PickerAlbum,
                    check: PickerCheck
                }}
                onSave={(assets) => {
                    console.log(assets)
                    setAssets(assets)
                    isOpen.value = false
                }}
                onCancel={() => {
                    setAssets([])
                    isOpen.value = false
                    console.log('user cancel')
                }}
                galleryColumns={3}
                albumColumns={2}
                multiple={true}
                timeSlider
            />
        </Animated.View>
    )
}
const styles = StyleSheet.create({
    container: {
        width: SC_W,
        height: SC_H,
        backgroundColor: 'black',
        position: 'absolute',
    }
})