import { AccordionButton, AccordionIcon, AccordionItem, AccordionPanel, Box, List, ListItem, Progress, Text } from "@chakra-ui/react"

export const PreparingForDownloadList = ({ dispatch, preparingZips }) => {

    console.log("preparingZips:", preparingZips)

    return <AccordionItem p={0} border={'none'} className="m-1 rounded-lg shadow-lg hover:rounded-lg">
        <AccordionButton className="rounded-lg ">
            <Box as="span" flex='1' textAlign='left'>
                Preparing Zip Files
            </Box>
            <AccordionIcon />
        </AccordionButton>
        <AccordionPanel pb={4} pt={1}>
            <List spacing={3}>
                {preparingZips.map((preparingZipsItem, index) => {
                    return preparingZipsItem.chapters.length > 0 && preparingZipsItem.chapters.map((item, index) => <PreparingForDownloadListItem key={item + index} name={preparingZipsItem.name + " Chapter: " + item} />)
                })}
                {preparingZips.map((preparingZipsItem, index) => {
                    return preparingZipsItem.volumes.length > 0 && preparingZipsItem.volumes.map((item, index) => <PreparingForDownloadListItem key={item + index} name={preparingZipsItem.name + " Volume: " + item} />)
                })}
            </List>
        </AccordionPanel>
    </AccordionItem>
}

const PreparingForDownloadListItem = ({ name }) => {
    return <ListItem className="p-4 rounded-lg shadow-xl" background={'#000000'}>
        <Box className="flex gap-3 items-center">
            <Text>{name || ''}</Text>
        </Box>
        <Box my={2} className="block">
            <Progress rounded={'md'} colorScheme='green' size='sm' isIndeterminate={true} />
        </Box>
    </ListItem>
}