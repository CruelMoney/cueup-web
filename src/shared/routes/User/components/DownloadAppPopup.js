import React from 'react';
import styled from 'styled-components';
import GracefullImage from 'components/GracefullImage';
import { RowWrap, Col, SecondaryButton } from 'components/Blocks';
import { Title, PageTitle, HeaderTitle } from 'components/Text';
import Popup from '../../../components/common/Popup';
import mobileIphone from '../../../assets/images/available-on/iphone_mobile.png';

import appStore from '../../../assets/icons/app_store_outline.png';
import playStore from '../../../assets/icons/play_outline.png';

const DownloadAppPopup = ({ isActive, close }) => {
    return (
        <Popup showing={isActive} onClickOutside={close} width={'800px'}>
            <Row between>
                <Wrapper>
                    <HeaderTitle dark divider>
                        Get Cueup Gigs
                    </HeaderTitle>
                    <DownloadButton>
                        <AppIcon src="https://is5-ssl.mzstatic.com/image/thumb/Purple123/v4/d1/7e/47/d17e4708-f5f4-f7da-95b7-c1ce274fb5e0/AppIcon-1x_U007emarketing-0-7-0-0-85-220.png/246x0w.png" />
                        <span>Android</span>
                    </DownloadButton>
                    <DownloadButton>
                        <AppIcon src="https://is5-ssl.mzstatic.com/image/thumb/Purple123/v4/d1/7e/47/d17e4708-f5f4-f7da-95b7-c1ce274fb5e0/AppIcon-1x_U007emarketing-0-7-0-0-85-220.png/246x0w.png" />
                        <span>iPhone</span>
                    </DownloadButton>
                </Wrapper>
                <Wrapper>
                    <GracefullImage src={mobileIphone} style={{ height: '400px' }} />
                </Wrapper>
            </Row>
        </Popup>
    );
};

const Row = styled(RowWrap)`
    @media screen and (min-width: 650px) {
        padding-left: 2em;
    }
`;

const Wrapper = styled.div`
    width: calc(50% - 1.5em);
    @media screen and (max-width: 650px) {
        width: 100%;
    }
`;

const DownloadButton = styled(SecondaryButton)`
    height: 130px;
    max-width: 100%;
    width: 100%;
    border-radius: 20px;
    background-color: #f6f8f9;
    text-align: left;
    padding-left: 30px;
    font-size: 24px;
    display: flex;
    align-items: center;
    margin-bottom: 20px;
    > span {
        margin: auto;
        text-align: center;
    }
    @media screen and (max-width: 650px) {
        height: 100px;
    }
`;

const AppIcon = styled.img`
    border-radius: 22%;
    width: 72px;
    height: 72px;
`;

export default DownloadAppPopup;
