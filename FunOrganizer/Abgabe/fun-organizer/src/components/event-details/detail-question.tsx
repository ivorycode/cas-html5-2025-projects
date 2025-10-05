import { useSupabaseAuth } from '@/lib/auth';
import type { EventDetail, User } from '@/lib/schemas';
import { Checkbox } from '../ui/checkbox';
import { Label } from '../ui/label';
import { Progress } from '../ui/progress';

import { RadioGroup, RadioGroupItem } from '../ui/radio-group';
import UserAvatarGroup from '../ui/user-avatar-group';

type Question = EventDetail['question'][number];
type EventAnswers = EventDetail['answer'];
type EventInvites = EventDetail['invites'];

function DetailQuestion({
    question,
    answers,
    invites,
    multipleChoice,
    onChange,
    readonly = false,
}: {
    question: Question;
    answers: EventAnswers;
    invites: EventInvites;
    multipleChoice: boolean;
    onChange: (questionId: number, newQuestionOptions: number[]) => void;
    readonly?: boolean;
}) {
    const auth = useSupabaseAuth();

    const allAnswersToThisQuestionByUser = answers.map((answer) => ({
        user_id: answer.user_id,
        options: answer.answer.questions.find((q) => q.id === question.id)?.options || [],
    }));

    const questionAnswersFromCurrentUser = answers.find((a) => a.user_id === auth.user!.id)?.answer.questions || [];

    const answersToCurrentQuestionFromCurrentUser =
        questionAnswersFromCurrentUser.find((answer) => answer.id === question.id)?.options || [];

    // total number of votes across all questionOptions for this question
    const totalVotes = allAnswersToThisQuestionByUser.reduce((acc, answer) => acc + (answer.options?.length || 0), 0);

    // its {[optionId]: userWhoVotedForThisOption[]}
    const votesPerOption = question.questionoption.reduce(
        (acc, option) => {
            acc[option.id] = allAnswersToThisQuestionByUser
                .filter((answer) => answer.options.includes(option.id))
                .map((answer) => answer.user_id)
                .map((userId) => invites.find((invite) => invite.user_id === userId)!.user);
            return acc;
        },
        {} as Record<number, User[]>,
    );

    function onCheckedChange(locationId: number, checked: boolean) {
        if (checked) {
            onChange(question.id, [...answersToCurrentQuestionFromCurrentUser, locationId]);
        } else {
            onChange(question.id, [...answersToCurrentQuestionFromCurrentUser.filter((id) => id !== locationId)]);
        }
    }

    function onRadioChanged(e: string): void {
        const newVote = parseInt(e, 10);
        onChange(question.id, [newVote]);
    }

    if (multipleChoice) {
        return (
            <ul className='flex flex-col gap-8'>
                {question.questionoption.map((option) => {
                    const usersWhoVotedForThisQuestion = votesPerOption[option.id] || [];
                    return (
                        <li key={option.id}>
                            <div className='flex gap-3 items-center'>
                                <Checkbox
                                    id={`where-checkbox-${option.id}`}
                                    checked={answersToCurrentQuestionFromCurrentUser.includes(option.id)}
                                    onCheckedChange={(checked) => onCheckedChange(option.id, checked as boolean)}
                                    className='w-6 h-6'
                                    disabled={readonly}
                                />
                                <Label htmlFor={`where-checkbox-${option.id}`} className='text-base flex-grow'>
                                    <div className='flex justify-between w-full items-center min-h-10'>
                                        <div>{option.title}</div>
                                        <UserAvatarGroup users={usersWhoVotedForThisQuestion} />
                                    </div>
                                </Label>
                            </div>
                            <div className='pt-2'>
                                <Progress value={(usersWhoVotedForThisQuestion.length / totalVotes) * 100} />
                            </div>
                        </li>
                    );
                })}
            </ul>
        );
    } else {
        return (
            <RadioGroup
                onValueChange={(e) => !readonly && onRadioChanged(e)}
                value={answersToCurrentQuestionFromCurrentUser[0]?.toString() ?? ''}
                className='flex flex-col gap-6 '
            >
                {question.questionoption.map((option) => {
                    const usersWhoVotedForThisLocation = votesPerOption[option.id] || [];

                    return (
                        <div key={option.id}>
                            <div className='flex gap-3 items-center'>
                                <RadioGroupItem
                                    value={option.id.toString()}
                                    id={`where-radio-${option.id}`}
                                    className='w-6 h-6'
                                    disabled={readonly}
                                />
                                <Label htmlFor={`where-radio-${option.id}`} className='text-base flex-grow'>
                                    <div className='flex justify-between w-full items-center min-h-10'>
                                        <div>{option.title}</div>
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

export default DetailQuestion;
