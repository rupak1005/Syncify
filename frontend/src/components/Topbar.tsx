import { SignedOut, UserButton } from "@clerk/clerk-react";
import { LayoutDashboardIcon } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import SignInOAuthButtons from "./SignInOAuthButtons";
import { useAuthStore } from "@/stores/useAuthStore";
import { cn } from "@/lib/utils";
import { buttonVariants } from "./ui/button";

const Topbar = () => {
	const { isAdmin } = useAuthStore();
	const location = useLocation();

	return (
		<div
			className='flex items-center justify-between p-4 sticky top-0 bg-gradient-to-br from-gray-900/60 via-gray-950/60 to-black/60 text-white z-10 backdrop-blur-md backdrop-saturate-150 border-b border-white/10 shadow-lg'
		>
			<div className="flex gap-2 items-center  text-xl mx-auto">
				<img src='/logo.png' className={cn('size-8', location.pathname === '/' ? 'sm:inline hidden' : '')} alt='Spotify logo' />
				Syncify
			</div>
			<div className='flex items-center gap-2'>
				{isAdmin && (
					<Link to={"/admin"} className={cn(buttonVariants({ variant: "outline" }))}>
						<LayoutDashboardIcon className='size-4  mr-2 ' />
						<span className="sm:inline hidden">Admin Dashboard</span>
					</Link>
				)}

				<SignedOut>
					<SignInOAuthButtons />
				</SignedOut>

				<UserButton />
			</div>
		</div>
	);
};
export default Topbar;
