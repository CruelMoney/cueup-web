import React from 'react';

const VerifiedBadge = React.forwardRef(({ style, ...props }, ref) => (
    <div
        {...props}
        ref={ref}
        style={{
            background: '#fff',
            width: '19px',
            height: '19px',
            minWidth: '19px',
            minHeight: '19px',
            lineHeight: '40px',
            borderRadius: '50%',
            boxShadow: '0 0 6px 1px #50E3C2',
            position: 'absolute',
            right: '-36px',
            top: '14px',
            ...style,
        }}
    >
        <svg
            width="12px"
            height="11px"
            viewBox="-4 16 12 11"
            version="1.1"
            xmlns="http://www.w3.org/2000/svg"
            xmlnsXlink="http://www.w3.org/1999/xlink"
        >
            <g stroke="none" strokeWidth="1" fill="none" fillRule="evenodd">
                <g
                    transform="translate(-687.000000, -161.000000)"
                    fill="#50E3C2"
                    fillRule="nonzero"
                >
                    <g>
                        <g transform="translate(683.000000, 157.000000)">
                            <path d="M15.3203125,5.7578125 C15.356771,5.83072953 15.375,5.88541648 15.375,5.921875 C15.375,5.95833352 15.356771,6.01302047 15.3203125,6.0859375 L8.51171875,14.8359375 C8.4023432,14.945313 8.32031277,15 8.265625,15 C8.17447871,15 8.08333379,14.9544275 7.9921875,14.8632812 L4.13671875,11.1445312 L4.0546875,11.0625 C4.01822898,10.989583 4,10.934896 4,10.8984375 C4,10.8802082 4.01822898,10.8346358 4.0546875,10.7617188 L4.109375,10.7070312 C4.61979422,10.1601535 5.02083187,9.74088688 5.3125,9.44921875 C5.42187555,9.3398432 5.49479148,9.28515625 5.53125,9.28515625 C5.60416703,9.28515625 5.69531195,9.3398432 5.8046875,9.44921875 L7.9921875,11.5820312 L13.4609375,4.5546875 C13.497396,4.51822898 13.552083,4.5 13.625,4.5 C13.6796878,4.5 13.7434892,4.51822898 13.8164062,4.5546875 L15.3203125,5.7578125 Z" />
                        </g>
                    </g>
                </g>
            </g>
        </svg>
    </div>
));

export default VerifiedBadge;
