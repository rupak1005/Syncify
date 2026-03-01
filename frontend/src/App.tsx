import { Route, Routes } from "react-router-dom";
import { lazy, Suspense } from "react";
import { AuthenticateWithRedirectCallback } from "@clerk/clerk-react";
import MainLayout from "./layout/MainLayout";
import { Toaster } from "react-hot-toast";
import AudioPlayer from "./layout/components/AudioPlayer";
import { Loader } from "lucide-react";

const HomePage = lazy(() => import("./pages/home/HomePage"));
const AuthCallbackPage = lazy(() => import("./pages/auth-callback/AuthCallbackPage"));
const ChatPage = lazy(() => import("./pages/chat/ChatPage"));
const AlbumPage = lazy(() => import("./pages/album/AlbumPage"));
const AdminPage = lazy(() => import("./pages/admin/AdminPage"));
const SearchPage = lazy(() => import("./pages/search/SearchPage"));
const NotFoundPage = lazy(() => import("./pages/404/NotFoundPage"));
const FullScreenPlayerPage = lazy(() => import("./pages/player/FullScreenPlayerPage"));
const ExplorePage = lazy(() => import("./pages/explore/ExplorePage"));

const PageLoader = () => (
	<div className='h-screen w-full flex items-center justify-center bg-black'>
		<Loader className='size-8 text-blue-500 animate-spin' />
	</div>
);

function App() {
	return (
		<>
			<AudioPlayer />
			<Suspense fallback={<PageLoader />}>
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
			</Suspense>
			<Toaster />
		</>
	);
}

export default App;
