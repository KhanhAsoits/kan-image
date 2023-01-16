import {Dimensions} from "react-native";

export const SC_W = Dimensions.get('window').width
export const SC_H = Dimensions.get('window').height

export const getChildObjects = (docs) => {
    let children = []
    docs.forEach((docRef) => {
        children.push(docRef.data())
    })
    return children;
}
export const getChildObject = (doc) => {
    return doc.data()
}

export function formatBytes(bytes, decimals = 2) {
    if (!+bytes) return '0 Bytes'

    const k = 1024
    const dm = decimals < 0 ? 0 : decimals
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB']

    const i = Math.floor(Math.log(bytes) / Math.log(k))

    return `${parseFloat((bytes / Math.pow(k, i)).toFixed(dm))} ${sizes[i]}`
}
