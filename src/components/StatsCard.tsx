import React from 'react';

interface StatsCardProps {
    icon: React.ReactNode;
    title: string;
    value: number | string;
}

export const StatsCard: React.FC<StatsCardProps> = ({ icon, title, value }) => {
    return (
        <div className="bg-white dark:bg-slate-800 rounded-lg shadow p-5 flex items-center space-x-4">
            <div className="text-blue-500 dark:text-blue-400">{icon}</div>
            <div>
                <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-200">{title}</h3>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">{value}</p>
            </div>
        </div>
    );
};
