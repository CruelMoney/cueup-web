import React from 'react';

import styled from 'styled-components';
import { NavLink } from 'react-router-dom';
import { Container, RowWrap, ReadMore } from 'components/Blocks';
import { H3, Body } from 'components/Text';
import { ReactComponent as MusicNote } from '../assets/note.svg';
import { ReactComponent as Padlock } from '../assets/padlock.svg';

const FeatureCards = () => {
    return (
        <Container style={{ marginBottom: 30 }}>
            <RowWrap>
                <Card shadow>
                    <H3>
                        <Padlock height={'1em'} width="auto" />
                        Secure booking
                    </H3>
                    <Body>
                        Tum dicere exorsus est laborum et via procedat oratio quaerimus igitur,
                        inquit, sic agam, ut aliquid ex ea voluptate et rationibus confirmare.
                    </Body>
                    <NavLink to="/">
                        <ReadMore uppercase={false} color="#00d1ff" style={{ fontSize: 18 }}>
                            Read more
                        </ReadMore>
                    </NavLink>
                </Card>
                <div style={{ height: 30, width: 30 }} />
                <Card shadow>
                    <H3>
                        <MusicNote height={'1em'} width="auto" />
                        Listen before booking
                    </H3>
                    <Body>
                        Tum dicere exorsus est laborum et via procedat oratio quaerimus igitur,
                        inquit, sic agam, ut aliquid ex ea voluptate et rationibus confirmare.
                    </Body>
                    <NavLink to="/">
                        <ReadMore uppercase={false} color="#00d1ff" style={{ fontSize: 18 }}>
                            Read more
                        </ReadMore>
                    </NavLink>
                </Card>
            </RowWrap>
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
    ${H3} {
        margin-bottom: 0.5em;
        color: #00d1ff;
        svg {
            display: block;
            margin-bottom: 0.25em;
        }
    }
    a {
        margin-top: 15px;
        display: block;
    }

    @media only screen and (max-width: 768px) {
        padding: 30px 30px 0 30px;
    }
    @media only screen and (max-width: 425px) {
        margin: 0px;
        margin-top: 15px;
        padding: 24px 36px 0 24px;
    }
`;

export default FeatureCards;
