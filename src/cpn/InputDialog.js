import Dialog from 'react-native-dialog'
import { View } from 'react-native'
import { ActivityIndicator } from 'react-native'
import { observer } from 'mobx-react'

 const InputDiaLog = ({visible,loading,handleSuccess,text,setText,handleCancel})=>{
    return (
        <View>
        <Dialog.Container visible={visible}>
          <Dialog.Title>Đổi tên</Dialog.Title>
          <Dialog.Description>
            Nhập vào tên muốn đổi nào.
          </Dialog.Description>
          <Dialog.Input onChangeText={text_=>setText(text_)} value={text}/>
          <Dialog.Button onPress={handleCancel} label="Hủy" />
          <Dialog.Button label={loading ? <ActivityIndicator color="gray" size={22}/> : "Xong"} onPress={handleSuccess}/>
        </Dialog.Container>
      </View>
    )
}
export default observer(InputDiaLog)