import React from 'react';

import styled from 'styled-components';
import { NavLink } from 'react-router-dom';
import { Container, RowWrap, ReadMore, RowMobileCol } from 'components/Blocks';
import { H3, Body } from 'components/Text';
import { ReactComponent as MusicNote } from '../assets/note.svg';
import { ReactComponent as Padlock } from '../assets/padlock.svg';

const FeatureCards = () => {
    return (
        <Container>
            <RowMobileCol style={{ margin: '0 -15px' }}>
                <Card shadow>
                    <H3>
                        <Padlock />
                        Secure booking
                    </H3>
                    <Body>
                        Tum dicere exorsus est laborum et via procedat oratio quaerimus igitur,
                        inquit, sic agam, ut aliquid ex ea voluptate et rationibus confirmare.
                    </Body>
                </Card>
                <Card shadow>
                    <H3>
                        <MusicNote />
                        Listen before booking
                    </H3>
                    <Body>
                        Tum dicere exorsus est laborum et via procedat oratio quaerimus igitur,
                        inquit, sic agam, ut aliquid ex ea voluptate et rationibus confirmare.
                    </Body>
                </Card>
            </RowMobileCol>
        </Container>
    );
};

const Card = styled.div`
    flex: 1;
    background: #ffffff;
    max-width: 100%;
    box-shadow: 0 0 12px 0 rgba(0, 0, 0, 0.06), 0 13px 13px 0 rgba(0, 0, 0, 0.08),
        0 20px 15px 0 rgba(0, 0, 0, 0.04);
    border-radius: 28px;
    padding: 39px;
    min-width: 300px;
    margin: 0 15px;
    margin-bottom: 30px;
    ${H3} {
        margin-bottom: 0.5em;
        color: #00d1ff;
        svg {
            display: block;
            margin-bottom: 0.25em;
            height: max(36px, 1em);
            width: auto;
        }
    }
    a {
        margin-top: 15px;
        display: block;
    }

    @media only screen and (max-width: 768px) {
        padding: 30px;
        margin-bottom: 15px;
    }
    @media only screen and (max-width: 425px) {
        padding: 24px;
    }
`;

export default FeatureCards;
