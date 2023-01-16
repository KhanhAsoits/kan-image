import {View, Text} from "native-base";
import {Platform, TouchableOpacity} from "react-native";
import Ionicons from "react-native-vector-icons/Ionicons";

export const PickerHeader = (props) => {
    return (
        <View
            style={{
                height: 80,
                width: '100%',
                flexDirection: 'row',
                justifyContent: 'space-between',
                alignItems: 'center',
            }}
        >
            {props.view === 'album' && (
                <View style={{
                    marginTop: 16,
                    width: '100%',
                    paddingHorizontal: 11,
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: 'space-between'
                }}>
                    <Text style={{width: '20%'}}></Text>
                    <Text style={{fontSize: 20, width: '60%', color: 'white', textAlign: 'center'}}>
                        Select an album
                    </Text>
                    {Platform.OS === 'ios' ?
                        <TouchableOpacity onPress={() => {
                            props.setAssets([])
                            props.isOpen.value = false
                            console.log('User cancel')
                        }} style={{width: '20%'}} activeOpacity={.9}>
                            <Text style={{color: 'white', textAlign: 'right'}}>Hủy</Text>
                        </TouchableOpacity>
                        :
                        <TouchableOpacity style={{width: '20%'}} activeOpacity={.9}>
                        </TouchableOpacity>
                    }
                </View>
            )}
            {props.view === 'gallery' && (
                <View style={{
                    marginTop: 16,
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    flexDirection: 'row',
                    width: '100%',
                    paddingHorizontal: 12
                }}>
                    <TouchableOpacity activeOpacity={.9} onPress={props.goToAlbum}>
                        <Ionicons name='arrow-back' size={30} color='#EDF8F5'/>
                    </TouchableOpacity>
                    {props.imagesPicked > 0 && (
                        <>
                            <Text style={{color: 'white', fontSize: 20}}>
                                {props.imagesPicked} selected
                            </Text>
                            <TouchableOpacity activeOpacity={.9} onPress={props.save}>
                                <Text style={{color: 'white', fontSize: 16}}>OK</Text>
                            </TouchableOpacity>
                        </>
                    )}
                </View>
            )}
        </View>
    )
}