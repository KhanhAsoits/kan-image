import { observer } from "mobx-react"
import { HStack,VStack,Text, Image, Box } from "native-base"
import { useLayoutEffect, useState } from "react"
import listFileModel from "../model/ListFileModel"
import { ProgressBar } from "./ProgressBar"

const DownloadProgressItem = ({task})=>{
    const [fetching,setFetching] = useState(false)
    const [collection,setCollection] = useState(null)
    // fetching collection
    useLayoutEffect(()=>{
        setFetching(true)
        setTimeout(async ()=>{
            let res = await listFileModel.onGetCollectionById(task.collectionId)
            if(res.length > 0){
                setCollection(res[0])
            }
            setFetching(false)
        },300)
    },[])
    // 
    return (
        <HStack bgColor={'gray.900'} p={2} borderRadius={8} shadow={1} justifyContent={'space-between'} alignItems={'center'}>
            {!fetching && 
            <>
                <Image alt={'image'} source={{uri:collection?.firstImage}} width={66} height={20} borderRadius={8}/>
                <VStack height={'100%'} space={3} justifyContent={'flex-start'} alignItems={'flex-start'}>
                    <Text numberOfLines={1} color={'gray.100'}>{collection?.name}</Text>
                    {/* progress bar */}
                    <ProgressBar progress={task.savedImage.length / task.downloadImage.length * 100} bgColor={'gray.300'} trackColor={'gray.500'}/>
                    <Text color={'gray.200'}>{task.savedImage.length} / {task.downloadImage.length}</Text>
                </VStack>
                <VStack></VStack>
            </>
            }
            {fetching && 
                <Box w={'100%'} height={20}></Box>
            }
        </HStack>
    )
    
}
export default observer(DownloadProgressItem)