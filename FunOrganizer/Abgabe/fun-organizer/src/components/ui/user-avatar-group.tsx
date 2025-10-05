import type { User } from '@/lib/schemas';
import { Tooltip, TooltipContent, TooltipTrigger } from './tooltip';

export default function UserAvatarGroup({ users }: { users: User[] }) {
    return (
        <div className='flex flex-wrap -space-x-3'>
            {users.map((user, idx) => (
                <Tooltip key={idx}>
                    <TooltipTrigger asChild>
                        <div className='w-10 h-10 rounded-full border-2 border-white flex items-center justify-center bg-gray-200 text-sm font-medium'>
                            <span className='text-xl'>{user.emoji}</span>
                        </div>
                    </TooltipTrigger>
                    <TooltipContent>
                        <p>{user.first_name}</p>
                    </TooltipContent>
                </Tooltip>
            ))}
        </div>
    );
}
