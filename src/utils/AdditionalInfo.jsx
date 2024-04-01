import {
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalCloseButton,
    ModalBody,
    useDisclosure,
    Text,
    Link,
    ModalFooter,
    IconButton,
    Tooltip
} from "@chakra-ui/react";
import { WarningIcon } from '@chakra-ui/icons'

export default function AdditionalInfo() {
    const { isOpen, onOpen, onClose } = useDisclosure()

    return (
        <>
            <Tooltip label="Additional Info" hasArrow arrowSize={10}>
                <IconButton aria-label="Additional Info" icon={<WarningIcon />} onClick={onOpen} minW={'none'} width={'32px'} height={'32px'} rounded={'full'} />
            </Tooltip>
            <Modal onClose={onClose} isOpen={isOpen} isCentered>
                <ModalOverlay
                    bg='blackAlpha.300'
                    backdropFilter='blur(10px) hue-rotate(90deg)'
                />
                <ModalContent>
                    <ModalHeader>Additional Details</ModalHeader>
                    <ModalCloseButton />
                    <ModalBody>
                        <Text>
                            This application is developed for educational purposes only. The data is fetched from the internet and may not be accurate. The application is not affiliated with any manga hosting website.
                            <br />
                            <br />
                            Currently the application is in development and may not be fully functional. Only chapter download feature is available due to heroku's request timeout limit which will be fixed in the future.
                            If you want to use the application to its full potential, you can clone the repository and run it locally with all its features.
                        </Text>
                    </ModalBody>
                    <ModalFooter>
                        <Link href="https://github.com/SaiBarathR/manga-harbor" isExternal color='blue.500'>
                            Source Code
                        </Link>
                    </ModalFooter>
                </ModalContent>
            </Modal>
        </>
    )
}