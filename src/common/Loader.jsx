import { Spinner } from '@chakra-ui/react'

export default function Loader() {
    return (
        <div className="flex justify-center items-center h-screen gap-4 flex-col md:flex-row">
            <Spinner
                thickness='4px'
                speed='0.65s'
                emptyColor='gray.800'
                color='blue.500'
                size='xl'
            />
        </div>

    )
}
