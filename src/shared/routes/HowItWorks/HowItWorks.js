import React, { Component } from 'react';
import styled from 'styled-components';
import { Helmet } from 'react-helmet-async';
// import { findByLabelText } from '@testing-library/react';
import Footer from 'components/common/Footer';
import addTranslate from '../../components/higher-order/addTranslate';
import thumbEn from '../../assets/images/signup.png';
import thumbDa from '../../assets/images/signup_da.png';
import { Environment } from '../../constants/constants';
import ScrollToTop from '../../components/common/ScrollToTop';
import Hero from '../../components/common/Hero';
import { Title } from '../../components/common/Title';
import { Body } from '../../components/Text';

// import HighlightsLaptop from './components/HighlightsLaptop';
// import Integrations from './components/Integrations';
// import GettingGigs from './components/GettingGigs';
// import Payments from './components/Payments';
// import CancelationPolicy from './components/CancelationPolicy';
// import AvailableOn from './components/AvailableOn';
// import JoinThousands from './components/JoinThousands';
// import content from './content.json';

const Bg = styled.div`
    background-image: radial-gradient(50% 58% at 50% 33%, #122b48 12%, #0b1b2d 90%);
    z-index: -10;
`;

const halfOval = styled.div`
    background: #0b1b2d;
    /* border-radius: 0 0 50% 50%; */
    height: 100px;
    /* width: 100%;
    z-index: -10; */
`;

const CardWrapper = styled.div`
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
`;
const HowItWorksCardBox = styled.div`
    width: 278px;
    height: 242px;
    border-radius: 28px;
    background: #183659;
    margin: 20px;
`;
const HowItWorksCardHeader = styled.div`
    display: flex;
    height: 78px;
`;
const HowItWorksCardTitle = styled.div`
    width: 208px;
    height: 90px;
    display: flex;
    justify-content: flex-start;
    align-items: center;
    padding: 20px;
    margin-top: 0.3em;
`;
const HowItWorksCardNumberBox = styled.div`
    width: 75px;
    height: 90px;
    background: #1c3f69;
    border-radius: 28px 0 28px 0;
    display: flex;
    justify-content: center;
    align-items: center;
    padding-top: 14px;
    /* box-shadow: 1px 0px 5px #294566; */
    /* margin: -28px 0 0 -28px; */
`;
const HowItWorksCardDescription = styled.div`
    padding: 30px 20px;
    display: flex;
    justify-content: flex-start;
    align-items: center;
`;

const HowItWorksCard = (props) => {
    return (
        <HowItWorksCardBox>
            <HowItWorksCardHeader>
                <HowItWorksCardNumberBox>
                    <Title size="33px">{props.number}</Title>
                </HowItWorksCardNumberBox>
                <HowItWorksCardTitle>
                    <Title left size="24px" line="24px">
                        {props.title}
                    </Title>
                </HowItWorksCardTitle>
            </HowItWorksCardHeader>
            <HowItWorksCardDescription>
                <Body white>{props.description}</Body>
            </HowItWorksCardDescription>
        </HowItWorksCardBox>
    );
};

const HowItWorksCards = () => {
    const cardsData = [
        {
            number: '01',
            title: 'Tell us about your event.',
            description:
                'Certe, inquam, pertinax non fuisse torquem detraxit hosti et quidem.  detraxit hosti et quidem.',
        },
        {
            number: '02',
            title: 'Message the DJs.',
            description:
                'Certe, inquam, pertinax non fuisse torquem detraxit hosti et quidem.  detraxit hosti et quidem.',
        },
        {
            number: '03',
            title: 'Confirm booking.',
            description:
                'Certe, inquam, pertinax non fuisse torquem detraxit hosti et quidem.  detraxit hosti et quidem.',
        },
    ];
    const cards = cardsData.map((card) => (
        <HowItWorksCard
            key={card.number}
            number={card.number}
            title={card.title}
            description={card.description}
        />
    ));
    return <CardWrapper>{cards}</CardWrapper>;
};

class Index extends Component {
    render() {
        console.log('test');

        const { translate, currentLanguage } = this.props;
        const title = 'How it works | Cueup';
        const thumb = Environment.CALLBACK_DOMAIN + (currentLanguage === 'da' ? thumbDa : thumbEn);
        const themeColor = '#00d1ff';
        return (
            <>
                <Helmet>
                    <title>{title}</title>
                    <meta property="og:title" content={title} />
                    <meta name="twitter:title" content={title} />

                    <meta property="og:image" content={thumb} />
                    <meta name="twitter:image" content={thumb} />
                    <meta
                        name="apple-itunes-app"
                        content="app-id=1458267647, app-argument=userProfile"
                    />
                </Helmet>
                <ScrollToTop />
                <Bg>
                    <Hero
                        blueAccent="BOOKING A DJ"
                        firstTo={translate('routes./')}
                        titleLine1="How it works"
                        heroContent={<HowItWorksCards />}
                        heroButtonText="Find a DJ"
                    />
                    {/* <HighlightsLaptop />
                    <Integrations /> */}
                    {/* <div style={{ height: '1000px' }} />> */}
                </Bg>
                {/* <halfOval /> */}
                {/*<GettingGigs />
                <Payments />
                <CancelationPolicy />
                <AvailableOn />
                <JoinThousands
                    title={'Be part of a \n global community'}
                    description={
                        'Cueup is a growing community of DJs. Joining Cueup also means you become part of a group of the most talented and passionate DJs around the world.'
                    }
                    to={translate('routes./signup')}
                    label={translate('become-dj.join-thousands-of-DJs.apply-to-become-DJ')}
                /> */}
                <div style={{ height: '50vh' }} />
                <Footer
                    color={themeColor}
                    firstTo={translate('routes./signup')}
                    secondTo={translate('routes./blog')}
                    firstLabel={translate('Sign up')}
                    secondLabel={translate('Blog')}
                    title={translate('Ready to get started?')}
                    subTitle={translate('Apply to become DJ now, or read our blog.')}
                />
            </>
        );
    }
}

// export default addTranslate(Index, content);
export default addTranslate(Index);
