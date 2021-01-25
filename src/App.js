// import logo from './logo.svg';
//import './App.css';
import "bootstrap/dist/css/bootstrap.min.css"
import {BrowserRouter as Router, Route} from "react-router-dom" //used to route the requests

//import all the components you built to use with the app
import Navbar from "./components/navbar.component.js";
import UploadImage from "./components/upload_image.component";
import EditExercise from "./components/edit-exercises.component";
import ViewGallery from "./components/view-gallery.component";
import CreateExercise from "./components/create-exercise.component"; 
import SignUp from "./components/sign-up.component";
import SignIn from "./components/sign-in.component.js";
import ReactNotifications from 'react-notifications-component';

//add the components to the router
function App() {
  return (
    <Router>
      <ReactNotifications />
      <Navbar/>
      <br/>
      <Route path="/upload" component={UploadImage} />
      <Route path="/" exact component={ViewGallery} />
      <Route path="/signup" component={SignUp} />
      <Route path="/user" component={SignIn} />
    </Router>  
    
  );
}

export default App;
