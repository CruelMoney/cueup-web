import React from 'react';
import styled from 'styled-components';
import { useTranslation } from 'react-i18next';
import { Container } from 'components/Blocks';
import { appRoutes } from 'constants/locales/appRoutes';
import PaymentCards from './PaymentCards';

const Bg = styled.div`
    display: flex;
    justify-content: center;
    width: 100%;
    order: 6;
    margin-top: -300px;
    z-index: 2;
    position: relative;
`;

const Payments = () => {
    const { t } = useTranslation();
    return (
        <Bg>
            <Container>
                <PaymentCards
                    link={t(appRoutes.blog) + '/new-direct-payout-method'}
                    accent="GET PAYMENTS EASIER"
                    header1={'Get card payments'}
                    description1={
                        'Accept card payments from your customers through Cueup. We take care of charging the organizer, and transfer directly to your bank account.'
                    }
                    header2={'Get cash payments'}
                    description2={
                        'You can also be responsible for charging the organizer yourself, and ask for the payment however your like. Cash, invoice or another payment system.'
                    }
                />
            </Container>
        </Bg>
    );
};

export default Payments;
