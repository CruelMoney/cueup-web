import React from 'react';

const RefreshButton = ({ show, onClick }) => {
    return (
        <div onClick={onClick} className={'refresh-button ' + (show ? 'active' : '')}>
            <svg xmlns="http://www.w3.org/2000/svg" width="512" height="512" viewBox="0 0 512 512">
                <path d="M256,48C141.31,48,48,141.32,48,256c0,114.86,93.14,208,208,208,114.69,0,208-93.31,208-208C464,141.13,370.87,48,256,48Zm0,313a94,94,0,0,1,0-188h4.21L246.1,158.9a14,14,0,0,1,19.8-19.8l40,40a14,14,0,0,1,0,19.8l-40,40a14,14,0,0,1-19.8-19.8l18-18C261.72,201,259,201,256,201a66,66,0,1,0,66,66,14,14,0,0,1,28,0A94.11,94.11,0,0,1,256,361Z" />
            </svg>
        </div>
    );
};

export const RefreshButtonNaked = ({ show, onClick }) => {
    return (
        <div onClick={onClick} className={'refresh-button ' + (show ? 'active' : '')}>
            <svg xmlns="http://www.w3.org/2000/svg" width="512" height="512" viewBox="0 0 512 512">
                <path
                    d="M320,146s24.36-12-64-12A160,160,0,1,0,416,294"
                    style={{
                        fill: 'none',
                        stroke: '#fff',
                        strokeLinecap: 'round',
                        strokeMiterlimit: 10,
                        strokeWidth: '42px',
                    }}
                />
                <polyline
                    points="256 58 336 138 256 218"
                    style={{
                        fill: 'none',
                        stroke: '#fff',
                        strokeLinecap: 'round',
                        strokeLinejoin: 'round',
                        strokeWidth: '42px',
                    }}
                />
            </svg>
        </div>
    );
};

export default RefreshButton;
