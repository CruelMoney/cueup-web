import React from 'react';

import { Body } from 'components/Text';
import { appRoutes } from 'constants/locales/appRoutes';

import { Container } from 'components/Blocks';
import Footer from '../../../components/common/Footer';
import SignUpForm from './SignUpForm';
import SignupHeader from './SignupHeader';

const Signup = ({ translate }) => {
    return (
        <>
            <SignupHeader />
            <Container style={{ marginTop: 50, marginBottom: 80, maxWidth: 900 }}>
                <div className="signup">
                    <Body style={{ marginBottom: 50 }}>
                        Fill out the form to create a profile. After you sign up, we will review
                        your profile to ensure that you meet our requirements. If you don't get
                        approved, we will let you know what changes you need to make. After you have
                        been approved, you will be welcomed and get access to all features.
                    </Body>
                    <SignUpForm translate={translate} />
                </div>
            </Container>
            <Footer
                noSkew
                firstTo={translate(appRoutes.becomeDj)}
                secondTo={translate(appRoutes.blog)}
                firstLabel={'Cueup for DJs'}
                secondLabel={'Blog'}
                title={'Join thousands of other DJs.'}
                subTitle={translate('Check the benefits, or read more on our blog.')}
            />
        </>
    );
};

export default Signup;
