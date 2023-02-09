import { useNavigation } from '@react-navigation/native'
import {HStack,Image,VStack,Text} from 'native-base'
import { useLayoutEffect, useState } from 'react'
import { TouchableOpacity } from 'react-native-gesture-handler'
import { formatBytes } from '../core/helper'
import { Query } from '../core/types'
import firebaseProcessor from '../model/FirebaseProcessor'
export const Collection = ({collectionId})=>{
    const nav = useNavigation()
    const [fetching,setFetching] = useState(false)
    const [collection,setCollection] = useState({})
    useLayoutEffect(()=>{
        const sync = async ()=>{
            setFetching(true)
            setTimeout(async()=>{
                let collections = await firebaseProcessor.getDocsByQuery('files',new Query('id','==',collectionId))
                if(collections.length > 0){
                    setCollection(collections[0])
                }
                setFetching(false)
            },300)
        }
        sync()
    },[])
    return (
        <>
            {fetching ? 
            <HStack my={2} w={'100%'} h={95} bgColor={'gray.800'} borderRadius={8}>
            
            </HStack>
            :
            <TouchableOpacity activeOpacity={1} onPress={()=>{nav.navigate("collection-detail",{collectionId:collectionId,isCachedImage:false})}}>
                <HStack my={2} p={2} w={'100%'} justifyContent={'space-between'} alignItems={'center'} bgColor={'gray.900'} borderRadius={8}>
                    <Image borderRadius={8} w={20} h={20} resizeMode={'cover'} source={{uri:collection?.firstImage}} alt={'image'}/>
                    <VStack space={1} w={'70%'}  h={'100%'} justifyContent={'flex-start'}>
                        <Text fontSize={14} numberOfLines={1} w={'100%'} color={'gray.300'} fontWeight={'500'}>{collection?.name}</Text>
                        <Text fontSize={12} color={'gray.300'}>Sửa gần nhất - {new Date(collection?.updatedAt).toLocaleDateString()}</Text>
                        <Text fontSize={12} color={'gray.300'}>Tệp ảnh - {formatBytes(collection?.size)}</Text>
                    </VStack>
                    <VStack></VStack>
                </HStack>
            </TouchableOpacity>
        }
        </>
        
    )
}