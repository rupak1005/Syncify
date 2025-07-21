import UsersListSkeleton from "@/components/skeletons/UsersListSkeleton";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useChatStore } from "@/stores/useChatStore";
import { usePlayerStore } from "@/stores/usePlayerStore";
import { Headphones } from "lucide-react";

const UsersList = () => {
	const { users, selectedUser, isLoading, setSelectedUser, onlineUsers, userActivities } = useChatStore();
	const { startListeningAlong } = usePlayerStore();

	return (
		<div className='border-r border-zinc-800'>
			<div className='flex flex-col h-full'>
				<ScrollArea className='h-[calc(100vh-280px)]'>
					<div className='space-y-2 p-2'>
						{isLoading ? (
							<UsersListSkeleton />
						) : (
							users.map((user) => {
								const activity = userActivities.get(user.clerkId);
								const isPlaying = activity && activity.startsWith("Playing ");
								return (
									<div
										key={user._id}
										onClick={() => setSelectedUser(user)}
										className={`flex items-center justify-between gap-3 p-2 rounded-lg cursor-pointer transition-colors ${selectedUser?.clerkId === user.clerkId ? "bg-black" : "hover:bg-black"}`}
									>
										<div className='flex items-center gap-2 min-w-0'>
											<div className='relative'>
												<Avatar className='size-8 md:size-12'>
													<AvatarImage src={user.imageUrl} />
													<AvatarFallback>{user.fullName[0]}</AvatarFallback>
												</Avatar>
												<div className={`absolute bottom-0 right-0 h-3 w-3 rounded-full ring-2 ring-zinc-900 ${onlineUsers.has(user.clerkId) ? "bg-emerald-500" : "bg-zinc-500"}`} />
											</div>
											<div className='flex-1 min-w-0 lg:block hidden'>
												<span className='font-medium truncate'>{user.fullName}</span>
											</div>
										</div>
										{/* Show current song and Listen Along button if playing */}
										{isPlaying && (
											<div className='flex items-center gap-1'>
												<span className='text-xs text-blue-400 truncate max-w-[80px] hidden sm:inline'>{activity.replace("Playing ", "")}</span>
												<button
													onClick={e => { e.stopPropagation(); startListeningAlong({ id: user.clerkId, name: user.fullName }); }}
													className='ml-1 p-1 rounded-full bg-blue-500 hover:bg-blue-600 text-white flex items-center justify-center'
													title='Listen Along'
												>
													<Headphones className='w-4 h-4' />
												</button>
											</div>
										)}
									</div>
								);
							})
						)}
					</div>
				</ScrollArea>
			</div>
		</div>
	);
};

export default UsersList;
