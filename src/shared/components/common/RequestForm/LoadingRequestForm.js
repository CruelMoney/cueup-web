import React, { Component } from 'react';
import styled from 'styled-components';
import { Col, Card, CardShadow } from 'components/Blocks';
import { LoadingPlaceholder2 } from '../../../components/common/LoadingPlaceholder';

class LoadingForm extends Component {
    render() {
        return (
            <div className="request-form" id="book-dj">
                <div className="request-columns">
                    <Wrapper>
                        <LoadingCard>
                            <LoadingPlaceholder2 />
                            <LoadingPlaceholder2 />
                        </LoadingCard>
                        <CardShadow />
                    </Wrapper>
                </div>
            </div>
        );
    }
}

const LoadingCard = styled(Card)`
    flex-direction: column;
    padding: 24px;
    height: 369px;
    box-sizing: border-box;
    > div {
        margin-bottom: 24px;
    }
`;
const Wrapper = styled(Col)`
    position: relative;
    margin: auto;
    max-width: 600px;
    box-sizing: border-box;
    margin-top: 70px;
`;

export default LoadingForm;
