import { Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";
import Layout from "./components/Layout";

// Placeholder Pages (Create these simple files in /pages if you haven't yet)
import Dashboard from "./pages/Dashboard";
import Login from "./pages/Login";
// import AddProduct from "./pages/AddProduct";

function App() {
  return (
    <AuthProvider>
      <Routes>
        {/* Public Route */}
        <Route path="/login" element={<Login />} />

        {/* Private Routes Wrapper */}
        <Route element={<ProtectedRoute />}>
          <Route element={<Layout />}>
            <Route path="/" element={<Dashboard />} />
            {/* <Route path="/add" element={<AddProduct />} />*/}
          </Route>
        </Route>
      </Routes>
    </AuthProvider>
  );
}

export default App;
