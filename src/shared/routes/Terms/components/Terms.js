import React, { Component } from 'react';
import { withTranslation } from 'react-i18next';
import { appRoutes } from 'constants/locales/appRoutes';
import { Container, Row, Col } from 'components/Blocks';
import Footer from '../../../components/common/Footer';
import ButtonLink from '../../../components/common/ButtonLink';

class Terms extends Component {
    render() {
        const { t } = this.props;

        return (
            <div>
                <Container>
                    <Row>
                        <Col style={{ marginRight: 30, position: 'sticky', top: 15 }}>
                            <ButtonLink
                                color={this.themeColor}
                                to={t(appRoutes.termsAgreements)}
                                style={{ marginBottom: 6 }}
                            >
                                Terms of Service
                            </ButtonLink>
                            <ButtonLink color={this.themeColor} to={t(appRoutes.termsPrivacy)}>
                                Privacy Policy
                            </ButtonLink>
                        </Col>

                        <Col>
                            <div className="card terms">{this.props.children}</div>
                        </Col>
                    </Row>
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
