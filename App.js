import AsyncStorage from '@react-native-async-storage/async-storage';
import { useLayoutEffect } from 'react';
import {AppState, LogBox, Platform} from 'react-native';
import { DownloadInfo, Query } from './src/core/types';
import downloadManagerModel from './src/model/DownloadManagerModel';
import AppNav from "./src/navs/AppNav";
import { observer } from 'mobx-react';
import listFileModel from './src/model/ListFileModel';
import firebaseProcessor from './src/model/FirebaseProcessor';

export default observer(function App() {
    LogBox.ignoreAllLogs(true)
    return (
        <AppNav/>
    );
})