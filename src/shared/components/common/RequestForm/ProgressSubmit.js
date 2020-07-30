import React, { useRef, useEffect, useState } from 'react';
import { createGlobalStyle } from 'styled-components';
import dot from '../../../assets/dot.svg';

const GlobalStyle = createGlobalStyle`
.progrezz-wrapper {
    height: auto;
    pointer-events: none;
    position: relative;
    width: 100%;
    margin-top: 24px;
}

.progrezz-wrapper .button {
    height: 40px;
}
.progrezz {
    align-items: center;
    display: flex;
    height: 100%;
    justify-content: space-between;
    margin-left: 16.666666%;
    position: relative;
    transition: all 0.25s ease;
    width: 66.6666%;
}
.progrezz.done {
    margin-left: 50%;
    opacity: 0;
    pointer-events: none;
    width: 0;
}

.progrezz > div {
    width: 100%;
}
.progrezz .step {
    background: white;
    border-top-left-radius: 25px;
    border-top-right-radius: 25px;
    cursor: pointer;
    height: 70px;
    margin-bottom: -20px;
    overflow: hidden;
    pointer-events: all;
    position: relative;
    width: 50px;
}
.progrezz .step p {
    color: white;
    font-size: 22px;
    font-weight: bold;
    line-height: 48px;
    margin: 0;
    position: relative;
    text-align: center;
    z-index: 1;
}
.progrezz .step svg {
    fill: #25f4d2;
    left: 0;
    position: absolute;
    top: 0;
    transition: opacity 0.3s;
}
.progrezz .step img {
    height: 16px;
    margin-top: -5px;
}
.progrezz .step .step-pin {
    visibility: hidden;
}
.progrezz > .step:first-child {
    margin-left: -25px;
}
.progrezz > .step:last-child {
    margin-right: -25px;
}
.progrezz .step:not(.done) svg {
    opacity: 0.2;
}
.step > .checkmark {
    height: 20px;
    margin-top: -5px;
}

.event-submit-wrapper {
    position: relative;
}
.event-submit-wrapper .errors {
    margin: 0;
    margin-top: 10px;
    text-align: center;
}


`;

const ProgressSubmit = ({ currentStep, setProgress }) => {
    const [kute, setKute] = useState();
    const stepRef = useRef(currentStep);

    useEffect(() => {
        const loadKute = async () => {
            const k = await import('kute.js');
            await Promise.all([
                import('kute.js/kute-svg'), //  Add SVG Plugin
                import('kute.js/kute-css'), //  Add CSS Plugin
                import('kute.js/kute-attr'), //  Add Attributes Plugin
                import('kute.js/kute-text'), //  Add Text Plugin
            ]);
            setKute(k);
        };
        loadKute();
    }, []);

    // update steps
    useEffect(() => {
        const step = currentStep;
        const lastStep = stepRef.current;

        if (step > 3 || !kute) {
            return;
        }
        const options = {
            easing: 'easingCubicIn',
            duration: 400,
            morphIndex: 135,
            morphPrecision: 1,
        };

        if (step !== lastStep) {
            if (lastStep > 0) {
                kute.fromTo(
                    '#step' + lastStep + '-circle',
                    { path: '#step' + lastStep + '-pin' },
                    { path: 'M0,24.5a24.5,24.5 0 1,0 49,0a24.5,24.5 0 1,0 -49,0' },
                    { ...options, morphIndex: 37 }
                ).start();
            }
            if (step > 0) {
                kute.fromTo(
                    '#step' + step + '-circle',
                    { path: '#step' + step + '-circle' },
                    { path: '#step' + step + '-pin' },
                    options
                ).start();
            }
        }
        stepRef.current = currentStep;
    }, [currentStep, kute]);

    // var className = finished ? "done progrezz" : "progrezz"
    const className = 'progrezz';
    const dotBg = 'url(' + dot + ')';
    return (
        <>
            <GlobalStyle />
            <div className="event-submit-wrapper">
                <div className="progrezz-wrapper">
                    <div
                        suppressHydrationWarning={true}
                        style={{
                            opacity: currentStep > 0 && currentStep < 4 ? 1 : 0,
                            backgroundImage: dotBg,
                            backgroundRepeat: 'repeat-x',
                            backgroundPosition: '50%',
                        }}
                        className={className}
                    >
                        <div
                            onClick={() => setProgress(1)}
                            className={currentStep >= 1 ? ' step done' : ' step'}
                        >
                            <p>
                                {/*{currentStep > 1 ? <img className="checkmark" src={checkmark} alt="checkmark"/> : 1}*/}
                                1
                            </p>
                            <svg
                                id="step1"
                                width="49px"
                                height="64px"
                                viewBox="0 0 49 64"
                                version="1.1"
                                xmlns="http://www.w3.org/2000/svg"
                            >
                                <path
                                    className="step-circle"
                                    id="step1-circle"
                                    d="M0,24.5a24.5,24.5 0 1,0 49,0a24.5,24.5 0 1,0 -49,0"
                                />
                                <path
                                    id="step1-pin"
                                    className="step-pin"
                                    d="M24.5,64 C43,42 49,38.0309764 49,24.5 C49,10.9690236 38.0309764,0 24.5,0 C10.9690236,0 0,10.9690236 0,24.5 C0,38.0309764 7,42 24.5,64 Z"
                                />
                            </svg>
                        </div>

                        <div
                            onClick={() => setProgress(2)}
                            className={currentStep >= 2 ? 'done step' : ' step'}
                        >
                            <p>
                                {/*{currentStep > 2 ? <img className="checkmark" src={checkmark} alt="checkmark"/> : 2}*/}
                                2
                            </p>
                            <svg
                                id="step2"
                                width="49px"
                                height="64px"
                                viewBox="0 0 49 64"
                                version="1.1"
                                xmlns="http://www.w3.org/2000/svg"
                            >
                                <path
                                    id="step2-circle"
                                    className="step-circle"
                                    d="M0,24.5a24.5,24.5 0 1,0 49,0a24.5,24.5 0 1,0 -49,0"
                                />
                                <path
                                    id="step2-pin"
                                    className="step-pin"
                                    d="M24.5,64 C43,42 49,38.0309764 49,24.5 C49,10.9690236 38.0309764,0 24.5,0 C10.9690236,0 0,10.9690236 0,24.5 C0,38.0309764 7,42 24.5,64 Z"
                                />
                            </svg>
                        </div>

                        <div
                            onClick={() => setProgress(3)}
                            className={currentStep >= 3 ? 'step done' : ' step'}
                        >
                            <p>
                                {/*{currentStep > 3 ? <img className="checkmark" src={checkmark} alt="checkmark"/> : 3}*/}
                                3
                            </p>
                            <svg
                                id="step3"
                                width="49px"
                                height="64px"
                                viewBox="0 0 49 64"
                                version="1.1"
                                xmlns="http://www.w3.org/2000/svg"
                            >
                                <path
                                    id="step3-circle"
                                    className="step-circle"
                                    d="M0,24.5a24.5,24.5 0 1,0 49,0a24.5,24.5 0 1,0 -49,0"
                                />
                                <path
                                    id="step3-pin"
                                    className="step-pin"
                                    d="M24.5,64 C43,42 49,38.0309764 49,24.5 C49,10.9690236 38.0309764,0 24.5,0 C10.9690236,0 0,10.9690236 0,24.5 C0,38.0309764 7,42 24.5,64 Z"
                                />
                            </svg>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default ProgressSubmit;
