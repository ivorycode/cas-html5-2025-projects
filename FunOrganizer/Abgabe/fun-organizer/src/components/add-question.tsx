import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { TrashButton } from '@/components/ui/trashbutton';
import type { SaveQuestion } from '@/lib/schemas';
import { useNavigate } from '@tanstack/react-router';
import { Loader2 } from 'lucide-react';
import { useState } from 'react';
import { Checkbox } from './ui/checkbox';
import { Label } from './ui/label';

export function AddQuestion({
    onAddQuestion,
    isSaving,
    backTo,
}: {
    onAddQuestion: (question: SaveQuestion) => void;
    isSaving: boolean;
    backTo?: string;
}) {
    const navigate = useNavigate();
    const [question, setQuestion] = useState('');
    const [answerOptions, setAnswerOptions] = useState<string[]>([]);
    const [optionInput, setOptionInput] = useState('');
    const [multipleChoice, setMultipleChoice] = useState(false);

    function addOption(option: string) {
        setAnswerOptions([...answerOptions, option]);
        setOptionInput('');
    }

    function saveQuestion() {
        const newQuestion = {
            question: question,
            multiple_choice: multipleChoice,
            questionoption: answerOptions.map((option) => ({ title: option })),
        };
        onAddQuestion(newQuestion);
        // reset form
        setQuestion('');
        setAnswerOptions([]);
        setOptionInput('');
        setMultipleChoice(false);
    }

    return (
        <div className='flex flex-col gap-4'>
            <Card className='fles flex-col p-5 gap-2'>
                <div className='grid w-full max-w-sm items-center gap-3'>
                    <Label htmlFor='question'>Deine Frage</Label>
                    <Input
                        id='question'
                        type='text'
                        placeholder='Frage'
                        value={question}
                        onChange={(e) => setQuestion(e.target.value)}
                        className='text-xl py-6 px-3 inCard'
                    />
                </div>
                <div className='grid w-full max-w-sm items-center gap-3 pt-4'>
                    <Label htmlFor='question'>Antwortmöglichkeit</Label>
                    <div className='flex flex-row gap-4 mb-2'>
                        <Input
                            className='inCard'
                            type='text'
                            value={optionInput}
                            placeholder='Antwort option'
                            onChange={(e) => setOptionInput(e.target.value)}
                        />
                        <Button onClick={() => addOption(optionInput)} disabled={!optionInput}>
                            +
                        </Button>
                    </div>
                </div>

                {answerOptions.length > 0 && (
                    <div>
                        <ul className='list-none list-inside'>
                            {answerOptions.map((option, index) => (
                                <li className='flex items-center text-lg created-question-option' key={index}>
                                    <span className='pr-4'>{option}</span>
                                    <TrashButton
                                        onClick={() => {
                                            setAnswerOptions(answerOptions.filter((_, i) => i !== index));
                                        }}
                                    />
                                </li>
                            ))}
                        </ul>
                    </div>
                )}

                {answerOptions.length > 1 && (
                    <div className='flex gap-3 items-center mt-4'>
                        <Checkbox
                            id='date-multiple-choice'
                            checked={multipleChoice}
                            onCheckedChange={(checked) => setMultipleChoice(checked as boolean)}
                            className='w-6 h-6'
                        />
                        <Label htmlFor='date-multiple-choice' className='text-base'>
                            Mehrfachauswahl erlauben
                        </Label>
                    </div>
                )}
                <Button
                    className='mt-4'
                    disabled={question.length === 0 || answerOptions.length < 2 || isSaving}
                    onClick={saveQuestion}
                >
                    {isSaving ? <Loader2 className='mr-2 h-4 w-4 animate-spin' /> : null}
                    Frage hinzufügen
                </Button>
            </Card>
            <div className='flex justify-between'>
                {backTo && (
                    <Button
                        className='mt-4'
                        variant='outline'
                        onClick={() => navigate({ to: backTo })}
                        disabled={isSaving}
                    >
                        Zurück
                    </Button>
                )}
            </div>
        </div>
    );
}
