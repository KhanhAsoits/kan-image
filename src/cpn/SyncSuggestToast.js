import { observer } from "mobx-react"
import { Box ,Text,View} from "native-base"
import { useLayoutEffect, useState } from "react"
import { ActivityIndicator } from "react-native"
import { TouchableOpacity } from "react-native-gesture-handler"
import realtimeListenerModel from "../model/RealTimeListenderModel"
import { SC_W } from "../core/helper"
const SyncSuggestToast = ({handleSync,isShow,setShow,remainSecond,syncNotificationModel})=>{
    const [remainSecond_,setRemainSecond] = useState(remainSecond)

    useLayoutEffect(()=>{
        let interval = null
        if(isShow){
            setRemainSecond(c=>c===remainSecond ? c : remainSecond)
            interval = setInterval(()=>{
                setRemainSecond(c=>c-1>=0?c-1:c)
            },1000)
            
            // remove
            setTimeout(()=>{
                setShow(false)
            },remainSecond * 1000)
        }
       

        return ()=>{
            if(isShow){
                clearInterval(interval)
            }
        }

    },[isShow])

    return (
        <>
            {isShow && 
                <Box top={5} px={1} alignSelf={'center'}  position={'absolute'} justifyContent={'space-between'} alignItems={'center'} flexDir={'row'} width={SC_W / 1.8} height={10} borderRadius={100} bgColor={"gray.500"} zIndex={20}>
                    <Box>
                        <View 
                            style={{
                                width:36,
                                height:36,
                                borderRadius:100,
                                padding:3,
                                backgroundColor:'rgba(255,255,255,.6)'
                            }}
                        >
                            <View 
                            style={{
                                width:'100%',
                                height:'100%',
                                borderRadius:100,
                                justifyContent:'center',
                                alignItems:'center',
                                backgroundColor:'white'
                            }}
                            >
                                <TouchableOpacity>
                                    {realtimeListenerModel.syncing ? 
                                        <ActivityIndicator color={'gray'} size={22}/>:
                                        <Text color={'black'} fontSize={14} fontWeight={'500'}>{remainSecond_}</Text>
                                    }
                                </TouchableOpacity>
                            </View>
                        </View>
                    </Box>
                    <TouchableOpacity onPress={handleSync}>
                        <Text color={'gray.100'} numberOfLines={1} fontSize={12} fontWeight={'500'}>Đã có sự thay đổi {syncNotificationModel}</Text>
                    </TouchableOpacity>
                    <Box></Box>
                </Box>
            }
        </>
    )
}
export default observer(SyncSuggestToast)