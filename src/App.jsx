import { Center, Container, useColorModeValue } from '@chakra-ui/react';
import './App.css';
import Home from './Pages/Home';
import { RouterProvider } from 'react-router-dom';
import { router } from './routes/route';
import { Box } from '@chakra-ui/react';

function App() {
  const bg = useColorModeValue('white', 'black')
  const color = useColorModeValue('black', 'white')

  return (
    <Container maxW={'none'} className="App" bg={bg} color={color}>
      <Center >
        <Box className="max-w-[2560px] w-full">
          <RouterProvider router={router} />
        </Box>
      </Center>
    </Container>
  );
}

export default App;
