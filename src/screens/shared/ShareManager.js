import { observer } from "mobx-react-lite"
import { Box, NativeBaseProvider,HStack,Text, FlatList,Image,VStack } from "native-base"
import { SafeAreaView } from "react-native-safe-area-context"
import  {ActivityIndicator, TouchableOpacity, Vibration} from 'react-native'
import Ionicons from 'react-native-vector-icons/Ionicons'
import AntDesign from 'react-native-vector-icons/AntDesign'
import { SC_W, SC_H, playingTappedSound} from "../../core/helper"
import { useLayoutEffect, useState,useMemo } from "react"
import sharedCollectionModel from "../../model/SharedCollectionModel"
import  UserShared  from "../../cpn/UserShared"
const ShareManager = ({route})=>{
    const {collectionId} = route.params
    const [loading,setLoading] = useState(false)
    const [sharedWith,setSharedWith] = useState([])
    const [selected,setSelected] = useState([])
    const [isSelect,setIsSelect] = useState(false);
    useLayoutEffect(()=>{
        const sync = async()=>{
            setLoading(true)
            setTimeout(async()=>{
                let resp = await sharedCollectionModel.onFetchAllUserSharedWithCollection(collectionId);
                setSharedWith(resp)
                setLoading(false)
            },300)
        }
        sync()
    },[collectionId])


    const handleLongPress = async()=>{
        if(selected.length === 0){
            setIsSelect(true)
        }
    }
    useLayoutEffect(()=>{
        console.log(isSelect)
    },[isSelect])

    const renderListCollection = ({item:user,index})=>{
        return (
            <UserShared user={user} isSL={isSelect} selected={selected} setSelected={setSelected} handleLongPress={handleLongPress}/>
        )
    }

    return (
        <SafeAreaView style={{flex:1}}>
            <NativeBaseProvider>
                <Box flex={1} bgColor={'black'} justifyContent={'center'} alignItems={'center'}>
                    {loading ? <ActivityIndicator color={'white'} size={30}/> : 
                    <Box flex={1}>
                        <HStack w={SC_W} py={4} px={2} bgColor={'black'} shadow={1} justifyContent={'space-between'}
                                        alignItems={'center'}>
                            <TouchableOpacity onPress={()=>{nav.goBack()}}>
                                <Ionicons color={'white'} size={26} name={'arrow-back'}/>
                            </TouchableOpacity>
                            <Text numberOfLines={1} width={'70%'} color={'white'} fontSize={18} textAlign={'center'} fontWeight={'400'}>
                                Quản lý  chia sẻ
                            </Text>
                            <TouchableOpacity>
                                <AntDesign name={'appstore-o'} color={'#4D53FE'} size={22}/>
                            </TouchableOpacity>
                        </HStack>
                        <FlatList 
                             contentContainerStyle={{paddingHorizontal:12,paddingVertical:20}}
                             data={sharedWith}
                             keyExtractor={item=>item?.id}
                             renderItem={renderListCollection}
                        />
                    </Box>
                    }
                </Box>
            </NativeBaseProvider>
        </SafeAreaView>
    )
}

export default observer(ShareManager);
