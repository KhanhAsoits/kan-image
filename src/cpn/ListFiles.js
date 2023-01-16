import {observer} from "mobx-react";
import {Box, FlatList, Image} from "native-base";
import {useMemo} from "react";
import ImageRender from "./ImageRender";
import SearchHeader from "./SearchHeader";
import {useSharedValue} from "react-native-reanimated";
import ListFileModel from "../model/ListFileModel";

const ListFiles = ({isCollection}) => {
    const showMiniHeader = useSharedValue(false)
    const columnsRan = 3

    const renderFile = ({item: file, index}) => {
        return <ImageRender isCollection={isCollection} file={file} columnsRan={columnsRan}/>
    }
    const renderFilesMemo = useMemo(() => renderFile, [ListFileModel.files])

    return (
        <Box flex={1} bgColor={'black'} px={2}>
            <SearchHeader title={'Files'} showMini={showMiniHeader}/>
            <FlatList
                onScroll={(e) => {
                    if (e.nativeEvent.contentOffset.y >= 72) {
                        if (showMiniHeader.value === false) {
                            showMiniHeader.value = true
                        }
                    } else {
                        if (showMiniHeader.value === true) {
                            showMiniHeader.value = false
                        }
                    }
                }}
                ListHeaderComponentStyle={{marginVertical: 12}}
                numColumns={columnsRan || 3}
                columnWrapperStyle={{
                    flex: 1,
                    justifyContent: 'space-between'
                }}
                data={ListFileModel.files}
                renderItem={renderFilesMemo}
                keyExtractor={item => item?.id}
            />
        </Box>
    )
}
export default observer(ListFiles)