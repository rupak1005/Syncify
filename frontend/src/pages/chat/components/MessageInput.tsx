import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useChatStore } from "@/stores/useChatStore";
import { useUser } from "@clerk/clerk-react";
import { Send, Smile } from "lucide-react";
import { useState } from "react";
import Picker from '@emoji-mart/react';
import data from '@emoji-mart/data';

const MessageInput = () => {
	const [newMessage, setNewMessage] = useState("");
	const [showEmojiPicker, setShowEmojiPicker] = useState(false);
	const { user } = useUser();
	const { selectedUser, sendMessage } = useChatStore();

	const handleSend = () => {
		if (!selectedUser || !user || !newMessage) return;
		sendMessage(selectedUser.clerkId, user.id, newMessage.trim());
		setNewMessage("");
	};

	const handleEmojiSelect = (emoji: any) => {
		setNewMessage(prev => prev + emoji.native);
		setShowEmojiPicker(false);
	};

	return (
		<div className='px-2 py-4 mb-4 border-t border-zinc-800 relative'>
			<div className='flex gap-2'>
				<Button
					size="icon"
					variant="ghost"
					onClick={() => setShowEmojiPicker(!showEmojiPicker)}
					className="text-zinc-400 hover:text-white"
				>
					<Smile className='size-4' />
				</Button>
				<Input
					placeholder='Type a message'
					value={newMessage}
					onChange={(e) => setNewMessage(e.target.value)}
					className='bg-gradient-to-br from-gray-900 via-gray-950 to-black text-white p-4 border-none'
					onKeyDown={(e) => e.key === "Enter" && handleSend()}
				/>
				<Button className="bg-blue-500" size={"icon"} onClick={handleSend} disabled={!newMessage.trim()}>
					<Send className='size-4' />
				</Button>
			</div>
			{showEmojiPicker && (
				<div className="absolute bottom-full right-0 mb-2">
					<Picker
						data={data}
						onEmojiSelect={handleEmojiSelect}
						previewPosition="none"
						skinTonePosition="none"
						style={{ width: 250 }}
					/>
				</div>
			)}
		</div>
	);
};
export default MessageInput;
