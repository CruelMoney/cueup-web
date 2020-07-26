import React, { Component } from 'react';
import { appRoutes } from 'constants/locales/appRoutes.ts';
import { Container, Row, Col, CardSimple } from 'components/Blocks';
import Footer from '../../../components/common/Footer';
import ButtonLink from '../../../components/common/ButtonLink';

class Faq extends Component {
    render() {
        const { t } = this.props;

        return (
            <div>
                <Container>
                    <Row>
                        <Col style={{ marginRight: 30, position: 'sticky', top: 15 }}>
                            <ButtonLink
                                style={{ marginBottom: 6 }}
                                color={this.themeColor}
                                to={t(appRoutes.faqDj)}
                            >
                                DJ
                            </ButtonLink>
                            <ButtonLink color={this.themeColor} to={t(appRoutes.faqOrganizer)}>
                                {t('Organizer')}
                            </ButtonLink>
                        </Col>

                        <Col>
                            <CardSimple shadow className="card terms" style={{ padding: 30 }}>
                                {this.props.children}
                            </CardSimple>
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

export default Faq;
