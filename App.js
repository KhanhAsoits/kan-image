import {LogBox} from 'react-native';
import AppNav from "./src/navs/AppNav";

export default function App() {
    LogBox.ignoreAllLogs(true)
    return (
        <AppNav/>
    );
}