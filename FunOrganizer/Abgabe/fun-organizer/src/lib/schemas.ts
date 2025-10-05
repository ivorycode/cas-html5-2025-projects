import z from 'zod';

// *** USER ***

export const userSchema = z.object({
    id: z.number(),
    emoji: z.string(),
    user_id: z.string(),
    nickname: z.string(),
    last_name: z.string(),
    created_at: z.string(),
    first_name: z.string(),
});

export type User = z.infer<typeof userSchema>;

export const authUserSchema = z.object({
    auth_user_id: z.string(),
    role: z.string(),
    email: z.string(),
    phone: z.string(),
    confirmed_at: z.string().nullable(),
    last_sign_in_at: z.string().nullable(),
});
type AuthUser = z.infer<typeof authUserSchema>;

export type CompleteUser = User & AuthUser;

// *** EVENT RESULTS ***

export const eventResultsSchema = z.object({
    date: z.string().optional().nullable(),
    time: z.string().optional().nullable(),
    location: z
        .object({
            link: z.string().optional().nullable(),
            name: z.string(),
            address: z.string().optional().nullable(),
        })
        .optional()
        .nullable(),
    questions: z
        .array(
            z.object({
                question: z.string(),
                option: z.string(),
            }),
        )
        .nullable()
        .optional(),
});

export type EventResults = z.infer<typeof eventResultsSchema>;

// *** EVENT ***

export const eventSchema = z.object({
    id: z.number(),
    created_at: z.string(),
    name: z.string(),
    state: z.string(),
    comment: z.string().nullable(),
    admin_id: z.number(),
    date_multiple_choice: z.boolean(),
    location_multiple_choice: z.boolean(),
    event_results: eventResultsSchema.or(z.object({})).nullable().optional(),
});
export type EventType = z.infer<typeof eventSchema>;

export type SimpleEvent = Omit<EventType, 'event_results'>;

export const eventDetailSchema = z.object({
    id: z.number(),
    created_at: z.string(),
    name: z.string(),
    state: z.string(),
    comment: z.string().nullable(),
    admin_id: z.number(),
    date_multiple_choice: z.boolean(),
    location_multiple_choice: z.boolean(),
    event_results: eventResultsSchema.nullable().optional(),
    user: userSchema,
    invites: z.array(
        z.object({
            id: z.number(),
            user: userSchema,
            user_id: z.number(),
            event_id: z.number(),
            created_at: z.string(),
        }),
    ),
    date: z.array(
        z.object({
            id: z.number(),
            date: z.string(),
            time: z.string().nullable(),
            event_id: z.number(),
            created_at: z.string(),
        }),
    ),
    location: z.array(
        z.object({
            id: z.number(),
            link: z.string().optional().nullable(),
            name: z.string(),
            address: z.string().optional().nullable(),
            event_id: z.number(),
            created_at: z.string(),
        }),
    ),
    question: z.array(
        z.object({
            id: z.number(),
            event_id: z.number(),
            question: z.string(),
            created_at: z.string(),
            questionoption: z.array(
                z.object({
                    id: z.number(),
                    title: z.string(),
                    created_at: z.string(),
                    question_id: z.number(),
                }),
            ),
            multiple_choice: z.boolean(),
        }),
    ),
    answer: z.array(
        z.object({
            id: z.number(),
            answer: z.object({
                date: z.array(z.number()),
                location: z.array(z.number()),
                questions: z.array(
                    z.object({
                        id: z.number(),
                        options: z.array(z.number()),
                    }),
                ),
            }),
            user_id: z.number(),
            event_id: z.number(),
            created_at: z.string(),
        }),
    ),
});

export type EventDetail = z.infer<typeof eventDetailSchema>;

export const UserAnswersSchema = eventDetailSchema.shape.answer;

export type UserAnswer = EventDetail['answer'][number]['answer'];

export type SaveLocation = { name: string; adress?: string; link?: string };

export type SaveQuestion = {
    question: string;
    multiple_choice: boolean;
    questionoption: { title: string }[];
};
