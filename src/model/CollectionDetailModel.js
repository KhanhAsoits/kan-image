import {makeAutoObservable} from "mobx";
import FirebaseProcessor from "./FirebaseProcessor";
import {Query} from "../core/types";

class CollectionDetailModel {

    fetching = false
    listImage = []
    collection = {}
    indexShow = 0

    listImageSelected = []
    constructor() {
        makeAutoObservable(this)
    }



    setListImageSelected = (val)=>{
        this.listImageSelected = val;
    }
    setIndexShow = (val)=>{
        this.indexShow = val
    }

    setFetching = (val) => {
        this.fetching = val
    }
    setListImage = (val) => {
        this.listImage = val
    }
    setCollection = (val) => {
        this.collection = val
    }

    onGetAllImageUriByCollection = async (id)=> {
        try{
            let result = await FirebaseProcessor.getDocsByQuery('images',new Query('collectionId','==',id))
            return result.length > 0 ? result : null
        }catch(e){
            console.log(e)
        }
    }

    onGetCollection = async (id) => {
        try {
            const collection = await FirebaseProcessor.getDocsByQuery('files', new Query('id', '==', id))
            if (collection?.length > 0) {
                this.setCollection(collection[0])
            }
        } catch (e) {
            console.log(e)
        }
    }

    onGetImageByCollection = async (id) => {
        try {
            this.setFetching(true)
                await this.onGetCollection(id)
                const result = await FirebaseProcessor.getDocsByQuery('images', new Query('collectionId', '==', id))
                if (result.length > 0) {
                    this.setListImage(result)
                }
                this.setFetching(false)
        } catch (e) {
            console.log(e)
        }
    }
}

const collectionDetailModel = new CollectionDetailModel()
export default collectionDetailModel;