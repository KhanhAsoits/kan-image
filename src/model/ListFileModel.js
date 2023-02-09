import {makeAutoObservable} from "mobx";
import FirebaseProcessor from "./FirebaseProcessor";
import AuthModel from "./AuthModel";
import { Alert } from "react-native";
import {Query, ThumbnailCollection, Image, FileDisplayMode} from "../core/types";
import { getChildObjects } from "../core/helper";
import realtimeListenerModel from "./RealTimeListenderModel";
import firebaseProcessor from "./FirebaseProcessor";
import authModel from "./AuthModel";

class ListFileModel {

    // ui var 
    layoutConfig = FileDisplayMode.GRID
    selectAble = false

    // logic var
    files = []
    selectedFiles = []
    fetching = false
    holdFile = {}
    deletingHoldFile = false
    renaming = false

    constructor() {
        makeAutoObservable(this)
    }
    setSelectedFile = (val)=>{this.selectedFiles = val}
    setSelectAble = (val)=>{this.selectAble = val}
    setDeletingHoldFile = (val)=>{this.deletingHoldFile = val}
    setHoldFile = (val)=>{
        this.holdFile = val;
    }

    setFetching = (val) => {
        this.fetching = val
    }
    setLayoutConfig = (val)=>{this.layoutConfig = val}

    setRenaming = (val)=>{this.renaming = val}
    deleteCollectionById = ()=>{
        let file = [...this.files]
        for(let i = 0 ; i < file.length ; i ++){
            if(file[i].docId === this.holdFile.docId){
                file[i].state = false
            }
        }
        this.setFiles(file)
    }
    onGetCollectionById = async(id)=>{
        try{
            return  await FirebaseProcessor.getDocsByQuery("files",new Query('id',"==",id))
        }catch(e){
            console.log(e)
        }
    }
    onDeletedFile = async()=>{
        try{
            this.setDeletingHoldFile(true)
            setTimeout(async()=>{
                await FirebaseProcessor.deleteCollectionById(this.holdFile)
                // remove on client 
                this.setDeletingHoldFile(false)
                this.deleteCollectionById()
            },500)
            return true;
        }catch(e){
            console.log(e)
            return false;
        }
    }
    getAllFile = async () => {
        try {
            this.setFetching(true)
            setTimeout(async () => {
                const files = await FirebaseProcessor.getDocsByQuery('files', new Query("userId", "==", AuthModel.user.id))
                if (files.length > 0) {
                    this.setFiles(files)
                }
                this.setFetching(false)
            }, 300)
        } catch (e) {
            console.log(e)
        }
    }
    addCollection = async (collection = new ThumbnailCollection()) => {
        try {
            if (collection.id) {
                console.log(collection)
                await FirebaseProcessor.addDocToCollection('files', collection)
                return {result: true, message: 'success', collection: collection}
            }
            return {result: false, message: 'collection id not valid', collection: null}
        } catch (e) {
            console.log(e)
            return {result: false, message: e, collection: null}

        }
    }

    addImageToCollection = async (image = new Image()) => {
        try {
            if (image.id) {
                console.log('image:',image)
                await FirebaseProcessor.addDocToCollection('images', image)
                return {result: true, message: 'success', image: image}
            }
            return {result: false, message: 'image id not valid', image: null}
        } catch (e) {
            console.log(e)
            return {result: false, message: e, image: null}
        }
    }
    setFiles = (val) => {
        this.files = val
    }
    onChildUpdate = async()=>{
        const fileListener = (sns)=>{
            // give an sns data 

            let updateChild = getChildObjects(sns)
            const updateChildTrashFilter = updateChild.filter((val)=>val.state)
            const changeEvent = {change:true,notification:false}
            // remove event check
            const trashFilter = this.files.filter((val)=>val.state)

            if((trashFilter.length !== updateChildTrashFilter.length) || updateChild.length !== this.files.length){
                changeEvent.notification = true;
            }
            // end 
            if(changeEvent.change){
                console.log('change:',changeEvent)
                if(changeEvent.notification){
                    realtimeListenerModel.setCollectionSync(true)
                }else{
                   this.setFiles(updateChild) 
                }
            }
        }
        await FirebaseProcessor.getRealTimeDocsByQuery('files',new Query('userId','==',AuthModel.user.id),fileListener)
    }
    onChangeName = async (name,handleSetName,handleSetDialog)=>{
        try{
            this.setRenaming(true)
            setTimeout(async()=>{
                const docs = {...this.holdFile,name:name}
                await firebaseProcessor.updateCollectionById('files',docs)
                this.setHoldFile(docs)
                this.setRenaming(false)
                handleSetDialog(false)
                handleSetName('')
            },500)
            return true;
        }catch(e){
            this.setRenaming(false)
            Alert.alert('Thông báo','Có chút lỗi xảy ra vui lòng báo cho dev để sửa ngay.')
            console.log(e)
            return false;
        }
    }
    onJoinCollection = async(collectionId,userId,rules)=>{
        try{
            // check collection exit
            let result = await firebaseProcessor.getDocsByQuery("files",new Query('id','==',collectionId))
            if(result.length > 0){
                if(userId !== authModel.user.id){
                    const listShared = [...result[0]?.sharedWith]
                    let checkUserExit = listShared.filter((val)=>val === authModel.user.id)
                    if(checkUserExit.length > 0){
                        Alert.alert('Thông báo','Bạn đã được chia sẻ rồi đừng tham lam nữa.')
                        return ;
                    }
                    listShared.push(authModel.user.id)
                    const updatedDocs = {...result[0],sharedWith:listShared}
                    await firebaseProcessor.updateCollectionById("files",updatedDocs)
                    const join_doc = {sharedId:userId,collectionId:collectionId,userId:authModel.user.id,rules:rules}
                    await firebaseProcessor.addDocToCollection('join_collection',join_doc)
                    Alert.alert('Thành công','bạn đã được chia sẻ với album ảnh nào đó,hãy vào mục Đã Chia Sẻ Với Tôi để xem.')
                }else{
                    Alert.alert('????','bạn không thể tự chia sẻ cho chính bản thân được :))')
                }
            } 
        }catch(e){
            console.log(e)
        }
    }
    syncUpdate = async()=>{
        try{
            realtimeListenerModel.setSyncing(true)
            setTimeout(async()=>{
                const files = await FirebaseProcessor.getDocsByQuery('files', new Query("userId", "==", AuthModel.user.id))
                if(files.length > 0){
                    this.setFiles(files)
                }
                realtimeListenerModel.setSyncing(false)
                realtimeListenerModel.setCollectionSync(false)
            },500)
        }catch(e){
            console.log(e)
        }
    }
    selectFile = (fileId)=>{
        // check file exit 
        //  trash filter 

        const notRemoveFile = this.files.filter((val)=>val.state)
        const checkFileExit = notRemoveFile.filter((val)=>val === fileId)
        if(checkFileExit.length === 0){
            const files = [...this.selectedFiles]
            files.push(fileId)
            this.setSelectedFile(files)
        }
    }

    
    removeSelectedFile = (fileId)=>{
        const fileFound = this.selectedFiles.indexOf(fileId)
        if(fileFound!==-1 || fileFound >= 0){
            // remove 
            let files  = [...this.selectedFiles]
            files.splice(fileFound,1)
            this.setSelectedFile(files)
        }
    }
}

const listFileModel = new ListFileModel()
export default listFileModel