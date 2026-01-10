import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../supabaseClient";

const Login = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg("");

    try {
      const { error } = supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;

      navigate("/");
    } catch (error) {
      setErrorMsg(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSingup = async () => {
    setLoading(true);
    const { error } = await supabase.auth.signUp({
      email,
      password,
    });
    if (error) setErrorMsg(error.message);
    else setErrorMsg("Check your email for the confirm link!");
    setLoading(false);
  };

  return (
    <div id="login-page">
      <div id="login-holder">
        <h2>Profit Tracker</h2>

        {errorMsg && <div>{errorMsg}</div>}

        <form id="login-form" onSubmit={handleLogin}>
          <div className="input-group">
            <label>Email:</label>
            <input
              type="email"
              required
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div className="input-group">
            <label>Password:</label>
            <input
              type="password"
              required
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <button type="submit">{loading ? "Logging in" : "Log in"}</button>
        </form>

        <div id="login-signup">
          <p>Don't have an account?</p>
          <button onClick={handleSingup}>Sign up</button>
        </div>
      </div>
    </div>
  );
};

export default Login;
