import { useState } from 'react';

const formatTime = (seconds) =>
    new Date(null, null, null, null, null, seconds)
        .toTimeString()
        .split(' ')[0]
        .replace('00:', '')
        .replace(':', '.');

const useScanning = ({ duration, loading, progress = 0 }) => {
    const totalSeconds = duration ? duration.totalSeconds : 0;

    const [scanningPosition, setScanningPosition] = useState(null);

    const scanInSeconds = scanningPosition * totalSeconds;

    const durationFormatted = formatTime(totalSeconds);
    const progressFormatted = loading
        ? 'Loading...'
        : formatTime(scanningPosition ? scanInSeconds : progress);

    return {
        scanInSeconds,
        setScanningPosition,
        scanningPosition,
        progressFormatted,
        durationFormatted,
    };
};

export default useScanning;
