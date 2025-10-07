import { BrowserRouter, Routes, Route } from "react-router-dom";
import "primereact/resources/themes/saga-blue/theme.css";
import "primereact/resources/primereact.min.css";
import "primeicons/primeicons.css";
import Login from "./pages/Login";
import Register from "./pages/Register";
import ForgotPassword from "./pages/ForgotPassword";
import ChangePassword from "./pages/ChangePassword";
import "./App.css";
import Home from "./pages/Home";
import PrivateRouteLayout from "./component/layout/PrivateRouteLayout";
import LayoutBasic from "./component/layout/LayoutBasic";
import ResetPassword from "./pages/ResetPassword";
import { AuthProvider } from "./service/AuthContext";
import PersonListPage from "./pages/PersonListPage";
import PersonEdit from "./pages/PersonEdit";
import ProfileListPage from "./pages/ProfileList";
import ProfileFormPage from "./pages/ProfileForm";
import CategoryListPage from "./pages/CategoryListPage";
import CategoryForm from "./pages/CategoryForm";
import AuctionListPage from "./pages/AuctionListPage";
import AuctionForm from "./pages/AuctionForm";
import PublicAuctionsPage from "./pages/PublicAuctionsPage";

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route element={<PrivateRouteLayout />}>
            <Route path="/home" element={<LayoutBasic><Home /></LayoutBasic>} />
            <Route path="/profile" element={<LayoutBasic><ProfileListPage /></LayoutBasic>} />
            <Route path="/profile/novo" element={<LayoutBasic><ProfileFormPage /></LayoutBasic>} />
            <Route path="/pessoas" element={<LayoutBasic><PersonListPage /></LayoutBasic>} />
            <Route path="/pessoas/:id" element={<LayoutBasic><PersonEdit /></LayoutBasic>} />
            <Route path= "/categorias"  element={<LayoutBasic><CategoryListPage /></LayoutBasic>} />
            <Route path= "/categorias/novo"  element={<LayoutBasic><CategoryForm /></LayoutBasic>} />
            <Route path= "/categorias/:id"  element={<LayoutBasic><CategoryForm /></LayoutBasic>} />
            <Route path= "/leiloes"  element={<LayoutBasic><AuctionListPage /></LayoutBasic>} />
            <Route path= "/leiloes/novo"  element={<LayoutBasic><AuctionForm /></LayoutBasic>} />
            <Route path= "/leiloes/:id"  element={<LayoutBasic><AuctionForm /></LayoutBasic>} />
          </Route>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password" element={<ResetPassword />} />
        <Route path="/change-password" element={<ChangePassword />} />
        <Route path="/" element={<PublicAuctionsPage />} />
      </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
