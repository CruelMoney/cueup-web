import React, { Component } from 'react';
import { withTranslation } from 'react-i18next';
import styled from 'styled-components';
import { appRoutes } from 'constants/locales/appRoutes';
import { Container, Col, CardSimple, RowMobileCol, Row } from 'components/Blocks';
import Footer from '../../../components/common/Footer';
import ButtonLink from '../../../components/common/ButtonLink';

const ButtonContainer = styled(Col)`
    margin-right: 30px;
    position: sticky;
    top: 15px;
    z-index: 2;
    @media only screen and (max-width: 425px) {
        flex-direction: row;
        overflow: scroll;
        max-width: calc(100vw - 15px);
        padding-bottom: 12px;
        -webkit-overflow-scrolling: touch;
        > * {
            margin-right: 9px;
        }
    }
`;

const ContainerRow = styled(Row)`
    @media only screen and (max-width: 425px) {
        flex-direction: column;
    }
`;

class Terms extends Component {
    render() {
        const { t } = this.props;

        return (
            <div>
                <Container>
                    <ContainerRow>
                        <ButtonContainer>
                            <ButtonLink
                                color={this.themeColor}
                                to={t(appRoutes.termsAgreements)}
                                style={{ marginBottom: 6 }}
                            >
                                Terms of Service
                            </ButtonLink>
                            <ButtonLink
                                color={this.themeColor}
                                to={t(appRoutes.termsPrivacy)}
                                style={{ marginBottom: 6 }}
                            >
                                Privacy Policy
                            </ButtonLink>
                            <ButtonLink color={this.themeColor} to={t(appRoutes.termsCookie)}>
                                Cookie Policy
                            </ButtonLink>
                        </ButtonContainer>

                        <Col>
                            <CardSimple
                                shadow
                                className="card terms"
                                style={{ padding: 30, maxWidth: 'calc(100vw - 30px)' }}
                            >
                                {this.props.children}
                            </CardSimple>
                        </Col>
                    </ContainerRow>
                </Container>
                <Footer
                    color={this.themeColor}
                    firstTo={t(appRoutes.home)}
                    secondTo={t(appRoutes.signUp)}
                    firstLabel={t('arrange-event')}
                    secondLabel={t('apply-to-become-dj')}
                    title={t('ready-to-get-started')}
                    subTitle={t('arrange-event-or-become-dj')}
                />
            </div>
        );
    }
}

export default withTranslation()(Terms);
