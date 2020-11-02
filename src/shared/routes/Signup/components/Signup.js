import React from 'react';

import styled from 'styled-components';
import { Body } from 'components/Text';
import { appRoutes } from 'constants/locales/appRoutes';

import { Container, Hr, SmartButton } from 'components/Blocks';
import useSocialLogin from 'components/hooks/useSocialLogin';
import { useServerContext } from 'components/hooks/useServerContext';
import Footer from '../../../components/common/Footer';
import fbLogo from '../../../assets/icons/fb.svg';
import googleLogo from '../../../assets/icons/google.svg';
import SignupHeader from './SignupHeader';
import SignUpForm from './SignUpForm';

const SocialButton = styled(SmartButton)`
    min-width: 100%;
    margin-bottom: 12px;
    > span {
        position: relative;
        width: 100%;
    }

    > span:nth-child(2) {
        position: absolute;
        right: 1em;
        width: auto;
    }

    img {
        height: 20px;
        left: 0px;
        position: absolute;
        top: 50%;
        -webkit-transform: translateY(-50%);
        transform: translateY(-50%);
        width: 20px;
    }
`;

const Signup = ({ translate }) => {
    const { environment } = useServerContext();

    const [onPressSocial, { socialLoading }] = useSocialLogin({
        redirect: environment.WEBSITE_URL + '/complete-signup',
    });

    return (
        <>
            <SignupHeader />
            <Container style={{ marginTop: 50, marginBottom: 80, maxWidth: 900 }}>
                <SocialButton
                    level="secondary"
                    onClick={onPressSocial('facebook')}
                    loading={socialLoading === 'facebook'}
                >
                    <img src={fbLogo} alt="facebook logo" />
                    Continue with Facebook
                </SocialButton>

                <SocialButton
                    level="secondary"
                    onClick={onPressSocial('google')}
                    loading={socialLoading === 'google'}
                >
                    <img src={googleLogo} alt="google logo" />
                    Continue with Google
                </SocialButton>
                <Hr style={{ marginTop: 30 }} />
                <div className="signup">
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
