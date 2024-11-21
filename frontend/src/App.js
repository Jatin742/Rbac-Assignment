import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import './App.css';
import Home from "./Components/Home/Home";
import Header from "./Components/Header/Header";
import Event from "./Components/Event/Event";
import LoginSignUp from "./Components/LoginSignUp/LoginSignUp";
import { useEffect } from "react";
import store from "./store";
import { loadUser } from "./Actions/userAction";
import { useSelector } from "react-redux";
import CreateEvent from "./Components/CreateEvent/CreateEvent";
import ProtectedRoute from "./ProtectedRoute/ProtectedRoute";
import AllAdminEvents from "./Admin/Events/AllAdminEvents";
import MyEvents from "./Components/MyEvents/MyEvents";
import AllAdminUsers from "./Admin/Users/AllAdminUsers";
import UpdateEvent from "./Admin/Events/UpdateEvent/UpdateEvent";
import CreateUser from "./Admin/CreateUser/CreateUser";
import UpdateUser from "./Admin/Users/UpdateUser/UpdateUser";

function App() {
  // const host=process.env.REACT_APP_BACKEND_HOST;
  const { isAuthenticated } = useSelector(state => state.user);
  useEffect(() => {
    try {
      store.dispatch(loadUser());
    } catch (error) {
    }
  }, []);
  return (
    <Router>
      <Header />
      <Routes>
        <Route exact path="/" element={<Home />} />
        <Route exact path="/event/:id" element={<Event />} />
        <Route exact path="/login" element={<LoginSignUp />} />
        <Route exact path="/user/events" element={<ProtectedRoute isAuthenticated={isAuthenticated}  Component={MyEvents}/>}/>
        <Route exact path="/admin/create-event" element={<ProtectedRoute isAuthenticated={isAuthenticated} isAdmin={true} Component={CreateEvent}/>}/>
        <Route exact path="/admin/create-user" element={<ProtectedRoute isAuthenticated={isAuthenticated} isAdmin={true} Component={CreateUser}/>}/>
        <Route exact path="/admin/all-events" element={<ProtectedRoute isAuthenticated={isAuthenticated} isAdmin={true} Component={AllAdminEvents}/>}/>
        <Route exact path="/admin/event/:id" element={<ProtectedRoute isAuthenticated={isAuthenticated} isAdmin={true} Component={UpdateEvent}/>}/>
        <Route exact path="/admin/all-users" element={<ProtectedRoute isAuthenticated={isAuthenticated} isAdmin={true} Component={AllAdminUsers}/>}/>
        <Route exact path="/admin/user/:id" element={<ProtectedRoute isAuthenticated={isAuthenticated} isAdmin={true} Component={UpdateUser}/>}/>
      </Routes>
    </Router>
  );
}

export default App;
