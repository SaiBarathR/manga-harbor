import { Box } from '@chakra-ui/react';
import { RouterProvider } from 'react-router-dom';
import { router } from './routes/route';
import './App.css';

function App() {
  return (
    <Box className="min-h-screen w-full bg-light-bg dark:bg-dark-bg transition-colors duration-200">
      <RouterProvider router={router} />
    </Box>
  );
}

export default App;
