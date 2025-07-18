import { UserButton } from "@clerk/clerk-react";
import { Link } from "react-router-dom";

const Header = () => {
	return (
		<div className='flex  sm:flex-row items-center justify-between mb-4 gap-2 sm:gap-0'>
			<div className='flex items-center gap-3'>
				<Link to='/' className='rounded-lg'>
					<img src='/spotify.png' className='h-8 w-auto sm:h-10' />
				</Link>
				<div>
					<h1 className='text-xl sm:text-3xl font-bold'>Music Manager</h1>
					<p className='text-zinc-400 mt-1 text-xs sm:text-base'>Manage your music catalog</p>
				</div>
			</div>
			<UserButton />
		</div>
	);
};
export default Header;
