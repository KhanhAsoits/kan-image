import { Box } from "native-base"
import { observer } from "mobx-react"
import Ionicons from 'react-native-vector-icons/Ionicons'
import { TouchableOpacity } from "react-native"
import { SC_H } from "../core/helper"
const DownloadToast = ()=>{
    return (
        <TouchableOpacity onPress={()=>{console.log('an1')}} style={{
            position:'absolute',
            top:SC_H - 150,
            right:0,
            justifyContent:'center',
            alignItems:'center'
        }}>
            <Box bgColor={'red.600'} zIndex={10} w={3} h={3} borderRadius={20} position={'absolute'} top={1} right={1}></Box>
            <Ionicons name="arrow-down-circle-outline" color={'#1f7fff'} size={40}/>
        </TouchableOpacity>
    )
}
export default observer(DownloadToast)