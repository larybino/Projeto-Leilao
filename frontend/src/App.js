import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";
import ForgotPassword from "./pages/ForgotPassword";
import ChangePassword from "./pages/ChangePassword";
import "./App.css";
import Home from "./pages/Home";
import PrivateRouteLayout from "./component/layout/PrivateRouteLayout";
import LayoutBasic from "./component/layout/LayoutBasic";
import ProfileService from "./service/ProfileService";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<PrivateRouteLayout />}>
          <Route path="/" element={<LayoutBasic><Home /></LayoutBasic>} />
          <Route path="/profile" element={<LayoutBasic><ProfileService /></LayoutBasic>} />
        </Route>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/change-password" element={<ChangePassword />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
