import {ActivityIndicator, SafeAreaView, TouchableOpacity} from "react-native";
import {Box, FlatList, HStack, NativeBaseProvider, Text, useToast} from "native-base";
import {observer} from "mobx-react";
import {useEffect, useLayoutEffect, useMemo, useState} from "react";
import CollectionDetailModel from "../../model/CollectionDetailModel";
import Ionicons from "react-native-vector-icons/Ionicons";
import {SC_W} from "../../core/helper";
import ImageRender from "../../cpn/ImageRender";
import {useNavigation} from "@react-navigation/native";
import CollectionView from "../../cpn/CollectionView";
import { useSharedValue } from "react-native-reanimated";
import AntDesign from 'react-native-vector-icons/AntDesign'
import collectionDetailModel from "../../model/CollectionDetailModel";
const CollectionDetailScreen = ({route}) => {
    const {collectionId,isCachedImage} = route.params
    const nav = useNavigation()
    const showCollection = useSharedValue(false)

    useLayoutEffect(() => {
        //     fetch
        const sync = async () => {
            await CollectionDetailModel.onGetImageByCollection(collectionId)
        }
        sync()
    }, [collectionId])
    useEffect(()=>{
        nav.addListener('beforeRemove',(e)=>{
            collectionDetailModel.setIndexShow(0)
        })
    },[nav])
    const nativeBaseToast = useToast() 
    const columns = 3
    const renderImage = ({item: image, index}) => {
        return <ImageRender index={index} isCachedImage={isCachedImage} isCollection={false} showCollection={showCollection} file={image} columnsRan={columns}/>
    }
    const renderFilesMemo = useMemo(() => renderImage, [CollectionDetailModel.listImage])

    useLayoutEffect(()=>{
        nativeBaseToast.show({
            description:'Lần đầu sẽ load hơi chậm xíu nhé lần sau không phải load nữa đâu.',
            duration:1000,
            zIndex:10
        })
    },[])
    return (
        <SafeAreaView style={{flex: 1, backgroundColor: 'black'}}>
            <NativeBaseProvider>
                <Box flex={1} justifyContent={'center'} alignItems={'center'}>
                    <CollectionView isShow={showCollection}/>
                    {CollectionDetailModel.fetching ?
                        <ActivityIndicator color={'white'} size={30}/>
                        :
                        <Box flex={1}>
                            <HStack w={SC_W} py={4} px={2} bgColor={'black'} shadow={1} justifyContent={'space-between'}
                                    alignItems={'center'}>
                                <TouchableOpacity onPress={()=>{nav.goBack()}}>
                                    <Ionicons color={'white'} size={26} name={'arrow-back'}/>
                                </TouchableOpacity>
                                <Text numberOfLines={1} width={'70%'} color={'white'} fontSize={18} textAlign={'center'} fontWeight={'400'}>
                                    {collectionDetailModel.collection.name}
                                </Text>
                                <TouchableOpacity>
                                    <AntDesign name={'appstore-o'} color={'#4D53FE'} size={22}/>
                                </TouchableOpacity>
                            </HStack>
                            <FlatList
                                _contentContainerStyle={{
                                    paddingX:2
                                }}
                                numColumns={columns}
                                data={CollectionDetailModel.listImage}
                                renderItem={renderFilesMemo}
                                keyExtractor={item => item?.id}
                            />
                        </Box>
                    }
                </Box>
            </NativeBaseProvider>
        </SafeAreaView>
    )
}
export default observer(CollectionDetailScreen)