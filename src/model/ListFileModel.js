import {makeAutoObservable} from "mobx";
import FirebaseProcessor from "./FirebaseProcessor";
import AuthModel from "./AuthModel";
import {Query, ThumbnailCollection, Image} from "../core/types";

class ListFileModel {

    files = []
    fetching = false

    constructor() {
        makeAutoObservable(this)
    }

    setFetching = (val) => {
        this.fetching = val
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
}

const listFileModel = new ListFileModel()
export default listFileModel