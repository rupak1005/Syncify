import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useChatStore } from "@/stores/useChatStore";
import { useUser } from "@clerk/clerk-react";
import { Send } from "lucide-react";
import { useState } from "react";

const MessageInput = () => {
	const [newMessage, setNewMessage] = useState("");
	const { user } = useUser();
	const { selectedUser, sendMessage } = useChatStore();

	const handleSend = () => {
		if (!selectedUser || !user || !newMessage) return;
		sendMessage(selectedUser.clerkId, user.id, newMessage.trim());
		setNewMessage("");
	};

	return (
		<div className='px-2 py-4 mb-4  border-t border-zinc-800'>
			<div className='flex gap-2  '>
				<Input
					placeholder='Type a message'
					value={newMessage}
					onChange={(e) => setNewMessage(e.target.value)}
					className='bg-gradient-to-br from-gray-900 via-gray-950 to-black text-white  p-4  border-none'
					onKeyDown={(e) => e.key === "Enter" && handleSend()}
				/>

				<Button className="bg-blue-500" size={"icon"} onClick={handleSend} disabled={!newMessage.trim()}>
					<Send className='size-4 ' />
				</Button>
			</div>
		</div>
	);
};
export default MessageInput;
