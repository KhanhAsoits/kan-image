import {makeAutoObservable} from "mobx";
import FirebaseProcessor from "./FirebaseProcessor";
import {Query} from "../core/types";

class CollectionDetailModel {

    fetching = false
    listImage = []
    collection = {}

    constructor() {
        makeAutoObservable(this)
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
            setTimeout(async () => {
                await this.onGetCollection(id)
                const result = await FirebaseProcessor.getDocsByQuery('images', new Query('collectionId', '==', id))
                if (result.length > 0) {
                    this.setListImage(result)
                }
                this.setFetching(false)
            }, 500)
        } catch (e) {
            console.log(e)
        }
    }
}

const collectionDetailModel = new CollectionDetailModel()
export default collectionDetailModel;