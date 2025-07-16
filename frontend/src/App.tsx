import {
  SignedIn,
  SignedOut,
  SignInButton,
  UserButton,
} from "@clerk/clerk-react";
import { Button } from "./components/ui/button";
import "./index.css";
import { Routes, Route } from "react-router-dom";
import
HomePage from "./pages/Home/HomePage";
import AuthCallbackPage from "./pages/auth-callback/AuthCallbackPage";
import { AuthenticateWithRedirectCallback } from "@clerk/clerk-react";
// import Topbar from "./components/Topbar";
function App() {
  return (
    <>
    <Routes>
    <Route path="/" element={<HomePage />} />
     <Route
					path='/sso-callback'
					element={<AuthenticateWithRedirectCallback signUpForceRedirectUrl={"/auth-callback"} />}
				/>
				<Route path='/auth-callback' element={<AuthCallbackPage />} />
        </Routes>
    </>
  );
}

export default App;
