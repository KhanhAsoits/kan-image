import {View} from "native-base";
import FeatherIcon from "react-native-vector-icons/Feather";

export const PickerCheck = () => {
    return (
        <View
            style={{
                width: '100%',
                height: '100%',
                alignItems: 'center',
                justifyContent: 'center',
                backgroundColor: 'rgba(0,0,0,0.4)',
            }}
        >
            <FeatherIcon color='white' name='check' size={32}/>
        </View>
    )
}