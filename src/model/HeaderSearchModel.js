import {makeAutoObservable} from "mobx";
import listFileModel from "./ListFileModel";

class HeaderSearchModel {
    query = ''
    loading = false
    result = []
    constructor() {
        makeAutoObservable(this)
    }

    setResult = (val)=>{this.result = val}
    setLoading = (value) => {
        this.loading = value
    }
    setQuery = (value) => {
        this.query = value
    }

    search() {
        try{
            if(!this.loading){
                this.setLoading(true)
                setTimeout(()=>{
                    if(this.query === ""){
                        this.setResult(listFileModel.files)
                        this.setLoading(false)
                        return;
                    }
                    const collection = [...this.result]
                    let searchResult = collection.filter((val)=>{
                        return val.name.includes(this.query)
                    })
                    this.setResult(searchResult)
                    this.setLoading(false)
                },300)
            }
        }catch(e){
            console.log(e)
        }

    }
}

const searchHeaderModel = new HeaderSearchModel()
export default searchHeaderModel;