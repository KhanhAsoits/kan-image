import {View, Image, Text} from "native-base";
import {TouchableOpacity} from "react-native";
import EntypoIcon from "react-native-vector-icons/Entypo";
import {SC_W} from "../core/helper";

export const PickerAlbum = (props) => {
    return (
        <TouchableOpacity
            activeOpacity={.9}
            onPress={() => props.goToGallery(props.album)}
            style={{width: (SC_W - 22) / 2, height: 250, margin: 22 / 4, borderRadius: 16}}
        >
            <Image
                alt={'images'}
                source={{uri: props.thumb.uri}}
                style={{width: '100%', height: '100%', borderRadius: 16}}
            ></Image>
            <View
                style={{
                    position: 'absolute',
                    width: '100%',
                    height: '100%',
                    backgroundColor: 'rgba(0,0,0,0.1)',
                    justifyContent: 'flex-end',
                }}
            >
                <View style={{paddingLeft: 10, paddingBottom: 5, flexDirection: 'row'}}>
                    <EntypoIcon name='folder' color='white' size={16}/>
                    <Text
                        style={{
                            color: 'white',
                            fontSize: 16,
                            marginLeft: 5,
                        }}
                    >
                        {props.album.title}
                    </Text>
                </View>
            </View>
        </TouchableOpacity>
    )
}