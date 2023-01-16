import {Box, Center} from "native-base";
import {formatBytes, SC_H, SC_W} from "../core/helper";
import Animated, {useAnimatedStyle, useSharedValue, withRepeat, withTiming} from "react-native-reanimated";
import {useLayoutEffect, useState} from "react";
import Ionicons from "react-native-vector-icons/Ionicons";
import firebase from "firebase/app";
import 'firebase/storage'
import {firebaseApp} from "../../filesbase.config";
import ListFileModel from "../model/ListFileModel";
import {Image, Rule, ThumbnailCollection} from '../core/types'
import 'react-native-get-random-values'
import {v4 as UUID} from 'uuid'
import AuthModel from "../model/AuthModel";

export const Uploading = ({assets, goBack = false, nav}) => {
    const [progress, setProgress] = useState([])
    const [currentUploading, setCurrentUploading] = useState({
        transferred: 0,
        progress: 0,
        total: 0,
        height: 0
    })
    const uploading = useSharedValue(.3)
    const [downloading, setDownloading] = useState(false)

    const uploadingStyle = useAnimatedStyle(() => {
        return {
            opacity: uploading.value
        }
    })
    useLayoutEffect(() => {
        if (progress.length > 0) {
            let currentProgress = (progress.reduce((cur, next) => parseFloat(cur) + parseFloat(next), 0) / progress.length).toFixed(2)
            let height = (SC_H / 4) / 100 * currentProgress
            let currentTransferred = Math.round((currentUploading.total / 100) * currentProgress)
            setCurrentUploading({
                ...currentUploading,
                progress: currentProgress,
                transferred: currentTransferred,
                height: height
            })
        }
    }, [progress])
    // uploading
    useLayoutEffect(() => {
        const sync = async () => {
            const storage = firebase.storage(firebaseApp).ref()
            //     fetch
            setDownloading(true)
            setTimeout(async () => {
                // chuan bi upload
                let blobs = []
                for (let item of assets) {
                    if (item?.uri) {
                        const file = await fetch(item?.uri)
                        const blob = await file.blob()
                        blobs.push(blob)
                    }
                }
                setTimeout(() => {
                    setDownloading(false)
                }, 500)
                // upload

                const uploadFolder = 'uploaded'
                const totalTransfer = blobs.reduce((cur, next) => cur + next._data.size, 0)
                setCurrentUploading({...currentUploading, total: totalTransfer})
                const collection = new ThumbnailCollection(UUID(), AuthModel.user.id, blobs.length, "", [], {
                    read: true,
                    write: false
                })
                const syncUpload = async (collection, blobs) => {
                    if (blobs.length > 0) {
                        for (let i = 0; i < blobs.length; i++) {
                            const filename = blobs[i]._data.name;
                            const uploadTask = storage.child(uploadFolder + "/" + filename).put(blobs[i])
                            await uploadTask.on('state_changed',
                                (state) => {
                                    let progress = (state.bytesTransferred / state.totalBytes) * 100
                                    setProgress((prev) => {
                                        const new_progress = [...prev]
                                        new_progress[i] = progress.toFixed(2)
                                        return new_progress
                                    })
                                },
                                (error) => {
                                    console.log(error)
                                },
                                async () => {
                                    const downloadUrl = await uploadTask.snapshot.ref.getDownloadURL()
                                    //     upload to firebase
                                    if (i === 0) {
                                        collection.firstImage = downloadUrl
                                        await ListFileModel.addCollection(collection)
                                    }
                                    if (i === blobs.length - 1) {

                                        await ListFileModel.getAllFile()
                                        if (goBack) {
                                            nav.goBack()
                                        }
                                    }
                                    const image = new Image(UUID(), collection.id, downloadUrl, filename, blobs[i]._data.size, new Date().getTime())
                                    await ListFileModel.addImageToCollection(image)
                                }
                            )
                        }
                    }
                }
                await syncUpload(collection, blobs)
            }, 1000)
        }
        sync()
    }, [assets])
    // end up loading
    // animate
    useLayoutEffect(() => {
        uploading.value = withRepeat(withTiming(.8, {duration: 2000}), 0, false)
    }, [])

    // end animated

    return (
        <Center flex={1} bgColor={'black'}>
            <Box borderStyle={'dashed'} justifyContent={'center'} alignItems={'center'} width={SC_W / 1.5}
                 borderWidth={3} borderRadius={18} borderColor={'gray.500'}
                 height={SC_H / 2}>
                <Animated.View>
                    <Animated.View
                        style={[{
                            borderRadius: 8,
                            width: SC_W / 3,
                            height: SC_H / 4,
                            alignSelf: 'center',
                            justifyContent: 'center',
                            alignItems: 'center',
                            position: 'relative'
                        }]}
                    >
                        <Animated.View
                            style={[{
                                width: SC_W / 3,
                                backgroundColor: 'lightblue',
                                position: 'absolute',
                                bottom: 0,
                                borderRadius: 8,
                                left: 0,
                                height: currentUploading.height
                            }]}
                        >
                        </Animated.View>
                        <Animated.View
                            style={[{
                                backgroundColor: 'black',
                                width: SC_W / 3.1,
                                height: SC_H / 4.1,
                                borderRadius: 8,
                                justifyContent: 'center',
                                alignItems: 'center'
                            }]}
                        >
                            <Animated.View style={[uploadingStyle]}>
                                <Ionicons name={'cloud-upload-outline'} color={'white'} size={50}/>
                            </Animated.View>
                            <Animated.Text style={{
                                color: 'rgba(255,255,255,.7)',
                                fontSize: 15,
                                marginTop: 8,
                            }}>{currentUploading.progress} %</Animated.Text>
                            <Animated.Text style={{
                                color: 'rgba(255,255,255,.7)',
                                fontSize: 12,
                                marginTop: 8,
                            }}>{formatBytes(currentUploading.transferred)} / {formatBytes(currentUploading.total)} </Animated.Text>
                        </Animated.View>
                    </Animated.View>
                    <Animated.Text
                        style={[uploadingStyle, {
                            marginVertical: 12,
                            fontSize: 20,
                            color: 'rgba(255,255,255,.6)'
                        }]}>{downloading ? "Đang chuẩn bị để tải lên" : "Đang tải ảnh lên"}</Animated.Text>
                </Animated.View>
            </Box>
        </Center>
    )
}