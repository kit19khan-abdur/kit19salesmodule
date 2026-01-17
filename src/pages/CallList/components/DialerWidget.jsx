import React, { useState, useEffect } from 'react';
import { Phone, Play, RefreshCw, Clock } from 'lucide-react';

const DialerWidget = ({ isActive, onStart, onRefresh }) => {
    const [dialerTime, setDialerTime] = useState(0);
    const [waitTime, setWaitTime] = useState(0);
    const [ringTime, setRingTime] = useState(0);
    const [talkTime, setTalkTime] = useState(0);

    useEffect(() => {
        if (!isActive) return;

        const interval = setInterval(() => {
            setDialerTime(prev => prev + 1);
            setRingTime(prev => prev + 1);
            setTalkTime(prev => prev + 1);
        }, 1000);

        return () => clearInterval(interval);
    }, [isActive]);

    const formatTime = (seconds) => {
        const hrs = Math.floor(seconds / 3600);
        const mins = Math.floor((seconds % 3600) / 60);
        const secs = seconds % 60;
        return `${String(hrs).padStart(2, '0')}:${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
    };

    const handleReset = () => {
        setDialerTime(0);
        setWaitTime(0);
        setRingTime(0);
        setTalkTime(0);
        if (onRefresh) onRefresh();
    };

    return (
        <div className="bg-white border-b border-gray-200 px-6 py-3">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                    {/* Dialer Button */}
                    <button
                        onClick={onStart}
                        className="flex items-center gap-2 px-6 py-2.5 bg-gradient-to-r from-rose-500 to-pink-500 hover:from-rose-600 hover:to-pink-600 text-white rounded-lg shadow-md transition-all"
                    >
                        <Phone className="w-4 h-4" />
                        <span className="font-semibold">Dialer</span>
                    </button>

                    {/* Time Stats */}
                    <div className="flex items-center gap-4">
                        <div className="flex items-center gap-2 px-4 py-2 bg-gray-50 rounded-lg border border-gray-200">
                            <Clock className="w-4 h-4 text-gray-600" />
                            <span className="text-sm font-mono font-semibold text-gray-900">{formatTime(dialerTime)}</span>
                        </div>
                        <div className="flex items-center gap-2 px-4 py-2 bg-gray-50 rounded-lg border border-gray-200">
                            <Clock className="w-4 h-4 text-gray-600" />
                            <span className="text-sm font-mono font-semibold text-gray-900">{formatTime(waitTime)}</span>
                        </div>
                        <div className="flex items-center gap-2 px-4 py-2 bg-gray-50 rounded-lg border border-gray-200">
                            <Clock className="w-4 h-4 text-gray-600" />
                            <span className="text-sm font-mono font-semibold text-gray-900">{formatTime(ringTime)}</span>
                        </div>
                        <div className="flex items-center gap-2 px-4 py-2 bg-gray-50 rounded-lg border border-gray-200">
                            <Clock className="w-4 h-4 text-gray-600" />
                            <span className="text-sm font-mono font-semibold text-gray-900">{formatTime(talkTime)}</span>
                        </div>
                    </div>
                </div>

                {/* Control Buttons */}
                <div className="flex items-center gap-2">
                    <button
                        onClick={onStart}
                        className="p-2.5 rounded-lg bg-green-50 hover:bg-green-100 text-green-600 transition-colors"
                        title="Start"
                    >
                        <Play className="w-5 h-5" />
                    </button>
                    <button
                        onClick={handleReset}
                        className="p-2.5 rounded-lg bg-blue-50 hover:bg-blue-100 text-blue-600 transition-colors"
                        title="Refresh"
                    >
                        <RefreshCw className="w-5 h-5" />
                    </button>
                </div>
            </div>
        </div>
    );
};

export default DialerWidget;
