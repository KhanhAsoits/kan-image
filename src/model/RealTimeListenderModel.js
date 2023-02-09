import { makeAutoObservable } from "mobx";

class RealTimeListenerModel{

    collectionSync = false

    syncing = false;
    constructor(){
        makeAutoObservable(this)
    }
    setSyncing = (val)=>{this.syncing = val}

    setCollectionSync = (val)=>{this.collectionSync = val}
    
}
const realtimeListenerModel = new RealTimeListenerModel()
export default realtimeListenerModel;