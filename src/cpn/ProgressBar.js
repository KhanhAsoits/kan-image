import { Box } from "native-base"

export const ProgressBar = ({progress,bgColor,trackColor})=>{

    return (
        <Box width={'100%'} borderRadius={50} bgColor={bgColor || 'gray.100'}>
            <Box width={progress + '%'} height={1} bgColor={trackColor}></Box>
        </Box>
    )
}