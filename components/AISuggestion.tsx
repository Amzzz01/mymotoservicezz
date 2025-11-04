import React, { useState } from 'react';
import { GoogleGenAI } from '@google/genai';
import { MaintenanceRecord } from '../types';

interface AISuggestionProps {
  records: MaintenanceRecord[];
}

const LightbulbIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className={className}>
        <path d="M10 2a.75.75 0 01.75.75v1.5a.75.75 0 01-1.5 0v-1.5A.75.75 0 0110 2zM10 15a.75.75 0 01.75.75v1.5a.75.75 0 01-1.5 0v-1.5A.75.75 0 0110 15zM10 7a3 3 0 100 6 3 3 0 000-6zM5.99 4.99a.75.75 0 011.06 0l1.06 1.06a.75.75 0 01-1.06 1.06l-1.06-1.06a.75.75 0 010-1.06zM11.83 11.83a.75.75 0 011.06 0l1.06 1.06a.75.75 0 01-1.06 1.06l-1.06-1.06a.75.75 0 010-1.06zM4.99 14.01a.75.75 0 010-1.06l1.06-1.06a.75.75 0 111.06 1.06l-1.06 1.06a.75.75 0 01-1.06 0zM12.89 5.99a.75.75 0 010-1.06l1.06-1.06a.75.75 0 011.06 1.06l-1.06 1.06a.75.75 0 01-1.06 0zM2.75 10a.75.75 0 010-1.5h1.5a.75.75 0 010 1.5h-1.5zM15.75 10a.75.75 0 010-1.5h1.5a.75.75 0 010 1.5h-1.5z" />
    </svg>
);

const SparklesIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className={className}>
        <path fillRule="evenodd" d="M10.868 2.884c-.321-.772-1.415-.772-1.736 0l-1.83 4.401-4.753.39-3.423 3.595c-.737.775-.242 2.056.697 2.446l4.503 1.802 2.12 4.23c.377.753 1.519.753 1.896 0l2.12-4.23 4.503-1.801c.94-.39 1.434-1.671.697-2.446l-3.423-3.595-4.753-.39-1.83-4.401z" clipRule="evenodd" />
    </svg>
);


const AISuggestion: React.FC<AISuggestionProps> = ({ records }) => {
    const [suggestion, setSuggestion] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleGetSuggestion = async () => {
        if (!records || records.length === 0) {
            setError("No maintenance records available to generate a suggestion.");
            return;
        }

        setIsLoading(true);
        setError(null);
        setSuggestion('');

        try {
            const ai = new GoogleGenAI({ apiKey: process.env.API_KEY as string });

            const sortedRecords = [...records].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
            const latestRecord = sortedRecords[0];
            const targetMotorcycleName = latestRecord.motorcycleName || "this motorcycle";
            const targetMotorcycleType = latestRecord.motorcycleType || "unknown type";

            const motorcycleRecords = sortedRecords.filter(r => r.motorcycleName === latestRecord.motorcycleName && r.motorcycleType === latestRecord.motorcycleType);

            const prompt = `
            You are an expert motorcycle mechanic.
            A user wants advice on their next service for their ${targetMotorcycleType} named "${targetMotorcycleName}".
            Here is its service history, sorted from most recent to oldest:
            ${JSON.stringify(motorcycleRecords.map(({id, ...rest}) => rest), null, 2)}

            Based on this history and common maintenance schedules for a ${targetMotorcycleType}, what is your recommendation for the next service?
            Please suggest:
            1. What specific tasks should be performed (e.g., oil change, brake fluid check, tire inspection).
            2. At what approximate odometer reading (in kilometers) the service should be done.

            Keep the response concise, friendly, and easy to understand for a typical rider.
            Format the response as plain text, not JSON or Markdown. Start with a friendly opening.
            `;

            const response = await ai.models.generateContent({
                model: 'gemini-2.5-flash',
                contents: prompt,
            });

            setSuggestion(response.text);

        } catch (e) {
            console.error(e);
            setError("Sorry, I couldn't generate a suggestion right now. Please try again later.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="my-8">
            <div className="text-center mb-6">
                <button
                    onClick={handleGetSuggestion}
                    disabled={isLoading || records.length === 0}
                    className="inline-flex items-center gap-2 bg-violet-600 hover:bg-violet-500 text-white font-bold py-3 px-6 rounded-lg shadow-lg shadow-violet-500/20 transition-all duration-300 transform hover:scale-105 disabled:bg-slate-700 disabled:text-slate-500 disabled:cursor-not-allowed disabled:scale-100 disabled:shadow-none"
                    aria-label="Get AI service suggestion for the most recently serviced motorcycle"
                >
                    <LightbulbIcon className="w-5 h-5" />
                    Get AI Service Suggestion
                </button>
            </div>

            {isLoading && (
                 <div className="text-center p-4 text-slate-400">
                    <p>Contacting our AI mechanic... this may take a moment.</p>
                </div>
            )}

            {error && (
                <div className="bg-red-900/50 border border-red-700 text-red-300 px-4 py-3 rounded-lg text-center" role="alert">
                    <p>{error}</p>
                </div>
            )}

            {suggestion && (
                <div className="bg-slate-800 p-6 rounded-lg shadow-2xl border border-violet-500/50 animate-fade-in">
                    <div className="flex items-center gap-3 mb-3">
                        <SparklesIcon className="w-6 h-6 text-violet-400" />
                        <h3 className="text-xl font-bold text-violet-400">AI Recommendation</h3>
                    </div>
                    <div className="prose prose-invert prose-p:text-slate-200 pl-9">
                        <p className="whitespace-pre-wrap">{suggestion}</p>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AISuggestion;
