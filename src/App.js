import { Container, useColorModeValue } from '@chakra-ui/react';
import './App.css';
import Home from './Pages/Home';

function App() {
  const bg = useColorModeValue('white', 'black')
  const color = useColorModeValue('black', 'white')

  return (
    <Container maxW={'none'} className="App" bg={bg} color={color}>
      <Home />
    </Container>
  );
}

export default App;
