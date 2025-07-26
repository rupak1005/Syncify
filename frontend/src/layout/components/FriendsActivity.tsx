import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useChatStore } from "@/stores/useChatStore";
import { usePlayerStore } from "@/stores/usePlayerStore";
import { useUser } from "@clerk/clerk-react";
import { HeadphonesIcon, Radio, Users } from "lucide-react";
import { useEffect } from "react";
import toast from "react-hot-toast";

const FriendsActivity = () => {
	const { users, fetchUsers, onlineUsers, userActivities, socket } = useChatStore();
	const { user } = useUser();
	const { startListeningAlong, isListeningAlong, listenAlongHost } = usePlayerStore();

	useEffect(() => {
		if (user) fetchUsers();
	}, [fetchUsers, user]);

	const handleListenAlong = (hostUser: any) => {
		if (isListeningAlong && listenAlongHost?.id === hostUser.clerkId) {
			toast.error("You are already listening to this user.");
			return;
		}

		socket.emit("listen-along:start", { hostUserId: hostUser.clerkId });
		startListeningAlong({ id: hostUser.clerkId, name: hostUser.fullName });
		toast.success(`Started listening along with ${hostUser.fullName}`);
	};

	return (
		<div className='h-full bg-gradient-to-br from-gray-900/60 via-gray-950/60 to-black/60 rounded-lg flex flex-col backdrop-blur-md backdrop-saturate-150 border border-white/10 shadow-lg pb-20'>
			<div className='p-4 flex justify-between items-center border-b border-zinc-800'>
				<div className='flex items-center gap-2'>
					<Users className='size-5 shrink-0' />
					<h2 className='font-semibold'>Friends Activity</h2>
				</div>
			</div>

			{!user && <LoginPrompt />}

			<ScrollArea className='flex-1 min-h-0'>
				<div className='p-4 space-y-4 min-h-full w-full'>
					{users.map((friend) => {
						const activity = userActivities.get(friend.clerkId);
						const isPlaying = activity && activity !== "Idle";

						return (
							<div
								key={friend._id}
								className='cursor-pointer bg-gradient-to-br from-gray-900 via-gray-950 to-black text-white  p-3 rounded-md transition-colors group'
							>
								<div className='flex items-start gap-3 '>
									<div className='relative'>
										<Avatar className='size-10 border border-zinc-800'>
											<AvatarImage src={friend.imageUrl} alt={friend.fullName} />
											<AvatarFallback>{friend.fullName[0]}</AvatarFallback>
										</Avatar>
										<div
											className={`absolute bottom-0 right-0 h-3 w-3 rounded-full border-2 border-zinc-900 
												${onlineUsers.has(friend.clerkId) ? "bg-emerald-500" : "bg-zinc-500"}
												`}
											aria-hidden='true'
										/>
									</div>

									<div className='flex-1 min-w-0'>
										<div className='flex items-center justify-between'>
											<span className='font-medium text-sm text-white'>{friend.fullName}</span>
											{isPlaying && (
												<button
													onClick={() => handleListenAlong(friend)}
													className='opacity-0 group-hover:opacity-100 transition-opacity'
													title={`Listen along with ${friend.fullName}`}
												>
													<Radio className='size-4 text-blue-400' />
												</button>
											)}
										</div>

										{isPlaying ? (
											<div className='mt-1'>
												<div className='mt-1 text-sm text-white font-medium truncate'>
													{activity.replace("Playing ", "").split(" by ")[0]}
												</div>
												<div className='text-xs text-zinc-400 truncate'>
													{activity.split(" by ")[1]}
												</div>
											</div>
										) : (
											<div className='mt-1 text-xs text-zinc-400'>Idle</div>
										)}
									</div>
								</div>
							</div>
						);
					})}
				</div>
			</ScrollArea>
		</div>
	);
};
export default FriendsActivity;

const LoginPrompt = () => (
	<div className='h-full flex flex-col items-center justify-center p-6 text-center space-y-4'>
		<div className='relative'>
			<div
				className='absolute -inset-1 bg-gradient-to-r from-blue-500 to-emerald-400 rounded-full blur-lg
       opacity-75 animate-pulse'
				aria-hidden='true'
			/>
			<div className='relative bg-zinc-900 rounded-full p-4'>
				<HeadphonesIcon className='size-8 text-blue-400' />
			</div>
		</div>

		<div className='space-y-2 max-w-[250px]'>
			<h3 className='text-lg font-semibold text-white'>See What Friends Are Playing</h3>
			<p className='text-sm text-zinc-400'>Login to discover what music your friends are enjoying right now</p>
		</div>
	</div>
);
