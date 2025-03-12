// importing the necessary modules 
import "./App.css"; 
import React, { Component } from 'react'; 
import { Route, Routes, BrowserRouter } from 'react-router-dom'; 
import NewsList from './Components/NewsList'; 
import AddNews from './Components/AddNews';
import NewsByTag from './Components/NewsByTag';
import 'bootstrap/dist/css/bootstrap.min.css';

// Creating the component 
class App extends Component {
  // Setting the state 
  state = {}

  // rendering the component 
  render() {
    // returning the component 
    return(
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<NewsList />} /> 
          <Route path="/addnews" element={<AddNews />} />
          <Route path="/news/tag" element={<NewsByTag /> } /> 
        </Routes>
      </BrowserRouter>
    )
  }
}

// exporting the component 
export default App; 