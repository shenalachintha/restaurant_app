
import './App.css';
import {Container, Typography} from '@mui/material'
import Order from './Components/Order/Order';


function App() {
  return (
    <Container maxWidth="md">
      <Typography variant='h2'
      gutterBottom
      align='center'
      >
        Restaurant App
      </Typography>
      <Order />
      </Container>
  );
}

export default App;
