import {makeAutoObservable} from "mobx";

class HeaderSearchModel {

    query = ''
    loading = false

    constructor() {
        makeAutoObservable(this)
    }

    setLoading = (value) => {
        this.loading = value
    }
    setQuery = (value) => {
        this.query = value
    }

    search() {
    }
}

const searchHeaderModel = new HeaderSearchModel()
export default searchHeaderModel;