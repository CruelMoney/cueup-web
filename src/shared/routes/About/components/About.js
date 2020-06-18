import React from 'react';
import { appRoutes } from 'constants/locales/appRoutes';
import useTranslate from 'components/hooks/useTranslate';
import { showOlark } from 'utils/olark/index';
import Footer from '../../../components/common/Footer';

export default () => {
    const themeColor = '#25F4D2';
    const { translate } = useTranslate();
    return (
        <div className="">
            <div className="about-content container">
                <div style={{ marginBottom: '100px' }} className="row">
                    <div className="col-sm-2" />
                    <div className="col-sm-8">
                        <h1>About Cueup</h1>
                        <p style={{ marginBottom: '30px' }}>
                            Cueup was founded in 2016 by Christopher Dengsø in Copenhagen, Denmark.
                            Since then the company has grown to parts of Asia and America and
                            continues to expand the community to new countries every day.
                            <br />
                            <br />
                            We strive to help DJs get ahead in the world and connect them across
                            borders - all meanwhile making it easier for event organizers to find a
                            DJ than ever before.
                        </p>

                        <p className="terms_link">
                            Have questions? Read the <a href={translate(appRoutes.faqDj)}>FAQ</a>
                        </p>
                        <p className="terms_link">
                            Feel like chatting?{' '}
                            <a
                                onClick={(e) => {
                                    e.preventDefault();
                                    showOlark();
                                }}
                            >
                                Send a message
                            </a>
                        </p>
                        <p className="terms_link">
                            By using Cueup, you agree to our{' '}
                            <a href={translate(appRoutes.termsAgreements)}>terms and conditions</a>
                        </p>
                    </div>
                </div>
            </div>
            <Footer
                noSkew
                color={themeColor}
                firstTo={translate(appRoutes.home)}
                secondTo={translate(appRoutes.signUp)}
                firstLabel={translate('Arrange event')}
                secondLabel={translate('Become DJ')}
                title={translate('Ready to get started?')}
                subTitle={translate('Arrange an event, or apply to become DJ.')}
            />
        </div>
    );
};
