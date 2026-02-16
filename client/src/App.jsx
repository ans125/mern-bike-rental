
import './App.css'
import { Routes, Route } from "react-router-dom";

// import {Home,About,Contact} from "./pages"
import Home from "./pages/Home";
import About from "./pages/About";
import Contact from "./pages/Contact";
import Login from "./pages/Auth/Login";
import Register from "./pages/Auth/Register";
import Bike from "./pages/Bike/Bike";
import Footer from './components/Footer';
import Header from './components/Header';

function App() {

  return (
    <>
     {/* Header */}
       <Header/>
    <Routes>
      {/* Home */}
      <Route path="/" element={<Home/>} />
      <Route path="/about" element={<About/>} />
      <Route path="/contact" element={<Contact/>} />
      {/* Auth */}
      <Route path="/login" element={<Login/>} /> 
      <Route path="/register" element={<Register/>} />
      {/* Bike */}
       <Route path="/bike" element={<Bike/>} />
      </Routes>
       {/* Footer */}
       <Footer/>
    </>
  )
}

export default App
