import { observer } from "mobx-react"
import {Box,Text,HStack} from 'native-base'
import { useLayoutEffect, useMemo, useState } from "react"
import { FlatList } from "react-native-gesture-handler"
import { Query } from "../core/types"
import firebaseProcessor from "../model/FirebaseProcessor"
import { Collection } from "./Collection"

const SharedCollection = ({collection,index})=>{
    const [sharer,setSharer] = useState()
    const [fetching,setFetching] = useState(false)
    useLayoutEffect(()=>{
        // fetch
        if(collection){
            const sync = async()=>{
                setFetching(true)
                setTimeout(async()=>{
                    let sharer = await firebaseProcessor.getDocsByQuery('users',new Query('id','==',collection.sharedId))
                    if(sharer.length > 0){
                        setSharer(sharer[0])
                    }
                    setFetching(false)
                },300)
            }
            sync()
        }
    },[])
    const renderImage = ({item:collectionId,index})=>{
        return (
            <Collection collectionId={collectionId}/>
        )
    }
    const renderImageMemo = useMemo(()=>renderImage,[collection.collections])
    return (
        <Box w={'100%'} borderRadius={8}>
            {fetching ? 
                <Box w={'100%'} h={5} bgColor={'gray.700'} borderRadius={4}></Box>
                :
                <HStack w={'100%'} justifyContent={'space-between'} alignItems={'center'}>
                    <Box w={'30%'} h={.2} bgColor={'gray.400'}></Box>
                    <Text color={'gray.400'} numberOfLines={1} w={'30%'} fontSize={14} fontWeight={'600'}>{sharer?.username}</Text>
                    <Box w={'30%'} h={.2} bgColor={'gray.400'}></Box>
                </HStack>
            }
            {/* <Box w={'100%'} h={66} bgColor={'gray.700'} my={2} borderRadius={4}></Box> */}
            <FlatList 
            keyExtractor={item=>{item?.id}}
                data={collection.collections}
                renderItem={renderImageMemo}
            />
        </Box>
    )
}
export default observer(SharedCollection)