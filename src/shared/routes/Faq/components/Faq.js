import React, { Component } from 'react';
import { appRoutes } from 'constants/locales/appRoutes.ts';
import Footer from '../../../components/common/Footer';
import ButtonLink from '../../../components/common/ButtonLink';

class Faq extends Component {
    componentDidMount() {
        window.addEventListener('scroll', this.handleScroll);
    }
    componentWillUnmount() {
        window.removeEventListener('scroll', this.handleScroll);
    }
    themeColor = '#25F4D2';

    handleScroll = (event) => {
        const scrollTop = window.pageYOffset;
        if (scrollTop > 80) {
            this.nav.className = 'fixed terms-navigation';
        } else {
            this.nav.className = 'terms-navigation';
        }
    };
    render() {
        const { t } = this.props;

        return (
            <div className="faq-content">
                <div className="container">
                    <div className="row">
                        <div className="col-md-3">
                            <div className="terms-navigation" ref={(ref) => (this.nav = ref)}>
                                <ButtonLink color={this.themeColor} to={t(appRoutes.faqDj)}>
                                    DJ
                                </ButtonLink>
                                <ButtonLink color={this.themeColor} to={t(appRoutes.faqOrganizer)}>
                                    {t('Organizer')}
                                </ButtonLink>
                            </div>
                        </div>

                        <div className="col-md-10">
                            <div className="card terms">{this.props.children}</div>
                        </div>
                    </div>
                </div>
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
