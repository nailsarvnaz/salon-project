import React, { useEffect, useState } from 'react';
import { NotificationDetails } from '../types';

interface NotificationProps extends NotificationDetails {
    onClose: () => void;
}

const icons = {
    success: 'fa-check-circle',
    error: 'fa-times-circle',
    warning: 'fa-exclamation-triangle',
};

const colors = {
    success: 'border-emerald-500 text-emerald-300',
    error: 'border-red-500 text-red-300',
    warning: 'border-amber-500 text-amber-300',
}

const Notification: React.FC<NotificationProps> = ({ type, title, message, details, onClose }) => {
    const [show, setShow] = useState(false);
    const [copied, setCopied] = useState(false);

    useEffect(() => {
        const entryTimer = requestAnimationFrame(() => {
            setShow(true);
        });

        const exitTimer = setTimeout(() => {
            setShow(false);
            setTimeout(onClose, 300);
        }, 59500);

        return () => {
            cancelAnimationFrame(entryTimer);
            clearTimeout(exitTimer);
        };
    }, [onClose]);

    const handleCopy = (text: string) => {
        navigator.clipboard.writeText(text).then(() => {
            setCopied(true);
            setTimeout(() => setCopied(false), 2500);
        });
    };

    const handleClose = () => {
        setShow(false);
        setTimeout(onClose, 300);
    }
    
    return (
        <div 
            className={`fixed top-5 right-5 w-auto max-w-sm bg-slate-800/80 backdrop-blur-md rounded-lg shadow-2xl p-4 border-r-4 flex items-start gap-4 z-50 transition-transform duration-300 ease-out overflow-hidden ${show ? 'translate-x-0' : 'translate-x-[120%]' } ${colors[type]}`}
        >
            <i className={`fas ${icons[type]} text-2xl mt-1`}></i>
            <div className="flex-1">
                <h4 className="font-extrabold text-slate-100">{title}</h4>
                {message && <p className="text-sm text-slate-300">{message}</p>}
                {details && (
                    <div className="mt-2 space-y-2 text-sm text-slate-200">
                        {details.map((detail, index) => (
                            <div key={index} className="flex justify-between items-center gap-2">
                                <span className="font-semibold min-w-[70px] whitespace-nowrap text-slate-400">{detail.label}:</span>
                                {detail.label === 'کد رهگیری' ? (
                                    <div className="flex items-center gap-2 font-mono">
                                        <span className="font-bold text-base text-white">{detail.value}</span>
                                        <button 
                                            onClick={() => handleCopy(detail.value)}
                                            className={`w-20 text-xs font-bold py-1 px-2 rounded-md transition-all duration-300 ${copied ? 'bg-emerald-500 text-white' : 'bg-slate-600 hover:bg-slate-500 text-slate-200'}`}
                                            disabled={copied}
                                        >
                                            {copied ? (
                                                <><i className="fas fa-check mr-1"></i> کپی شد</>
                                            ) : (
                                                <><i className="far fa-copy mr-1"></i> کپی</>
                                            )}
                                        </button>
                                    </div>
                                ) : (
                                    <span className="text-right">{detail.value}</span>
                                )}
                            </div>
                        ))}
                    </div>
                )}
            </div>
            <button onClick={handleClose} className="text-slate-400 hover:text-slate-200">
                <i className="fas fa-times"></i>
            </button>
             <div className="absolute bottom-0 left-0 h-1 bg-white/10 w-full">
                <div className="h-full bg-current animate-progress"></div>
            </div>
        </div>
    );
};

export default Notification;