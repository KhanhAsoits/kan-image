import {ActivityIndicator, SafeAreaView, TouchableOpacity} from "react-native";
import {Box, FlatList, HStack, NativeBaseProvider, Text, useLayout} from "native-base";
import SearchHeader from "../../cpn/SearchHeader";
import {observer} from "mobx-react";
import {useLayoutEffect, useMemo} from "react";
import CollectionDetailModel from "../../model/CollectionDetailModel";
import Ionicons from "react-native-vector-icons/Ionicons";
import {SC_W} from "../../core/helper";
import ListFileModel from "../../model/ListFileModel";
import ImageRender from "../../cpn/ImageRender";
import {useNavigation} from "@react-navigation/native";

const CollectionDetailScreen = ({route}) => {
    const {collectionId} = route.params
    const nav = useNavigation()
    useLayoutEffect(() => {
        //     fetch
        const sync = async () => {
            await CollectionDetailModel.onGetImageByCollection(collectionId)
        }
        sync()
    }, [collectionId])

    const columns = 3
    const renderImage = ({item: image, index}) => {
        return <ImageRender isCollection={false} file={image} columnsRan={columns}/>
    }
    const renderFilesMemo = useMemo(() => renderImage, [CollectionDetailModel.listImage])
    return (
        <SafeAreaView style={{flex: 1, backgroundColor: 'black'}}>
            <NativeBaseProvider>
                <Box flex={1} justifyContent={'center'} alignItems={'center'}>
                    {CollectionDetailModel.fetching ?
                        <ActivityIndicator color={'white'} size={30}/>
                        :
                        <Box flex={1}>
                            <HStack w={SC_W} py={2} px={2} bgColor={'black'} shadow={1} justifyContent={'space-between'}
                                    alignItems={'center'}>
                                <TouchableOpacity onPress={()=>{nav.goBack()}}>
                                    <Ionicons color={'white'} size={26} name={'arrow-back'}/>
                                </TouchableOpacity>
                                <Text color={'white'} fontSize={18} textAlign={'center'} fontWeight={'400'}>
                                    Collection
                                </Text>
                                <TouchableOpacity>
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