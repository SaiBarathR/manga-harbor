import { Center, Container, useColorModeValue } from '@chakra-ui/react';
import './App.css';
import { RouterProvider } from 'react-router-dom';
import { router } from './routes/route';
import { Box } from '@chakra-ui/react';

function App() {
  const bg = useColorModeValue('white', 'black')
  const bgGradient = useColorModeValue('linear(to-r, gray.500, blue.500)', 'linear(to-r, gray.900, gray.900)')
  const color = useColorModeValue('black', 'white')

  return (
    <Container maxW={'none'} className="App" bg={bg} bgGradient={bgGradient} color={color}>
      <Center>
        <Box className="max-w-[2560px] w-full">
          <RouterProvider router={router} />
        </Box>
      </Center>
    </Container>
  );
}

export default App;
