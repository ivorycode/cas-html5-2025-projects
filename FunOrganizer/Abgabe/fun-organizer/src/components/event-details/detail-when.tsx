import { useSupabaseAuth } from '@/lib/auth';
import type { EventDetail } from '@/lib/schemas';
import { formatDateString } from '@/lib/utils';
import { Checkbox } from '../ui/checkbox';
import { Label } from '../ui/label';
import { Progress } from '../ui/progress';

import { RadioGroup, RadioGroupItem } from '../ui/radio-group';
import UserAvatarGroup from '../ui/user-avatar-group';

type EventDates = EventDetail['date'];
type EventAnswers = EventDetail['answer'];
type EventInvites = EventDetail['invites'];

function DetailWhen({
    dates,
    answers,
    invites,
    multipleChoice,
    onChange,
    readonly = false,
}: {
    dates: EventDates;
    answers: EventAnswers;
    invites: EventInvites;
    multipleChoice: boolean;
    onChange: (newDate: number[]) => void;
    readonly?: boolean;
}) {
    const auth = useSupabaseAuth();
    // date IDs [] that the current user has voted for
    const currentUserVotes = answers.find((a) => a.user_id === auth.user!.id)?.answer.date || [];

    // total number of votes across all dates for this event
    const totalVotes = answers.reduce((acc, answer) => acc + answer.answer.date.length, 0);

    // its {[dateId]: userWhoVotedForThisDate[]}
    const votesPerDate = dates.reduce(
        (acc, date) => {
            acc[date.id] = answers
                .filter((answer) => answer.answer.date.includes(date.id))
                .map((answer) => answer.user_id)
                .map((userId) => invites.find((invite) => invite.user_id === userId)!.user);
            return acc;
        },
        {} as Record<number, (typeof invites)[0]['user'][]>,
    );

    function onCheckedChange(dateId: number, checked: boolean) {
        if (checked) {
            emitChange([...currentUserVotes, dateId]);
        } else {
            emitChange(currentUserVotes.filter((id) => id !== dateId));
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
                {dates.map((date) => {
                    const usersWhoVotedForThisDate = votesPerDate[date.id] || [];
                    return (
                        <li key={date.id}>
                            <div className='flex gap-3 items-center'>
                                <Checkbox
                                    id={date.id.toString()}
                                    checked={currentUserVotes.includes(date.id)}
                                    disabled={readonly}
                                    onCheckedChange={(checked) =>
                                        !readonly && onCheckedChange(date.id, checked as boolean)
                                    }
                                    className='w-6 h-6'
                                />
                                <Label htmlFor={`r-${date.id}`} className='text-base flex-grow'>
                                    <div className='flex justify-between w-full items-center min-h-10'>
                                        <div>{formatDateString(date.date)}</div>
                                        <UserAvatarGroup users={usersWhoVotedForThisDate} />
                                    </div>
                                </Label>
                            </div>
                            <div className='pt-2'>
                                <Progress value={(usersWhoVotedForThisDate.length / totalVotes) * 100} />
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
                {dates.map((date) => {
                    const usersWhoVotedForThisDate = votesPerDate[date.id] || [];

                    return (
                        <div key={date.id}>
                            <div className='flex gap-3 items-center' key={date.id}>
                                <RadioGroupItem
                                    value={date.id.toString()}
                                    id={`r-${date.id}`}
                                    className='w-6 h-6'
                                    disabled={readonly}
                                />
                                <Label htmlFor={`r-${date.id}`} className='text-base flex-grow'>
                                    <div className='flex justify-between w-full items-center min-h-10'>
                                        <div>{formatDateString(date.date)}</div>
                                        <UserAvatarGroup users={usersWhoVotedForThisDate} />
                                    </div>
                                </Label>
                            </div>
                            <div className='pt-2'>
                                <Progress value={(usersWhoVotedForThisDate.length / totalVotes) * 100} />
                            </div>
                        </div>
                    );
                })}
            </RadioGroup>
        );
    }
}

export default DetailWhen;
