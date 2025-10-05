import type { SaveQuestion } from '@/lib/schemas.ts';
import { AddQuestion } from '../add-question';
import { Button } from '../ui/button';
import { Card } from '../ui/card';
import { TrashButton } from '../ui/trashbutton';
import type { EventData } from './create-event';

interface StepQuestion {
    onBack: () => void;
    onNext: () => void;
    questions: SaveQuestion[];
    // addQuestion: (questionObject: { id: number; question: string; multiple_choice: boolean }) => void;
    // updateQuestion: (value:boolean, id:number) => void;
    // addQuestionOption: (questionId: number) => void;
    // removeQuestion: (questionId: number) => void;
    // removeQuestionOption: (questionId: number, optionId: number) => void;
    updateEvent: (data: Partial<EventData>) => void;
}

export default function StepQuestion({ onBack, onNext, questions, updateEvent }: StepQuestion) {
    function onAddQuestion(newQuestion: SaveQuestion) {
        updateEvent({ questions: [...questions, newQuestion] });
    }

    return (
        <div>
            <h1>Was soll sonst noch geklärt werden?</h1>
            <div className='flex flex-col gap-4 my-8'>
                <AddQuestion onAddQuestion={onAddQuestion} isSaving={false} />

                {questions.length > 0 && (
                    <Card className='p-5 gap-2'>
                        {questions.map((q, index) => (
                            <div key={index} className='flex items-center text-xl created-question-option'>
                                <div className='pr-4'>{q.question}</div>
                                <TrashButton
                                    onClick={() => {
                                        const newQuestions = questions.filter((_, i) => i !== index);
                                        updateEvent({ questions: newQuestions });
                                    }}
                                />
                            </div>
                        ))}
                    </Card>
                )}

                <div className='flex flex-row gap-4'>
                    <Button variant='outline' onClick={onBack}>
                        Zurück
                    </Button>
                    <Button onClick={onNext}>Weiter</Button>
                </div>
            </div>
        </div>
    );
}
