import { observer } from "mobx-react-lite"
import { Box, HStack ,Text,Image, ScrollView, VStack} from "native-base"
import { TouchableOpacity } from "react-native-gesture-handler"
import { formatBytes, SC_W } from "../core/helper"
import listFileModel from "../model/ListFileModel"
import BottomSheet from "./BottomSheet"
import CachedImage from 'expo-cached-image'
import { ActivityIndicator } from "react-native"
const FocusBottomSheet = (props)=>{
    const listInfoData = [
        {title:'Loại',value:'Ảnh',id:1},
        {title:'Kích cỡ',value:formatBytes(listFileModel?.holdFile?.size),id:2},
        {title:'Ngày tạo',value:new Date(listFileModel?.holdFile?.createdAt).toLocaleDateString(),id:3},
        {title:'Ngày sửa đổi',value:new Date(listFileModel?.holdFile?.updatedAt).toLocaleDateString(),id:4},
        {title:'Quyền được chia sẻ',value:`Đọc , Ghi`,id:5},
        {title:'Tổng số ảnh',value:listFileModel.holdFile?.totalThumbnail,id:6}
    ]
    return(
        <BottomSheet bg={'#1b1b1b'} isShow={props.isShow}>
            <Box py={3} px={3}>
                <HStack pb={3} justifyContent={'space-between'} alignItems={'center'}>
                    <Box w={'30%'}></Box>
                    <Box justifyContent={'center'} width={'40%'}>
                        <Text color={'white'} fontSize={18} fontWeight={'600'}>Thông tin</Text>
                    </Box>
                    <TouchableOpacity onPress={()=>{props.isShow.value = false}}>
                        <Text fontSize={16} fontWeight={'500'} color={'blue.300'}>Xong</Text>
                    </TouchableOpacity>
                </HStack>
                {/* image */}
                <ScrollView>
                {listFileModel.holdFile?.firstImage && 
                <CachedImage
                    cacheKey={`${listFileModel.holdFile?.id}`}
                    placeholderContent={(
                        <Box height={Math.round(Math.random() * (200 - 160) + 160)}>
                            <ActivityIndicator 
                                color={
                                    'gray'
                                }
                                size="small"
                                style={{
                                    flex: 1,
                                    justifyContent: "center",
                                }}
                            />
                        </Box>
                    )}
                    resizeMode={'cover'} source={{uri: listFileModel.holdFile?.firstImage}} alt={'images'} style={{
                    width: '100%', height: 180,
                    backgroundColor: 'rgba(255,255,255,.6)',
                    borderRadius: 12
                    }}/> 
                }
               
                    {/* <Image my={2} alt={'image'} alignSelf={'center'} source={{uri:listFileModel.holdFile?.firstImage}} width={SC_W / 3} height={SC_W / 2} borderRadius={6} bgColor={'gray.300'}/> */}
                    <Box px={2}>
                        <Text fontSize={20} fontWeight={'500'} my={2} numberOfLines={2} color={'white'}>
                            {listFileModel.holdFile?.name}
                        </Text>
                        <Text fontSize={18} fontWeight={'300'} my={2} numberOfLines={2} color={'gray.300'}>
                            Tập ảnh - {formatBytes(listFileModel.holdFile?.size)}
                        </Text>
                        <Box borderBottomWidth={.2} py={2} borderBottomColor={'gray.700'}></Box>
                        <Text fontSize={18} fontWeight={'500'} my={2} numberOfLines={2} color={'white'}>
                            Thông tin
                        </Text>
                        <VStack>
                            {listInfoData.map((val)=>{
                                return (
                                    <HStack key={val.id.toString()} borderBottomColor={'gray.700'} borderBottomWidth={.2} py={1} justifyContent={'space-between'} alignItems={'center'}>
                                        <Text color={'gray.400'}>{val.title}</Text>
                                        <Text color={'white'}>{val.value}</Text>
                                    </HStack>
                                )
                            })}
                        </VStack>
                        
                    </Box>
                </ScrollView>
                
            </Box>
        </BottomSheet>
    )
}
export default observer(FocusBottomSheet)