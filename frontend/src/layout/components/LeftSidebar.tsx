import PlaylistSkeleton from "@/components/skeletons/PlaylistSkeleton";
import { buttonVariants } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import { useMusicStore } from "@/stores/useMusicStore";
import { SignedIn } from "@clerk/clerk-react";
import { HomeIcon, Library, MessageCircle, X } from "lucide-react";
import { useEffect } from "react";
import { Link } from "react-router-dom";

interface LeftSidebarProps {
	isMobile?: boolean;
	setSidebarOpen?: (open: boolean) => void;
}

const LeftSidebar = ({ isMobile, setSidebarOpen }: LeftSidebarProps) => {
	const { albums, fetchAlbums, isLoading } = useMusicStore();

	useEffect(() => {
		fetchAlbums();
	}, [fetchAlbums]);

	return (
		<div className='h-full flex flex-col gap-2 p-2 '>
			{/* Logo and Hamburger */}
			<div className='flex items-center justify-between py-4 '>
				{isMobile && setSidebarOpen && (
					<button
						className='md:hidden p-2 rounded-md bg-zinc-900/80 hover:bg-zinc-800 mr-2'
						onClick={() => setSidebarOpen(false)}
						aria-label='Close sidebar'
					>
						<X className='w-6 h-6' />
					</button>
				)}
				<Link to='/' className='flex-1 flex justify-center md:justify-start'>
					<img src='/spotify.png' alt='Logo' className='h-8 w-auto md:h-10' />
				</Link>
			</div>

			{/* Navigation menu */}
			<div className='rounded-lg bg-zinc-900 p-2'>
				<div className='space-y-2'>
					<Link
						to={"/"}
						className={cn(
							buttonVariants({
								variant: "ghost",
								className: "w-full justify-start text-white hover:bg-zinc-800",
							})
						)}
					>
						<HomeIcon className='mr-2 size-5' />
						<span>Home</span>
					</Link>

					<SignedIn>
						<Link
							to={"/chat"}
							className={cn(
								buttonVariants({
									variant: "ghost",
									className: "w-full justify-start text-white hover:bg-zinc-800",
								})
							)}
						>
							<MessageCircle className='mr-2 size-5' />
							<span>Messages</span>
						</Link>
					</SignedIn>
				</div>
			</div>

			{/* Library section */}
			<div className='flex-1 rounded-lg bg-zinc-900 p-2'>
				<div className='flex items-center justify-between mb-4'>
					<div className='flex items-center text-white px-2'>
						<Library className='size-5 mr-2' />
						<span>Playlists</span>
					</div>
				</div>

				<ScrollArea className='h-[calc(100vh-300px)]'>
					<div className='space-y-2'>
						{isLoading ? (
							<PlaylistSkeleton />
						) : (
							albums.map((album) => (
								<Link
									to={`/albums/${album._id}`}
									key={album._id}
									className='p-2 hover:bg-zinc-800 rounded-md flex items-center gap-3 group cursor-pointer'
								>
									<img
										src={album.imageUrl}
										alt='Playlist img'
										className='size-12 rounded-md flex-shrink-0 object-cover'
									/>

									<div className='flex-1 min-w-0'>
										<p className='font-medium truncate'>{album.title}</p>
										<p className='text-sm text-zinc-400 truncate'>Album • {album.artist}</p>
									</div>
								</Link>
							))
						)}
					</div>
				</ScrollArea>
			</div>
		</div>
	);
};
export default LeftSidebar;
