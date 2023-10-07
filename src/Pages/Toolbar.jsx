import { Accordion, AccordionButton, AccordionIcon, AccordionItem, AccordionPanel, Box, Button, Checkbox, CloseButton, Flex, List, ListItem, useColorMode, } from "@chakra-ui/react";
import { useMemo, useState } from "react";

const Toolbar = () => {
    const { colorMode } = useColorMode()
    const dark = useMemo(() => colorMode === 'dark', [colorMode])
    const [open, setOpen] = useState(false)

    return <Box className="fixed bottom-5 min-w-[200px] max-w-[20%] p-2 rounded-lg" bg={dark ? '#2C2C2C' : '#D8E8FE'}>
        <Flex alignItems={"center"} gap={2} p={open ? 1 : 0}>
            <Button bg={dark ? '#2C2C2C' : '#D8E8FE'} size={'sm'} fontSize={'md'} fontWeight={500} boxShadow={open && 'lg'} variant={open ? 'solid' : 'ghost'} className='w-full min-h-0' onClick={() => setOpen((prev) => !prev)} >
                Filters
            </Button>
            {open && <CloseButton boxShadow={'lg'} onClick={() => setOpen((prev) => !prev)} />}
        </Flex>
        {open && <ToolbarItems />}
    </Box>;
}

const ToolbarItems = () => <Accordion className="max-h-[70vh] overflow-y-auto" defaultIndex={[0]} allowMultiple>{[1, 2, 3, 4,].map((item) =>
    <AccordionItem p={0} border={'1px solid rgba(255, 255, 255, 0.16)'} className="m-1 my-2 rounded-lg shadow-lg hover:rounded-lg">
        <AccordionButton className="rounded-lg">
            <Box as="span" flex='1' textAlign='left'>
                Filter By -
            </Box>
            <AccordionIcon />
        </AccordionButton>
        <AccordionPanel pb={4} pt={1}>
            <List spacing={1} >
                {[1, 2, 3].map((item) => <ListItem className="flex gap-3 items-center">
                    <Checkbox></Checkbox>
                    Lorem
                </ListItem>)}
            </List>
        </AccordionPanel>
    </AccordionItem>
)}</Accordion>

export default Toolbar;