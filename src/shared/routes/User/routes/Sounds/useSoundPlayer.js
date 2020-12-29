import { useEffect, useState, useCallback, useRef } from 'react';
import { Howl } from 'howler';
import { useAppState } from 'components/hooks/useAppState';
import useLogActivity, { ACTIVITY_TYPES } from '../../../../components/hooks/useLogActivity';

export const playerStates = Object.freeze({
    PLAYING: 'PLAYING',
    PAUSED: 'PAUSED',
    STOPPED: 'STOPPED',
    LOADING: 'LOADING',
});

const setupPlayerJs = async (sound) => {
    const playerjs = await import('player.js');
    const receiver = new playerjs.Receiver();

    receiver.on('play', () => {
        sound.play();
        receiver.emit('play');
    });

    receiver.on('pause', () => {
        sound.pause();
        receiver.emit('pause');
    });

    receiver.on('getPaused', (callback) => {
        callback(!sound.playing());
    });

    receiver.on('getDuration', (callback) => callback(sound.duration));

    receiver.on('getVolume', (callback) => callback(sound.volume() * 100));

    receiver.on('setVolume', (value) => sound.volume(value / 100));

    receiver.on('getCurrentTime', (callback) => {
        callback(sound.progress());
    });

    receiver.on('setCurrentTime', (value) => {
        sound.progress(value);
    });

    receiver.on('mute', () => sound.mute(true));

    receiver.on('unmute', () => sound.mute(false));

    receiver.on('getMuted', (callback) => callback(sound.mute()));

    receiver.on('getLoop', (callback) => callback(sound.loop()));

    receiver.on('setLoop', (value) => sound.loop(value));

    sound.subscribeOnstop(() => receiver.emit('ended'));
    sound.subscribeOnpause(() => receiver.emit('pause'));
    sound.subscribeOnplay(() => receiver.emit('play'));

    sound.onTimeUpdate(() => {
        receiver.emit('timeupdate', {
            seconds: sound.progress(),
            duration: sound.duration,
        });
    });

    receiver.ready();
};

//{id: howl}[]
const tracks = [];
let onDeck = null;
let globalUpdate = () => {};

const useSoundPlayer = ({ track, src, duration }) => {
    const soundId = track.id;
    const sound = useHowlWrapper(src, soundId, track);
    const { setAppState } = useAppState();

    // recreate state
    let initPos = 0;
    let initState = onDeck && onDeck?.id === soundId ? playerStates.LOADING : playerStates.STOPPED;

    try {
        initState = sound.playing() ? playerStates.PLAYING : initState;
        initPos = sound.progress();
    } catch (error) {
        //ignore
        console.log(error);
    }

    const [state, setState] = useState(initState);
    const [progress, setProgress] = useState(initPos);
    const [error, setError] = useState();

    const onTimeUpdateListener = useRef(() => {});

    useEffect(() => {
        console.log('init');

        let intervalRef = null;

        const step = () => {
            setProgress(sound.progress());
            onTimeUpdateListener.current();
        };

        const startInterval = () => {
            clearInterval(intervalRef);
            intervalRef = setInterval(step, 500);
        };

        if (sound.playing()) {
            startInterval();
        }

        const onPlay = () => {
            setState(playerStates.PLAYING);
            setError(null);
            startInterval();
            setAppState({ showBottomPlayer: true });
            globalUpdate(track);
        };
        const onPause = () => {
            setState(playerStates.PAUSED);
            clearInterval(intervalRef);
        };
        const onStop = () => {
            setState(playerStates.STOPPED);
            clearInterval(intervalRef);
        };
        const onEnd = () => {
            clearInterval(intervalRef);
            setState(playerStates.STOPPED);
            setProgress(duration);
        };
        const onLoad = () => {
            setError(null);
        };

        const onLoadError = (id, error) => {
            if (error && !error.includes('codec')) {
                setState(playerStates.STOPPED);
                setError(error);
            }
        };

        sound.subscribeOnplay(onPlay);
        sound.subscribeOnpause(onPause);
        sound.subscribeOnstop(onStop);
        sound.subscribeOnend(onEnd);
        sound.subscribeOnload(onLoad);
        sound.subscribeOnloaderror(onLoadError);
        return () => {
            sound.unsubscribeOnplay(onPlay);
            sound.unsubscribeOnpause(onPause);
            sound.unsubscribeOnstop(onStop);
            sound.unsubscribeOnend(onEnd);
            sound.unsubscribeOnload(onLoad);
            sound.unsubscribeOnloaderror(onLoadError);
            clearInterval(intervalRef);
        };
    }, [duration, sound]);

    const jumpTo = (s) => {
        setProgress(s);
        sound.progress(s);
    };

    const play = useCallback(() => {
        setState(playerStates.LOADING);
        setAppState({ showBottomPlayer: true });
        globalUpdate(track);
        sound.play();
    }, [sound, setAppState, track]);

    useEffect(() => {
        setupPlayerJs({
            ...sound,
            play,
            duration,
            onTimeUpdate: (fun) => {
                onTimeUpdateListener.current = fun;
            },
        });
    }, [sound, play, duration]);

    return {
        play,
        pause: sound.pause,
        jumpTo,
        state: state,
        error,
        progress,
        loading: state === playerStates.LOADING,
    };
};

const useHowlWrapper = (src, soundId, data) => {
    const existingTrack = tracks.find(({ id }) => id === soundId);

    const { log: logPlay } = useLogActivity({
        type: ACTIVITY_TYPES.SOUND_PLAY,
        subjectId: soundId,
        manual: true,
    });

    if (existingTrack) {
        return existingTrack;
    }

    const stopOtherTracks = () => tracks.forEach((track) => track.id !== soundId && track.pause());

    let onplay = [stopOtherTracks, logPlay];
    const subscribeOnplay = (f) => onplay.push(f);
    const unsubscribeOnplay = (f) => (onplay = onplay.filter((fun) => fun !== f));
    let onpause = [];
    const subscribeOnpause = (f) => onpause.push(f);
    const unsubscribeOnpause = (f) => (onpause = onpause.filter((fun) => fun !== f));
    let onstop = [];
    const subscribeOnstop = (f) => onstop.push(f);
    const unsubscribeOnstop = (f) => (onstop = onstop.filter((fun) => fun !== f));
    let onend = [next];
    const subscribeOnend = (f) => onend.push(f);
    const unsubscribeOnend = (f) => (onend = onend.filter((fun) => fun !== f));
    let onload = [];
    const subscribeOnload = (f) => onload.push(f);
    const unsubscribeOnload = (f) => (onload = onload.filter((fun) => fun !== f));
    let onfade = [];
    const subscribeOnfade = (f) => onfade.push(f);
    const unsubscribeOnfade = (f) => (onfade = onfade.filter((fun) => fun !== f));
    let onloaderror = [];
    const subscribeOnloaderror = (f) => onloaderror.push(f);
    const unsubscribeOnloaderror = (f) => (onloaderror = onloaderror.filter((fun) => fun !== f));

    const howl = new Howl({
        src: [src],
        html5: true,
        onplay: () => onplay.forEach((f) => f()),
        onpause: () => onpause.forEach((f) => f()),
        onstop: () => onstop.forEach((f) => f()),
        onend: () => onend.forEach((f) => f()),
        onload: () => onload.forEach((f) => f()),
        onfade: () => onfade.forEach((f) => f()),
        onloaderror: () => onloaderror.forEach((f) => f()),
    });

    const progress = (s) => {
        try {
            const p = howl.seek(s);
            if (!isNaN(p)) {
                return p;
            }
            return 0;
        } catch (error) {
            return 0;
        }
    };

    const isPlaying = () => {
        try {
            return howl.playing();
        } catch (error) {
            return false;
        }
    };

    const pause = () => {
        howl.pause();
    };

    const play = () => {
        if (!howl.playing()) {
            onDeck = track;
            globalUpdate(data);
            howl.play();
        }
    };

    const track = {
        id: soundId,
        howl,
        pause,
        play,
        volume: howl.volume,
        mute: howl.mute,
        loop: howl.loop,
        progress: progress,
        playing: isPlaying,
        subscribeOnplay,
        unsubscribeOnplay,
        subscribeOnpause,
        unsubscribeOnpause,
        subscribeOnstop,
        unsubscribeOnstop,
        subscribeOnend,
        unsubscribeOnend,
        subscribeOnload,
        unsubscribeOnload,
        subscribeOnfade,
        unsubscribeOnfade,
        subscribeOnloaderror,
        unsubscribeOnloaderror,
    };

    tracks.push(track);
    return track;
};

const getCurrentIdx = () => {
    return tracks.findIndex((t) => t === onDeck);
};

const skip = (d = 'next') => () => {
    const direction = {
        next: 1,
        previous: -1,
    };

    // fade out current
    if (onDeck) {
        onDeck.pause();
    }

    const idx = getCurrentIdx();

    // find next and fade
    const nextTrack = tracks[idx + direction[d]];

    if (nextTrack) {
        nextTrack.play();
    } else {
        onDeck = null;
        globalUpdate(null);
    }
};
const next = skip('next');
const previous = skip('previous');

const useCurrentDeck = () => {
    const [track, setTrack] = useState();

    // register update function
    useEffect(() => {
        globalUpdate = setTrack;
        return () => {
            globalUpdate = () => {};
        };
    }, []);

    return {
        track,
        next,
        previous,
    };
};

export default useSoundPlayer;

export { useCurrentDeck };
