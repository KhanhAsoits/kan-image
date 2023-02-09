import {Dimensions, PermissionsAndroid} from "react-native";
import {Audio} from 'expo-av'
export const SC_W = Dimensions.get('window').width
export const SC_H = Dimensions.get('window').height
import * as Sharing from 'expo-sharing'

export const getChildObjects = (docs) => {
    let children = []
    docs.forEach((docRef) => {
        children.push({...docRef.data(),docId:docRef.id})
    })
    return children;
}
export const getChildObject = (doc) => {
    return doc.data()
}
export const playingTappedSound = async()=>{
    try{
        const { sound } = await Audio.Sound.createAsync(require('../../assets/sound/tap.wav'));
        await sound.playAsync();
    }catch(e){
        console.log(e)
    }
   
}
export function objectToString(object){
    let keys = Object.keys(object)
    let str = keys.map((val)=>{return  `${val}:${object[val]}`}).join(' ')
    return str;
}
export function formatBytes(bytes, decimals = 2) {
    if (!+bytes) return '0 Bytes'
    const k = 1024
    const dm = decimals < 0 ? 0 : decimals
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB']

    const i = Math.floor(Math.log(bytes) / Math.log(k))

    return `${parseFloat((bytes / Math.pow(k, i)).toFixed(dm))} ${sizes[i]}`
}
export const slugify = (text) =>{
    return  text.toString().normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase().trim().replace(/\s+/g, '-').replace(/[^\w-]+/g, '').replace(/--+/g, '-')
}
export const getSharedPermission = async ()=>{
    return await Sharing.isAvailableAsync()
}
export const getAndroidWriteExternalStoragePermission = async()=>{
    return await PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE)
}