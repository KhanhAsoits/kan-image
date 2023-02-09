import { makeAutoObservable } from "mobx";
import { Query } from "../core/types";
import authModel from "./AuthModel";
import firebaseProcessor from "./FirebaseProcessor";

class ShareCollectionModel{
    sharedCollection = []
    fetching  = false

    constructor(){
        makeAutoObservable(this)
    }
    setCollection = val =>{this.sharedCollection = val}
    setFetching = val =>{this.fetching = val}

    onFetchAllUserSharedWithCollection = async(collectionId)=>{
        // fetch collection
        try{
            let collection = await firebaseProcessor.getDocsByQuery("files",new Query("id","==",collectionId));
            if(collection.length > 0){
                const userIds = [...collection[0]?.sharedWith]
                let users = []
                let promises = []
                userIds.forEach(async(val)=>{
                    let ps = new Promise((resl,rej)=>{
                        firebaseProcessor.getDocsByQuery("users",new Query("id","==",val)).then((res)=>res.length > 0?resl(res[0]) : resl(null)).catch((e)=>rej(e))
                    })
                    promises.push(ps)
                })
                const prsAll = new Promise((res)=>{
                    res(
                        Promise.all(promises).then((res)=>{
                            if(res.length > 0){
                                users = [...res]
                            }
                        })
                    )
                })
                await prsAll
                return users.length > 0 ? users : []
            }
        }catch(e){
            console.log(e)
        }
    }


    onGetChildUpdateCollection = async ()=>{
        try{

        }catch(e){
            console.log(e)
        }
    }
    processSharedCollection = async(lisShared)=>{
        try{
            function SharedCollection(sharedId,collections){
                this.sharedId = sharedId,
                this.collections = collections;
            }
            const sharerCollection = []
            let sharer = Array.from(new Set(lisShared.map((val)=>val.sharedId)))
            sharer.forEach((val)=>{
                let sharedCollection = new SharedCollection(val,[]) 
                sharerCollection.push(sharedCollection)
            })
            sharerCollection.forEach((val)=>{
                lisShared.forEach((shared)=>{
                    if(shared?.sharedId === val?.sharedId){
                        val.collections.push(shared.collectionId)
                    }
                })
            })
            if(sharerCollection.length > 0){
                this.setCollection(sharerCollection)
            }
        }catch(e){
            console.log(e)
        }
    }
    

    onGetSharedCollection = async ()=>{
        try{
            this.setFetching(true)
            let result = await firebaseProcessor.getDocsByQuery('join_collection',new Query('userId','==',authModel.user.id))
            await this.processSharedCollection(result)
            this.setFetching(false)
        }catch(e){
            console.log(e)
        }
    }
}
const sharedCollectionModel = new ShareCollectionModel()
export default sharedCollectionModel;