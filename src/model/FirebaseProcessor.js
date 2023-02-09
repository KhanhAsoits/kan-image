import firebase from 'firebase/app'
import 'firebase/firestore'
import {Query, User} from "../core/types";
import 'react-native-get-random-values'
import {v4 as UUID} from 'uuid'
import {getChildObjects} from "../core/helper";
import firebaseApp from "../../filesbase.config";
import authModel from './AuthModel';
import listFileModel from './ListFileModel';

class FirebaseProcessor {
    constructor() {
        this.firestore = firebase.firestore(firebaseApp)
    }

    deleteCollectionById = async (doc)=>{
        try{
            this.firestore.collection('files').doc(doc.docId).update({...doc,state:false})
        }catch(e){
            console.log('fireabase err :',e)
        }
    }
    updateCollectionById = async(collection,doc)=>{
        try{
            
            this.firestore.collection(collection).doc(doc.docId).update({...doc})
        }catch(e){
            console.log('fireabase err :',e)
        }
    }
    // user
    getUserByEmail = async (email) => {
        try {
            if (email !== "") {
                const userRef = this.firestore.collection("users")
                //     find by email query
                let docs = await userRef.where("email", "==", email).get()
                return getChildObjects(docs)
            } else {
                return []
            }
        } catch (e) {
            console.log(e)
        }
    }
    createNewUser = async (email, password) => {
        try {
            const user = new User(UUID(), "User_" + UUID(), email, password, "", new Date().getTime())
            return {result: this.addDocToCollection('users', user), user: user}
        } catch (e) {
            console.log(e)
        }
    }
    //
    getDocsByQuery = async (collection, query = new Query()) => {
        try {
            let result = await this.firestore.collection(collection).where(query.path, query.cond, query.value).get()
            return getChildObjects(result)
        } catch (e) {
            console.log(e)
        }
    }
    getRealTimeDocsByQuery = async(collection,query = new Query(),listener)=>{
        try{
            await this.firestore.collection(collection).where(query.path, query.cond, query.value).onSnapshot(listener)
        }catch(e){
            console.log(e)
        }
    }

    getDownloadingTask = async()=>{
        try {
            let result = await this.firestore.collection('download_tasks').where('userId',"==",authModel.user.id).get()
            return getChildObjects(result)
        } catch (e) {
            console.log(e)
            return false
        }
    }

    addDocToCollection = async (collection, doc) => {
        try {
            await this.firestore.collection(collection).add({...doc})
            return true
        } catch (e) {
            console.log(e)
            return false
        }
    }
    updateDownloadTask = async(doc)=>{
        try {
            console.log('update')
            await this.firestore.collection('download_tasks').doc(doc.docId).update({...doc})
        } catch (e) {
            console.log(e)
        }
    }
    addDocsToCollection = async (collection, docs) => {
        try {

        } catch (e) {
            console.log(e)
        }
    }
    deletedDownloadTask = async ()=>{
        try{
            console.log('deleted')
            let downloadTasks = await this.firestore.collection('download_tasks').where('userId',"==",authModel.user.id).get()
            let objs = getChildObjects(downloadTasks)
            objs.forEach(async(val)=>{
                await this.firestore.collection('download_tasks').doc(val.docId).delete()
            })
        }catch(e){
            console.log(e)
        }
    }
}

const firebaseProcessor = new FirebaseProcessor()
export default firebaseProcessor