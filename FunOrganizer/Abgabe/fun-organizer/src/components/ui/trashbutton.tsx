import { Trash2 } from 'lucide-react';
import { Button } from './button';

export function TrashButton({ onClick }: { onClick: () => void }) {
    return (
        <Button variant='ghost' size='icon' onClick={onClick} className='rounded-full bg-gray-100/50'>
            <Trash2 />
        </Button>
    );
}
