
import React from 'react';
import { ArrowRightIcon } from './icons';

interface ServiceCardProps {
    title: string;
    description: string;
    icon: React.ReactNode;
    timesUsed?: number;
    available?: number;
    tag?: 'HOT' | 'POPULAR' | 'NEW' | 'TRY';
    onClick?: () => void;
}

const ServiceCard: React.FC<ServiceCardProps> = ({ title, description, icon, timesUsed, available, tag, onClick }) => {
    
    const tagStyles = {
        HOT: 'bg-red-500 text-white',
        POPULAR: 'bg-blue-500 text-white',
        NEW: 'bg-green-500 text-white',
        TRY: 'bg-yellow-500 text-white',
    };

    return (
        <button 
            onClick={onClick} 
            className="bg-white p-6 rounded-xl border border-gray-200 text-left w-full h-full flex flex-col hover:shadow-lg hover:border-brand-primary transition-all duration-200 group"
        >
            <div className="flex justify-between items-start">
                <div className="w-12 h-12 flex items-center justify-center rounded-full bg-gray-100 text-brand-primary">
                    {icon}
                </div>
                {tag && (
                    <span className={`px-2.5 py-1 text-xs font-bold rounded-full ${tagStyles[tag]}`}>
                        {tag}
                    </span>
                )}
            </div>
            
            <div className="mt-4 flex-grow">
                <h3 className="font-bold text-brand-dark text-lg">{title}</h3>
                <p className="text-sm text-gray-500 mt-1">{description}</p>
            </div>

            <div className="mt-6 pt-4 border-t border-gray-100 flex justify-between items-center">
                <div className="flex space-x-6">
                    {typeof timesUsed !== 'undefined' && (
                        <div>
                            <p className="font-bold text-brand-dark text-xl">{timesUsed}</p>
                            <p className="text-xs text-gray-400">Times Used</p>
                        </div>
                    )}
                     {typeof available !== 'undefined' && (
                        <div>
                            <p className="font-bold text-brand-dark text-xl">{available}</p>
                            <p className="text-xs text-gray-400">Available</p>
                        </div>
                    )}
                </div>
                 <ArrowRightIcon className="w-5 h-5 text-gray-400 group-hover:text-brand-primary transition-colors" />
            </div>
        </button>
    );
};

export default ServiceCard;