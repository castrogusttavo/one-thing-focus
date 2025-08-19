export interface Session {
    task: string;
    notes: string;
    startTime: number; // Usamos number para timestamps Unix no JS
    endTime: number;
    duration: number;
}