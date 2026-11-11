import 'react-toastify/dist/ReactToastify.css';
import { ToastContainer, toast } from 'react-toastify';
import './App.css';

// Hago los imports
import Navbar from './Components/Navbar';
import Content from './Components/Content';
import Footer from './Components/Footer';

function App() {


  return (
    <>
      <Navbar />
      <Content />
      <Footer />
      
      
    </>
  );
}

export default App;
