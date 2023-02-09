import { useNavigation } from "@react-navigation/native"
import { observer } from "mobx-react"
import { Box, HStack, Text,NativeBaseProvider, VStack, ScrollView } from "native-base"
import { SafeAreaView } from "react-native-safe-area-context"
import { SC_W } from "../../core/helper"
import { TouchableOpacity } from "react-native"
import AntDesign from 'react-native-vector-icons/AntDesign'
import downloadManagerModel from "../../model/DownloadManagerModel"
import DownloadProgressItem from "../../cpn/DownloadProgressItem"
const DownloadScreen = ({route})=>{
    const nav = useNavigation()

    return (
        <SafeAreaView style={{flex:1}}>
            <NativeBaseProvider>
                <Box flex={1} bgColor={'black'}>
                    {/* header  */}
                    <HStack w={SC_W} py={4} px={2} bgColor={'black'} shadow={1} justifyContent={'space-between'}
                                    alignItems={'center'}>
                        <TouchableOpacity onPress={()=>{nav.goBack()}}>
                        </TouchableOpacity>
                        <Text color={'white'} fontSize={18} textAlign={'center'} fontWeight={'400'}>
                            Tải về
                        </Text>
                        <TouchableOpacity>
                            <AntDesign name={'appstore-o'} color={'#4D53FE'} size={22}/>
                        </TouchableOpacity>
                    </HStack>
                    {/* end header */}
                    <ScrollView px={2} contentContainerStyle={{paddingTop:40}}>
                        <VStack space={2}>
                            {downloadManagerModel.downloadingTask.map((task,index)=>{
                                    return (
                                        <DownloadProgressItem key={index.toString()} task={task}/>
                                    )
                            })}
                        </VStack>
                    </ScrollView>
                </Box>
            </NativeBaseProvider>
        </SafeAreaView>        
    )
}
export default observer(DownloadScreen)