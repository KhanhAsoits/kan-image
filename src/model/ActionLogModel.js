import { makeAutoObservable } from "mobx";
import { LogEntry } from "../core/types";
import firebaseProcessor from "./FirebaseProcessor";

class ActionLogModel{
    constructor(){
        makeAutoObservable(this)
    }
    
    setLog = async(logEntry)=>{
        try{
            if(logEntry instanceof LogEntry){
                await firebaseProcessor.addDocToCollection('logs',logEntry)
            }else{
                console.log('Type err : log entry non-type LogEntry')
            }
        }catch(e){

        }
    }

    // real time update log by user

    // real time update log with collection


    // realtime update log with images

}
const actionLogModel = new ActionLogModel()
export default actionLogModel;