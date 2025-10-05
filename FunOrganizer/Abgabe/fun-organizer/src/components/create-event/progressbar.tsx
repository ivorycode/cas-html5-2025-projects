export function ProgressBar({ step }: { step: number }) {
    const maxProgressStep = 5; // letzter sichtbarer Step in der ProgressBar
    const activeStep = step > maxProgressStep ? maxProgressStep : step;

    const stepstate = (num: number) => {
        if (num < activeStep) return 'step done';
        if (num === activeStep) return 'step active';
        return 'step';
    };

    return (
        <div className='progress-bar'>
            {[1, 2, 3, 4, 5].map((num) => (
                <div key={num} className={stepstate(num)}></div>
            ))}
        </div>
    );
}
