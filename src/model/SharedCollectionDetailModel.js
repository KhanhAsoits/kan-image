import { makeAutoObservable } from "mobx";
import { Query } from "../core/types";
import firebaseProcessor from "./FirebaseProcessor";

class ShareCollectionDetailModel{
    sharer = {}

    collections = {}

    images = []

    fetching = false

    constructor(){
        makeAutoObservable(this)
    }
    setFetching = val => {this.fetching = val}
    setCollection = val =>{this.collection = val}
    setSharer = val => {this.sharer = val}
    setImages = val =>{this.images = val}
    onGetCollection = async (collectionId)=>{
        try{
            let result = await firebaseProcessor.getDocsByQuery('files',new Query('id','==',collectionId))
            if(result.length > 0){
                this.setCollection(result)
            }
        }catch(e){
            console.log(e)
        }
    }
    onGetSharer = async (sharerId)=>{
        try{
            let result = await firebaseProcessor.getDocsByQuery('users',new Query('id','==',sharerId))
            if(result.length > 0){
                this.setSharer(result[0])
            }
        }catch(e){
            console.log(e)
        }
    }
    onGetImage = async (collectionId)=>{
        try{
            let result = await firebaseProcessor.getDocsByQuery('images',new Query('collectionId','==',collectionId))
            if(result.length > 0){
                this.setImages(result)
            }
        }catch(e){
            console.log(e)
        }
    }

}