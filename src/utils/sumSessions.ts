import { format } from 'date-fns';
import { Session } from '../types/Session';

export const sumSessionsDurationByDay = (sessions: Session[]): Record<string, number> => {
    const result: Record<string, number> = {};

    sessions.forEach(session => {
        const dateKey = format(new Date(session.startTime), 'yyyy-MM-dd');

        const durationMinutes = Math.round(session.duration / 1000 / 60);

        if (dateKey in result) {
            result[dateKey] += durationMinutes;
        } else {
            result[dateKey] = durationMinutes;
        }
    });

    return result;
};
