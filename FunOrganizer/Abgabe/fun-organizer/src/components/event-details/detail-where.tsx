import { useSupabaseAuth } from '@/lib/auth';
import type { EventDetail } from '@/lib/schemas';
import { Checkbox } from '../ui/checkbox';
import { Label } from '../ui/label';
import { Progress } from '../ui/progress';

import { RadioGroup, RadioGroupItem } from '../ui/radio-group';
import UserAvatarGroup from '../ui/user-avatar-group';

type EventLocations = EventDetail['location'];
type EventAnswers = EventDetail['answer'];
type EventInvites = EventDetail['invites'];

function DetailWhere({
    locations,
    answers,
    invites,
    multipleChoice,
    onChange,
    readonly = false,
}: {
    locations: EventLocations;
    answers: EventAnswers;
    invites: EventInvites;
    multipleChoice: boolean;
    onChange: (newLocation: number[]) => void;
    readonly?: boolean;
}) {
    const auth = useSupabaseAuth();
    // location IDs [] that the current user has voted for
    const currentUserVotes = answers.find((a) => a.user_id === auth.user!.id)?.answer.location || [];

    // total number of votes across all locations for this event
    const totalVotes = answers.reduce((acc, answer) => acc + answer.answer.location.length, 0);

    // its {[locationId]: userWhoVotedForThisLocation[]}
    const votesPerLocation = locations.reduce(
        (acc, location) => {
            acc[location.id] = answers
                .filter((answer) => answer.answer.location.includes(location.id))
                .map((answer) => answer.user_id)
                .map((userId) => invites.find((invite) => invite.user_id === userId)!.user);
            return acc;
        },
        {} as Record<number, (typeof invites)[0]['user'][]>,
    );

    function onCheckedChange(locationId: number, checked: boolean) {
        if (checked) {
            emitChange([...currentUserVotes, locationId]);
        } else {
            emitChange(currentUserVotes.filter((id) => id !== locationId));
        }
    }

    function onRadioChanged(e: string): void {
        const newVote = parseInt(e, 10);
        emitChange([newVote]);
    }

    function emitChange(userVotes: number[]) {
        onChange(userVotes);
    }

    if (multipleChoice) {
        return (
            <ul className='flex flex-col gap-8'>
                {locations.map((location) => {
                    const usersWhoVotedForThisLocation = votesPerLocation[location.id] || [];
                    return (
                        <li key={location.id}>
                            <div className='flex gap-3 items-center'>
                                <Checkbox
                                    id={`where-checkbox-${location.id}`}
                                    checked={currentUserVotes.includes(location.id)}
                                    onCheckedChange={(checked) => onCheckedChange(location.id, checked as boolean)}
                                    className='w-6 h-6'
                                    disabled={readonly}
                                />
                                <Label htmlFor={`where-checkbox-${location.id}`} className='text-base flex-grow'>
                                    <div className='flex justify-between w-full items-center min-h-10'>
                                        <div>{location.name}</div>
                                        <UserAvatarGroup users={usersWhoVotedForThisLocation} />
                                    </div>
                                </Label>
                            </div>
                            <div className='pt-2'>
                                <Progress value={(usersWhoVotedForThisLocation.length / totalVotes) * 100} />
                            </div>
                        </li>
                    );
                })}
            </ul>
        );
    } else {
        return (
            <RadioGroup
                onValueChange={(e) => onRadioChanged(e)}
                value={currentUserVotes[0]?.toString() ?? ''}
                className='flex flex-col gap-6 '
            >
                {locations.map((location) => {
                    const usersWhoVotedForThisLocation = votesPerLocation[location.id] || [];

                    return (
                        <div key={location.id}>
                            <div className='flex gap-3 items-center' key={location.id}>
                                <RadioGroupItem
                                    value={location.id.toString()}
                                    id={`where-radio-${location.id}`}
                                    className='w-6 h-6'
                                    disabled={readonly}
                                />
                                <Label htmlFor={`where-radio-${location.id}`} className='text-base flex-grow'>
                                    <div className='flex justify-between w-full items-center min-h-10'>
                                        <div>{location.name}</div>
                                        <UserAvatarGroup users={usersWhoVotedForThisLocation} />
                                    </div>
                                </Label>
                            </div>
                            <div className='pt-2'>
                                <Progress value={(usersWhoVotedForThisLocation.length / totalVotes) * 100} />
                            </div>
                        </div>
                    );
                })}
            </RadioGroup>
        );
    }
}

export default DetailWhere;
