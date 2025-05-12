import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css"; 

import Navbar from './components/Navbar/Navbar'; 
import Home from "./components/Home/Home.js";
import DressListPage from "./components/DressList/DressListPage.js";
import DressDetail from "./components/DressDetail/DressDetail.js";
import UploadDress from "./components/UploadDressForm/UploadDressForm.js"
import About from "./components/AboutSite/AboutSite.js"
import Login from "./components/Login/Login.js"
import AddDressAdmin from "./components/AddDressAdmin/AddDressAdmin.js"
import Footer from './components/Footer/Footer'; 
import CatalogPage from './components/CatalogPage/CatalogPage.js'; 
import AboutMe from './components/AboutMe/AboutMe.js'; 


function App() {
  return (
    <Router>
      <Navbar />
      <div className="container">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/dresses" element={<DressListPage />} />
          <Route path="/dress/:id" element={<DressDetail />} />
          <Route path="/upload/" element={<UploadDress />} />
          <Route path="/login/" element={< Login />} />
          <Route path="/add-dress" element={<AddDressAdmin />} />
          <Route path="/about" element={<About />} />
          <Route path="/catalog" element={<CatalogPage />} />
          <Route path="/developer" element={<AboutMe />} />
        </Routes>
      </div>
      <Footer /> 
    </Router>
  );
}

export default App;
