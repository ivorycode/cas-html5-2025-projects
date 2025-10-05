import z from 'zod';
import {
    eventDetailSchema,
    eventSchema,
    UserAnswersSchema,
    type EventDetail,
    type SaveLocation,
    type SaveQuestion,
    type UserAnswer,
} from './schemas';
import { supabase } from './supabase';

export const getEventById = async (eventId: number): Promise<EventDetail> => {
    const { data, error } = await supabase
        .from('event')
        .select(
            '*, user (*), invites (*, user (*)), date (*), location (*), question (*, questionoption (*)), answer (*)',
        )
        .eq('id', eventId)
        .single();

    if (error) {
        throw new Error(`Error fetching event: ${error.message}`);
    }
    const event = eventDetailSchema.parse(data);
    return event;
};

export const updateUserAnswers = async (userId: number, eventId: number, newAnswer: UserAnswer) => {
    const { data, error } = await supabase
        .from('answer')
        .update({ answer: newAnswer })
        .eq('user_id', userId)
        .eq('event_id', eventId)
        .select();

    if (error) {
        throw new Error(`Error while updating answers: ${error.message}`);
    }
    if (data.length === 0) {
        throw new Error(`Error while updating answers: No data returned`);
    }
    return data;
};

export const getUserByAuthId = async (authId: string) => {
    const { data, error } = await supabase.from('user').select('*').eq('user_id', authId).single();
    if (error) {
        throw new Error(`Error fetching user: ${error.message}`);
    }
    return data;
};

export const getEventInvitesForUser = async (userId: number) => {
    const { data, error } = await supabase
        .from('invites')
        .select('event(*)') // Verknüpft die Events mit den Einladungen
        .eq('user_id', userId); // Filtert nach der Benutzer-ID

    const events = z.array(eventSchema).parse(data?.map((invite) => invite.event));
    if (error) {
        throw new Error(`Error fetching events: ${error.message}`);
    }
    return events;
};

export const getAllAnswers = async () => {
    const { data, error } = await supabase.from('answer').select('*');

    if (error) {
        throw new Error(`Error fetching answers: ${error.message}`);
    }
    return data;
};
export const getDateById = async (dateId: number) => {
    const { data, error } = await supabase.from('date').select('*').eq('id', dateId).single();

    if (error) {
        throw new Error(`Error fetching date: ${error.message}`);
    }
    return data;
};
export const getLocationById = async (locationId: number) => {
    const { data, error } = await supabase.from('location').select('*').eq('id', locationId).single();
    if (error) {
        throw new Error(`Error fetching location: ${error.message}`);
    }
    return data;
};

export const getUserAnswers = async (userId: number) => {
    const { data, error } = await supabase.from('answer').select('*').eq('user_id', userId);

    const answers = UserAnswersSchema.parse(data);

    if (error) {
        throw new Error(`Error fetching answers: ${error.message}`);
    }
    return answers;
};

export const createEvent = async (
    name: string,
    state: string,
    comment: string,
    admin_id: number,
    date_multiple_choice: boolean,
    location_multiple_choice: boolean,
) => {
    const { data, error } = await supabase
        .from('event')
        .insert([
            {
                name: name,
                state: state,
                comment: comment,
                admin_id: admin_id,
                date_multiple_choice: date_multiple_choice,
                location_multiple_choice: location_multiple_choice,
            },
        ])
        .select();

    if (error) {
        throw new Error(`Error creating event: ${error.message}`);
    }
    return data;
};

export const deleteEvent = async (eventId: number) => {
    const { error } = await supabase.from('event').delete().eq('id', eventId);

    if (error) {
        throw new Error(`Error deleting event: ${error.message}`);
    }

    return true;
};

export const updateEventById = async (eventId: number, patch: any) => {
    const { data, error } = await supabase.from('event').update(patch).eq('id', eventId).select();

    if (error) {
        throw new Error(`Error updating event: ${error.message}`);
    }
    if (data.length === 0) {
        throw new Error('Update matched 0 rows (policy/filter issue).');
    }
    return data;
};

export const saveInvites = async (event_id: number, userIds: number[]) => {
    const inviteInserts = userIds.map((user_id) => ({
        event_id: event_id,
        user_id: user_id,
    }));
    const { data, error } = await supabase.from('invites').insert(inviteInserts).select();

    if (error) {
        throw new Error(`Error creating invites: ${error.message}`);
    }
    return data;
};
export const saveDates = async (event_id: number, dates: { date: string; time?: string }[]) => {
    const dateInserts = dates.map((dates) => ({
        event_id: event_id,
        date: dates.date,
        time: dates.time || null,
    }));
    const { data, error } = await supabase.from('date').insert(dateInserts).select();

    if (error) {
        throw new Error(`Error creating dates: ${error.message}`);
    }
    return data;
};
export const saveLocations = async (event_id: number, locations: SaveLocation[]) => {
    const locationInserts = locations.map((location) => ({
        event_id: event_id,
        name: location.name,
        adress: location.adress || null,
        link: location.link || null,
    }));
    const { data, error } = await supabase.from('location').insert(locationInserts).select();

    if (error) {
        throw new Error(`Error creating locations: ${error.message}`);
    }
    return data;
};
export const saveQuestions = async (event_id: number, questions: SaveQuestion[]) => {
    const questionInserts = questions.map((question) => ({
        event_id: event_id,
        question: question.question,
        multiple_choice: question.multiple_choice,
    }));
    const { data: questionData, error: questionError } = await supabase
        .from('question')
        .insert(questionInserts)
        .select();

    if (questionError) {
        throw new Error(`Error creating questions: ${questionError.message}`);
    }

    // Now insert the question options if they exist
    if (questionData) {
        for (let i = 0; i < questions.length; i++) {
            const question = questions[i];
            const createdQuestion = questionData[i];

            if (question.questionoption && question.questionoption.length > 0) {
                const optionInserts = question.questionoption.map((option) => ({
                    question_id: createdQuestion.id,
                    title: option.title,
                }));

                const { error: optionError } = await supabase
                    .from('questionoption')
                    .insert(optionInserts)
                    .select();

                if (optionError) {
                    throw new Error(`Error creating question options: ${optionError.message}`);
                }
            }
        }
    }

    return questionData;
};

export const insertEmptyAnswerRows = async (eventId: number, userIds: number[]) => {
    const emptyAnswer = { location: [], date: [], questions: [] };
    const answerInserts = userIds.map((userId) => ({
        event_id: eventId,
        user_id: userId,
        answer: emptyAnswer,
    }));
    const { error } = await supabase.from('answer').insert(answerInserts).select();

    if (error) {
        throw new Error(`Error creating empty answers: ${error.message}`);
    }
};

export const updateUserProfileByAuthUid = async (
    authUid: string,
    patch: { first_name?: string; last_name?: string; emoji?: string },
) => {
    // Erst prüfen, ob die Row existiert
    const exists = await supabase.from('user').select('id').eq('user_id', authUid).maybeSingle();

    if (exists.error) throw exists.error;
    if (!exists.data) throw new Error('No row with that user_id exists');

    // Dann das Update mit Rückgabe
    const { data, error } = await supabase
        .from('user')
        .update(patch)
        .eq('user_id', authUid)
        .select('id, user_id, first_name, last_name, emoji') // explizit
        .maybeSingle();

    if (error) throw new Error(`Error updating user: ${error.message}`);
    if (!data) throw new Error('Update matched 0 rows (policy/filter issue).');
    return data;
};
