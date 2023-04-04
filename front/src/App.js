import './App.css';
import { BrowserRouter } from "react-router-dom";
import Navbar from "./components/Navbar.jsx";
import Routeur from "./components/Router.jsx";
import Footer from "./components/Footer.jsx";

function App() {

  return (
    <BrowserRouter>   {/*initialise le router*/}
      <Navbar />      {/*la navbar presente sur toutes les pages*/}
      <Routeur />     {/*le composents a afficher*/}
      <Footer />      {/*le footer present sur toutes les pages*/}
    </BrowserRouter>
  );

}

export default App;
