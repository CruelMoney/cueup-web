import React, { Component } from 'react';
import { localize } from 'react-localize-redux';
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
        const { translate } = this.props;

        return (
            <div className="faq-content">
                <div className="container">
                    <div className="row">
                        <div className="col-md-3">
                            <div className="terms-navigation" ref={(ref) => (this.nav = ref)}>
                                <ButtonLink
                                    color={this.themeColor}
                                    to={translate('routes./faq/dj')}
                                >
                                    DJ
                                </ButtonLink>
                                <ButtonLink
                                    color={this.themeColor}
                                    to={translate('routes./faq/organizer')}
                                >
                                    {translate('Organizer')}
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
                    firstTo={translate('routes./')}
                    secondTo={translate('routes./signup')}
                    firstLabel={translate('arrange-event')}
                    secondLabel={translate('apply-to-become-dj')}
                    title={translate('ready-to-get-started')}
                    subTitle={translate('arrange-event-or-become-dj')}
                />
            </div>
        );
    }
}

export default localize(Faq, 'locale');
