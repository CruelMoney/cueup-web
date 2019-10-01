import React from 'react';

const lockSvg = (
    <svg
        width="20px"
        height="25px"
        viewBox="0 0 57 68"
        version="1.1"
        xmlns="http://www.w3.org/2000/svg"
    >
        <defs />
        <g id="HomePage" stroke="none" strokeWidth="1" fill="none" fillRule="evenodd">
            <g id="Homepage" transform="translate(-262.000000, -1596.000000)">
                <g id="Info-section" transform="translate(223.000000, 1560.000000)">
                    <g id="Padlock" transform="translate(39.000000, 36.000000)">
                        <g id="Group">
                            <path
                                d="M40.7240571,27.5238095 L40.7240571,19.8171429 C40.646764,13.1597297 35.1962062,7.8032291 28.4991857,7.8032291 C21.8021652,7.8032291 16.3516075,13.1597297 16.2743143,19.8171429 L16.2743143,27.5238095 L8.14285714,27.5238095 L8.14285714,20.2380952 C8.14285714,9.06180952 17.2563429,0 28.5,0 C39.7436571,0 48.8571429,9.06180952 48.8571429,20.2380952 L48.8571429,27.5238095 L40.7240571,27.5238095 Z M22.8,43.7142857 C22.8,46.1104762 24.111,48.1990476 26.0571429,49.3161905 L26.0571429,55.047619 C26.0571429,56.8359697 27.5154154,58.2857143 29.3142857,58.2857143 L29.3142857,68 L6.51428571,68 C2.91654506,68 0,65.1005108 0,61.5238095 L0,34 C0,30.4232988 2.91654506,27.5238095 6.51428571,27.5238095 L29.3142857,27.5238095 L29.3142857,37.2380952 C25.7165451,37.2380952 22.8,40.1375845 22.8,43.7142857 Z M50.4857143,68 L29.3142857,68 L29.3142857,58.2857143 C31.113156,58.2857143 32.5714286,56.8359697 32.5714286,55.047619 L32.5714286,49.3161905 C34.5873502,48.162966 35.8295487,46.0265299 35.8285714,43.7142857 C35.8285714,40.1375845 32.9120264,37.2380952 29.3142857,37.2380952 L29.3142857,27.5238095 L50.4857143,27.5238095 C54.0834549,27.5238095 57,30.4232988 57,34 L57,61.5238095 C57,65.1005108 54.0834549,68 50.4857143,68 Z"
                                id="Combined-Shape"
                            />
                        </g>
                    </g>
                </g>
            </g>
        </g>
    </svg>
);

class TextWrapper extends React.Component {
    handleClick = () => {
        if (this.context && !this.context.editing) {
            if (this.props.onDisabledClick) {
                this.props.onDisabledClick();
            }
        }
    };

    render() {
        return (
            <div className="text-element-wrapper" onClick={this.handleClick}>
                <h4>
                    {this.props.showLock ? lockSvg : null}
                    {this.props.label}
                </h4>
                <p>{this.props.text}</p>
                {this.props.children}
            </div>
        );
    }
}

export default TextWrapper;
