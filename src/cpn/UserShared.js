import { observer } from 'mobx-react-lite'
import {HStack,VStack,Image,Text} from 'native-base'
import { useLayoutEffect, useState } from 'react'
import {TouchableOpacity} from 'react-native'
import userThumb from '../../assets/user.png'

const UserShared = ({user,isSL,handleLongPress,selected,setSelected})=>{
    const [sl,setSl] = useState(false)
    useLayoutEffect(()=>{
    },[isSL])
    useLayoutEffect(()=>{
    },[selected])
    const handlePress = ()=>{
        console.log(isSL)
        if(isSL){
            let sls = [...selected]
            const filters = sls.filter((val)=>val === user.id);
            if(filters.length === 0){
                sls.push(user.id)
                setSelected(sls)
                setSl(true)
            }else{
                let removeIndex = -1;
                for(let i = 0 ; i < sls.length ;i++){
                    if(sls[i] === user.id){
                        removeIndex = i;
                    }
                }
                if(removeIndex!==-1){
                    sls.splice(removeIndex,1)
                    setSelected(sls)
                    setSl(false)
                }
            }
        }
    }
    return (
        <TouchableOpacity activeOpacity={1} onPress={handlePress} onLongPress={handleLongPress} delayLongPress={500}>
            <HStack my={2} p={2} w={'100%'} justifyContent={'space-between'} alignItems={'center'} bgColor={sl ? 'gray.600' : 'gray.900'} borderRadius={8}>
                <Image borderRadius={8} w={68} h={68} resizeMode={'cover'} source={user?.avatar !== "" ? {uri:user?.avatar} : userThumb} alt={'image'}/>
                <VStack space={1} w={'70%'}  h={'100%'} justifyContent={'flex-start'}>
                    <Text fontSize={14} numberOfLines={1} w={'100%'} color={'gray.300'} fontWeight={'500'}>{user?.username}</Text>
                    <Text fontSize={12} color={'gray.300'}>{user?.email}</Text>
                    <Text fontSize={12} color={'gray.300'}>Quyền - [Đọc : có -  Ghi : không]</Text>
                </VStack>
                <VStack></VStack>
            </HStack>
        </TouchableOpacity>
    )
}
export default observer(UserShared)