import React from 'react';

import { Body } from 'components/Text';
import { appRoutes } from 'constants/locales/appRoutes';

import Footer from '../../../components/common/Footer';
import SignUpForm from './SignUpForm';
import SignupHeader from './SignupHeader';

const Signup = ({ translate }) => {
    return (
        <>
            <SignupHeader />
            <div className="container" style={{ marginBottom: '80px' }}>
                <div className="signup">
                    <Body style={{ marginBottom: 50 }}>
                        Fill out the form to create a profile. After you sign up, we will review
                        your profile to ensure that you meet our requirements. If you don't get
                        approved, we will let you know what changes you need to make. After you have
                        been approved, you will be welcomed and get access to all features.
                    </Body>
                    <SignUpForm translate={translate} />
                </div>
            </div>
            <Footer
                noSkew
                firstTo={translate(appRoutes.howItWorks)}
                secondTo={translate(appRoutes.home)}
                firstLabel={translate('how-it-works')}
                secondLabel={translate('arrange-event')}
                title={translate('Wonder how it works?')}
                subTitle={translate('See how it works, or arrange an event.')}
            />
        </>
    );
};

export default Signup;
