import {makeAutoObservable} from "mobx";
import {User} from "../core/types";
import FirebaseModel from './FirebaseProcessor'
import {Alert} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

class AuthModel {

    fetching = false
    isLogin = false
    user = new User()
    authInfo = {
        email: '',
        password: ''
    }

    constructor() {
        makeAutoObservable(this)
    }

    setIsLogin = (val) => {
        this.isLogin = val
    }
    setAuthInfo = (value) => {
        this.authInfo = value
    }
    setFetching = (value) => {
        this.fetching = value
    }

    setUser = (value) => {
        this.user = value
    }
    onLogout = async ()=>{
        try{
            this.setFetching(true)
            setTimeout(async()=>{
                this.setUser(null)
                await AsyncStorage.removeItem('@auth_email')
                this.setFetching(false)
            },300)
        }catch(e){
            console.log(e)
        }
    }
    onLogin = async (email, autoLogin = false) => {
        try {
            this.setFetching(true)
            setTimeout(async () => {
                const user = await FirebaseModel.getUserByEmail(email);
                if (user.length === 0) {
                    let result = await FirebaseModel.createNewUser(this.authInfo.email, this.authInfo.password)
                    if (result.result === true) {
                        this.setUser(result.user)
                    }
                } else {
                    if (!autoLogin) {
                        if (user[0].password === this.authInfo.password) {
                            this.setUser(user[0])
                        } else {
                            Alert.alert("Thông báo", "Mật khẩu không chính xác.")
                        }
                    } else {
                        this.setUser(user[0])
                    }
                }
                this.setFetching(false)
            }, 500)
        } catch (e) {
            console.log(e)
        }
    }

}

const authModel = new AuthModel()
export default authModel;