
import { useNavigate } from 'react-router-dom';
import '../page_styles/purchase.css';

const LoginPage = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleLogin = (event) => {
    event.preventDefault();
    // Perform login logic here
    console.log("Logging in with:", username, password);
    // After login, navigate to a different page, e.g., user profile
    // navigate('/profile');
  };

  const handleSignUpRedirect = () => {
    // Redirect user to the sign-up page
    navigate('/signup');
  };

  return (
    <div className="login-container">
      <h1>Login</h1>
      <form onSubmit={handleLogin}>
        <div className="form-group">
          <label htmlFor="username">Username</label>
          <input
            type="text"
            id="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="password">Password</label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <button type="submit">Log In</button>
      </form>
      <p className="signup-redirect">
        Don't have an account? <button onClick={handleSignUpRedirect}>Sign Up</button>
      </p>
    </div>
  );
};

export default LoginPage;