import firebase from 'firebase/app'
import 'firebase/firestore'
import {Query, User} from "../core/types";
import 'react-native-get-random-values'
import {v4 as UUID} from 'uuid'
import {getChildObjects} from "../core/helper";
import firebaseApp from "../../filesbase.config";

class FirebaseProcessor {
    constructor() {
        this.firestore = firebase.firestore(firebaseApp)
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

    addDocToCollection = async (collection, doc) => {
        try {
            await this.firestore.collection(collection).add({...doc})
            return true
        } catch (e) {
            console.log(e)
            return false
        }
    }
    addDocsToCollection = async (collection, docs) => {
        try {

        } catch (e) {
            console.log(e)
        }
    }
}

const firebaseProcessor = new FirebaseProcessor()
export default firebaseProcessor