import { ResizablePanelGroup, ResizablePanel, ResizableHandle } from "@/components/ui/resizable";
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
			{isMobile ? (
				<>
					<AudioPlayer />
					{/* left sidebar */}
					<div
						className={`fixed inset-y-0 left-0 z-20 w-64 bg-black transition-transform duration-300 ${
							sidebarOpen ? "translate-x-0" : "-translate-x-full"
						}`}
					>
						<LeftSidebar isMobile={isMobile} setSidebarOpen={setSidebarOpen} />
					</div>
					{/* Main content */}
					<div className='flex-1 min-w-0 flex flex-col'>
						<Outlet />
					</div>
				</>
			) : (
				<ResizablePanelGroup direction='horizontal' className='flex-1 flex h-full overflow-hidden p-2'>
					<AudioPlayer />
					{/* left sidebar */}
					<ResizablePanel defaultSize={20} minSize={10} maxSize={30}>
						<LeftSidebar />
					</ResizablePanel>
					<ResizableHandle className='w-2 bg-black rounded-lg transition-colors' />
					{/* Main content */}
					<ResizablePanel defaultSize={60} minSize={40}>
						<Outlet />
					</ResizablePanel>
					{(
						<>
							<ResizableHandle className='w-2 bg-black rounded-lg transition-colors' />
							<ResizablePanel defaultSize={20} minSize={0} maxSize={25} collapsedSize={0}>
								<FriendsActivity />
							</ResizablePanel>
						</>
					)}
				</ResizablePanelGroup>
			)}
			<PlaybackControls />
		</div>
	);
};
export default MainLayout;
