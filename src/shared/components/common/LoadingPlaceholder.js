import React, { Component } from 'react';

class LoadingPlaceholder extends Component {
    render() {
        return (
            <div className="timeline-wrapper" {...this.props}>
                <div className="timeline-item">
                    <div className="animated-background">
                        <div className="background-masker header-top" />
                        <div className="background-masker header-left" />
                        <div className="background-masker header-right" />
                        <div className="background-masker header-bottom" />
                        <div className="background-masker subheader-left" />
                        <div className="background-masker subheader-right" />
                        <div className="background-masker subheader-bottom" />
                        <div className="background-masker content-top" />
                        <div className="background-masker content-first-end" />
                        <div className="background-masker content-second-line" />
                        <div className="background-masker content-second-end" />
                        <div className="background-masker content-third-line" />
                        <div className="background-masker content-third-end" />
                    </div>
                </div>
            </div>
        );
    }
}

class LoadingPlaceholder2 extends Component {
    render() {
        return (
            <div className="animated-background two" {...this.props}>
                <div className="background-masker content-first-line" />
                <div className="background-masker content-second-line" />
            </div>
        );
    }
}

class LoadingCard extends Component {
    render() {
        return (
            <div className="card offer-card">
                <div className="timeline-wrapper">
                    <div className="timeline-item">
                        <div className="animated-background">
                            <div className="background-masker header-top" />
                            <div className="background-masker header-left" />
                            <div className="background-masker header-right" />
                            <div className="background-masker header-bottom" />
                            <div className="background-masker subheader-left" />
                            <div className="background-masker subheader-right" />
                            <div className="background-masker subheader-bottom" />
                            <div className="background-masker content-top" />
                            <div className="background-masker content-first-end" />
                            <div className="background-masker content-second-line" />
                            <div className="background-masker content-second-end" />
                            <div className="background-masker content-third-line" />
                            <div className="background-masker content-third-end" />
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

const LoadingIndicator = ({ label, color }) => (
    <div
        style={{
            height: '200px',
            textAlign: 'center',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexDirection: 'column',
        }}
    >
        <p>Loading...</p>
    </div>
);

export { LoadingCard, LoadingPlaceholder2, LoadingIndicator };

export default LoadingPlaceholder;
