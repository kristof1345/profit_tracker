import { Outlet, Link, useNavigate } from "react-router-dom";
import { supabase } from "../supabaseClient";

const Layout = () => {
  const navigate = useNavigate();

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate("/login");
  };

  return (
    <div className="app-container">
      <nav
        style={{
          padding: "1rem",
          borderBottom: "1px solid #ccc",
          marginBottom: "1rem",
        }}
      >
        <Link to="/" style={{ marginRight: "1rem" }}>
          Dashboard
        </Link>
        <Link to="/add" style={{ marginRight: "1rem" }}>
          Add Product
        </Link>
        <button onClick={handleLogout}>Logout</button>
      </nav>

      {/* This works like a placeholder where the page content will go */}
      <main>
        <Outlet />
      </main>
    </div>
  );
};

export default Layout;
