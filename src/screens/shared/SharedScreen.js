import { observer } from "mobx-react-lite"
import { SafeAreaView } from "react-native-safe-area-context"
import {NativeBaseProvider,Box,HStack,Text} from 'native-base'
import {ActivityIndicator, FlatList, TouchableOpacity} from 'react-native'
import Ionicons from  'react-native-vector-icons/Ionicons'
import { SC_W } from "../../core/helper"
import AntDesign from 'react-native-vector-icons/AntDesign'
import sharedCollectionModel from "../../model/SharedCollectionModel"
import { useLayoutEffect, useMemo } from "react"
import authModel from "../../model/AuthModel"
import SharedCollection from "../../cpn/SharedCollection"
import { useNavigation } from "@react-navigation/native"
const SharedScreen = ()=>{
    useLayoutEffect(()=>{
        // fetching data
        const sync  = async()=>{
            await sharedCollectionModel.onGetSharedCollection()
        }
        sync()
    },[])
    const nav = useNavigation()
    const renderListCollection = ({item:collection,index})=>{
        return <SharedCollection collection={collection} index={index}/>
    }
    const renderItemMemo = useMemo(()=>renderListCollection,[sharedCollectionModel.sharedCollection])

       return (
            <SafeAreaView style={{flex:1}}>
                <NativeBaseProvider>
                    {sharedCollectionModel.fetching ?  
                        <Box flex={1} justifyContent={'center'} bgColor={'black'} alignItems={'center'}>
                            <ActivityIndicator color={'white'} size={22}/>
                        </Box>
                        :
                        <Box flex={1} bgColor={'black'}>
                            <HStack w={SC_W} py={4} px={2} bgColor={'black'} shadow={1} justifyContent={'space-between'}
                                            alignItems={'center'}>
                                <TouchableOpacity onPress={()=>{nav.goBack()}}>
                                    <Ionicons color={'white'} size={26} name={'arrow-back'}/>
                                </TouchableOpacity>
                                <Text color={'white'} fontSize={18} textAlign={'center'} fontWeight={'400'}>
                                    Chia sẻ với tôi 
                                </Text>
                                <TouchableOpacity>
                                    <AntDesign name={'appstore-o'} color={'#4D53FE'} size={22}/>
                                </TouchableOpacity>
                            </HStack>
                            <FlatList
                                contentContainerStyle={{paddingHorizontal:12,paddingVertical:20}}
                                data={sharedCollectionModel.sharedCollection}
                                keyExtractor={item=>item?.id}
                                renderItem={renderItemMemo}
                                />
                        </Box>
                    }
                </NativeBaseProvider>
            </SafeAreaView>
       )
}
export default observer(SharedScreen)