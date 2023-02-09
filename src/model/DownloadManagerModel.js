import { makeAutoObservable } from "mobx";
import { Alert } from "react-native";
import listFileModel from "./ListFileModel";
import 'react-native-get-random-values'
import  {v4 as UUID} from 'uuid'
import { DownloadInfo, DownloadingTask, Query } from "../core/types";
import authModel from "./AuthModel";
import firebaseProcessor from "./FirebaseProcessor";
import * as FileSystem from 'expo-file-system'
import {  getChildObjects } from "../core/helper";
class DownloadManagerModel {
    downloadTask = []
    downloadingTask = []
    
    constructor(){
        makeAutoObservable(this)
    }
    setDownloadingTask  = (val)=>{this.downloadingTask = val}
    setDownloadTask = (val)=>{
        this.downloadTask = val
    }
    addDownloadTask = (task) => {
        const new_download_task = [...this.downloadTask]
        new_download_task.push(task)
        this.setDownloadTask(new_download_task)
    }

    checkHasDownload = ()=>{
        const tasks = [...this.downloadTask].filter((val)=>{return val.collectionId === listFileModel.holdFile.id})
        return tasks.length !== 0
    }
    onAddDownloadTask = async(downloadTask)=>{
        try{
            await firebaseProcessor.addDocToCollection('download_tasks',downloadTask)
        }catch(e){
            console.log(e)
        }
    }
    onDownloadTaskUpdate = async()=>{
        const callback = (sns)=>{
            const updateData = getChildObjects(sns)
            if(updateData.length > 0){
                this.setDownloadTask(updateData)
                this.onPrepareToDownload()
            }
        }
        await firebaseProcessor.getRealTimeDocsByQuery('download_tasks',new Query('userId','==',authModel.user.id),callback)
    }
    

    onSyncDownloadCollection = async ()=>{
        try{
            if(!this.checkHasDownload()){
                const downloadInfo = new DownloadInfo(UUID(),authModel.user.id,listFileModel.holdFile?.id,false,[],[],0,false)
                await this.onAddDownloadTask(downloadInfo)
            }else{
                Alert.alert('Thông báo','Đã thêm album này vào hàng đợi tải rồi nhé , kiểm tra ở phần Tải về đi nào.')
            }       
        }catch(e){
            console.log(e)
        }
    }

    onPrepareToDownload = async()=>{
        try{
            const downloadAble = this.downloadTask.filter((task)=>task.pause === false)
            const call = async ()=>{
            // get collection image for downloading task = 
                downloadAble.forEach(async(task,index)=>{
                    const collection = await firebaseProcessor.getDocsByQuery('images',new Query('collectionId','==',task.collectionId))
                    const new_download_task = new DownloadingTask(task.id,task.collectionId,[],collection,0,false)
                    const downloadingTask = [...this.downloadingTask]
                    if(downloadingTask.filter((val)=>val.id === new_download_task.id).length === 0){
                        downloadingTask.push(new_download_task)
                    }
                    this.setDownloadingTask(downloadingTask)
                })
            }
            await call()
        }catch(e){
            console.log(e)
        }
    }
    onSyncDownload = async ()=>{
        try{
            this.downloadingTask.forEach(async(task,index_)=>{
                if(task.savedImage.length === 0){
                    // start download
                    const listUri = task.downloadImage.map((image)=>image.uri)
                    listUri.forEach(async(uri_,index)=>{
                        const startSlice = uri_.indexOf("uploaded%") + "uploaded%".length
                        const lastSlice = uri_.indexOf(".jpeg") + ".jpeg".length
                        const filename = uri_.slice(startSlice,lastSlice)
                        const fileUri = FileSystem.documentDirectory + filename
                        FileSystem.downloadAsync(uri_,fileUri).then(({uri})=>{
                            const savedImage = [...task.savedImage]
                            savedImage.push(task.downloadImage[index])
                            const new_downloading = [...this.downloadingTask]
                            new_downloading[index_] = {...task,savedImage:savedImage}
                            this.setDownloadingTask(new_downloading)
                            console.log('length : ',this.downloadingTask[index_].savedImage.length)
                        })
                        // update downloading task
                    })
                }
            })
        }catch(e){
            console.log()
        }
    }
}

const downloadManagerModel = new DownloadManagerModel()
export default downloadManagerModel;