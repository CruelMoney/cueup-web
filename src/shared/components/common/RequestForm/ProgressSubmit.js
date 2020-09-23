import React from 'react';
import styled from 'styled-components';

const ProgressWrapper = styled.div`
    display: flex;
    flex-direction: row;
    width: 100px;
    justify-content: space-around;
    margin: 0 auto;
`;

const Step = styled.span`
    height: 10px;
    width: 10px;
    border-radius: 5px;
    background-color: #4d6480;
    opacity: ${({ completed }) => (completed ? 0.8 : 0.3)};
`;

const ProgressSubmit = ({ currentStep, setProgress }) => {
    const steps = [0, 1, 2];

    if (currentStep === 3) {
        return null;
    }

    return (
        <ProgressWrapper>
            {steps.map((v) => (
                <Step key={v} completed={v < currentStep} />
            ))}
        </ProgressWrapper>
    );
};

export default ProgressSubmit;
