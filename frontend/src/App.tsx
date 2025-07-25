import { Route, Routes } from "react-router-dom";
import HomePage from "./pages/home/HomePage";
import AuthCallbackPage from "./pages/auth-callback/AuthCallbackPage";
import { AuthenticateWithRedirectCallback } from "@clerk/clerk-react";
import MainLayout from "./layout/MainLayout";
import ChatPage from "./pages/chat/ChatPage";
import AlbumPage from "./pages/album/AlbumPage";
import AdminPage from "./pages/admin/AdminPage";
import SearchPage from "./pages/search/SearchPage";
import { Toaster } from "react-hot-toast";
import NotFoundPage from "./pages/404/NotFoundPage";
import FullScreenPlayerPage from "./pages/player/FullScreenPlayerPage";
import AudioPlayer from "./layout/components/AudioPlayer";
import ExplorePage from "./pages/explore/ExplorePage";

function App() {
	return (
		<>
			<AudioPlayer />
			<Routes>
				<Route
					path='/sso-callback'
					element={<AuthenticateWithRedirectCallback signUpForceRedirectUrl={"/auth-callback"} />}
				/>
				<Route path='/auth-callback' element={<AuthCallbackPage />} />
				<Route path='/admin' element={<AdminPage />} />

				<Route element={<MainLayout />}>
					<Route path='/' element={<HomePage />} />
					<Route path='/search' element={<SearchPage />} />
					<Route path='/chat' element={<ChatPage />} />
					<Route path='/albums/:albumId' element={<AlbumPage />} />
					<Route path='/explore' element={<ExplorePage />} />
					<Route path='*' element={<NotFoundPage />} />
				</Route>

        {/* Full screen player route (no MainLayout) */}
        <Route path='/player/fullscreen' element={<FullScreenPlayerPage />} />
			</Routes>
			<Toaster />
		</>
	);
}

export default App;
