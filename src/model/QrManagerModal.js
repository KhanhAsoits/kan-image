import { makeAutoObservable } from "mobx";
import { configs } from "../core/configs";
import JWT from "expo-jwt";
import { BARCODE_TYPE, QrCodeRequest, QR_ACTION } from "../core/types";
import { JSHash ,CONSTANTS, JSHmac} from "react-native-hash";
import { objectToString } from "../core/helper";
import { BarCodeScanner } from "expo-barcode-scanner";
import { Alert } from "react-native";
import listFileModel from "./ListFileModel";
class QrManagerModal {
    generating = false;
    qrCode = ""
    tokenExpired = new Date().getTime()
    processing = false
    constructor(){
        makeAutoObservable(this)
    }
    setProcessing= (val)=>{this.processing = val}
    setGenerating = (val)=>{this.generating = val}
    setToken = (val)=>{this.qrCode = val}
    setExpireToken = (val)=>{this.tokenExpired = val}
    generateCode = async(action,dataRequest)=> {
        try{
            this.setGenerating(true)
            setTimeout(async()=>{
                const tokenExpired = Math.floor(Date.now() / 1000) + (60 * 15)
                const data = new QrCodeRequest(action,dataRequest,tokenExpired)
                const hashToken = await JSHmac(data.action+objectToString(data.dataRequest)+
                data.expireAt+data.createdAt,configs.hash_secret,CONSTANTS.HmacAlgorithms.HmacSHA512)
                data.hashToken = hashToken;
                let jwtToken = JWT.encode(data,configs.secret_key)
                this.setToken(jwtToken)
                this.setExpireToken(tokenExpired)        
                this.setGenerating(false)
            },1000)
        }catch(e){
            console.log(e)
        }
    }
    processData = async (jwtData)=>{
        if(jwtData && jwtData?.appToken){
            // check token valid
            if(new Date(jwtData.expireAt) < new Date().now / 1000){
                this.setProcessing(false)
                Alert.alert('Thông báo','Mã QR đã hết hạn.')
                return;
            }
             
            // check hash 
            const hashToken = await JSHmac(jwtData?.action + objectToString(jwtData.dataRequest)+jwtData.expireAt+jwtData.createdAt,configs.hash_secret,CONSTANTS.HmacAlgorithms.HmacSHA512)
            if(hashToken !== jwtData.hashToken){
                this.setProcessing(false)
                Alert.alert('Cảnh báo','Dữ liệu của mã qr này đã bị thay đổi.')
                return;
            }
            // if all valid
            switch(jwtData.action){
                case QR_ACTION.JOIN_COLLECTION:
                    await listFileModel.onJoinCollection(jwtData?.dataRequest?.collectionId,jwtData?.dataRequest?.userId,jwtData?.dataRequest.rules)
                break;
            }
        }else{
            Alert.alert('Mã Qr này không phải của ứng dụng.')
        }
    }
    processQrCode = async(qrCodeResult,raw)=>{
        try{
            this.setProcessing(true)
            // if not raw 
            setTimeout(async()=>{
                let jwtData = null
                if(!raw){
                    // read
                    const result = await BarCodeScanner.scanFromURLAsync(qrCodeResult)
                    const  {type,data} = result[0]
                    if(type === BARCODE_TYPE.QR){
                        jwtData = JWT.decode(data,configs.secret_key)
                    }else{
                        Alert.alert('Thông báo','Ứng dụng chỉ quét được mã QR.')
                    }
                }else{
                    jwtData = JWT.decode(qrCodeResult,configs.secret_key)
                }
                this.processData(jwtData)
                this.setProcessing(false)
            },2000)
        }catch(e){
            Alert.alert('Mã QR này không phải của ứng dụng .')
            console.log(e)
        }
    }

}
const qrManagerModel = new QrManagerModal();
export default qrManagerModel;