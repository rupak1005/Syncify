import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from "@/components/ui/resizable";
import { Outlet } from "react-router-dom";
import LeftSidebar from "./components/LeftSidebar";
import FriendsActivity from "./components/FriendsActivity";
import AudioPlayer from "./components/AudioPlayer";
import { PlaybackControls } from "./components/PlaybackControls";
import { useEffect, useState } from "react";
import { Menu } from "lucide-react";

const MainLayout = () => {
	const [isMobile, setIsMobile] = useState(false);
	const [sidebarOpen, setSidebarOpen] = useState(false);

	useEffect(() => {
		const checkMobile = () => {
			setIsMobile(window.innerWidth < 768);
		};

		checkMobile();
		window.addEventListener("resize", checkMobile);
		return () => window.removeEventListener("resize", checkMobile);
	}, []);

	return (
		<div className='h-screen bg-black text-white flex flex-col'>
			{/* Hamburger button for mobile when sidebar is closed */}
			{isMobile && !sidebarOpen && (
				<button
					className='fixed top-4 left-4 z-30 p-2 rounded-md bg-zinc-900/80 hover:bg-zinc-800 md:hidden'
					onClick={() => setSidebarOpen(true)}
					aria-label='Open sidebar'
				>
					<Menu className='w-6 h-6' />
				</button>
			)}
			<ResizablePanelGroup direction='horizontal' className='flex-1 flex h-full overflow-hidden p-2'>
				<AudioPlayer />

				{/* left sidebar */}
				{isMobile ? (
					<div
						className={`fixed inset-y-0 left-0 z-20 w-64 bg-black transition-transform duration-300 ${
							sidebarOpen ? "translate-x-0" : "-translate-x-full"
						}`}
					>
						<LeftSidebar isMobile={isMobile} sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
					</div>
				) : (
					<div className="static w-64 bg-transparent">
						<LeftSidebar />
					</div>
				)}

				{/* Main content */}
				<div className='flex-1 min-w-0 flex flex-col'>
					<Outlet />
				</div>

				{/* right sidebar only on desktop */}
				{!isMobile && (
					<div className='hidden md:block w-72 ml-2'>
						<FriendsActivity />
					</div>
				)}
			</ResizablePanelGroup>

			<PlaybackControls />
		</div>
	);
};
export default MainLayout;
