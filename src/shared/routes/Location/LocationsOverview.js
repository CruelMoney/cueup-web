import React, { useRef } from 'react';
import { Redirect } from 'react-router';
import { Helmet } from 'react-helmet-async';
import styled from 'styled-components';
import { PrimaryButton, Row, Col, FullWidthCol } from 'components/Blocks';
import Footer from '../../components/common/Footer';
import MoneyIcon from '../../components/graphics/Money';
import NoteIcon from '../../components/graphics/Note';
import Map from '../../components/common/Map';
import citySvg from '../../assets/City.svg';
import addTranslate from '../../components/higher-order/addTranslate';
import { Environment } from '../../constants/constants';
import ScrollToTop from '../../components/common/ScrollToTop';
import AsyncRequestForm from '../../components/common/RequestForm';
import FloatingDJs from './components/FloatingCards';
import content from './content.json';
import locations from './locations';
import './index.css';

const Location = (props) => {
    const themeColor = '#31DAFF';
    const secondColor = '#25F4D2';

    const { match, translate } = props;
    const isMobile = false;
    const title = translate('locationsOverview.title');
    const description = translate('locationsOverview.description');

    return (
        <div className="locations-page">
            <Helmet>
                <title>{title + ' | Cueup'}</title>
                <meta name="description" content={description} />

                <meta property="og:title" content={title + ' | Cueup'} />
                <meta property="og:type" content={'website'} />
                <meta property="og:description" content={description} />

                <meta name="twitter:title" content={title + ' | Cueup'} />
                <meta name="twitter:description" content={description} />
            </Helmet>
            <ScrollToTop />
            <div className="span-wrapper">
                <header
                    style={{
                        height: '500px',
                        backgroundColor: '#ebebeb',
                    }}
                >
                    <Map
                        key={title}
                        noCircle={true}
                        hideRoads={true}
                        radius={4000000}
                        value={{
                            lat: 40.755983,
                            lng: -40.212879,
                        }}
                        height={500}
                        editable={false}
                        themeColor={themeColor}
                        locationName="playingLocation"
                    />
                    <article>
                        <div className="container fix-top-mobile">
                            <div className="col-md-5 col-sm-6">
                                <div className="card">
                                    <h1 key="title">
                                        <b>Locations</b>
                                    </h1>
                                    <p key="paragraph">{description}</p>
                                </div>
                            </div>
                        </div>
                    </article>
                </header>

                <div className="container">
                    <FormRow>
                        <FullWidthCol
                            style={{
                                margin: '60px 0',
                            }}
                        >
                            <Row around>
                                <Col>
                                    <ul>
                                        <li>Copenhagen</li>
                                        <li>Århus</li>
                                        <li>Odense</li>
                                    </ul>
                                </Col>
                                <Col>
                                    <h4>Bali</h4>
                                    <h4>Dubai</h4>
                                    <h4>New York City</h4>
                                    <h4>Los Angeles</h4>
                                </Col>
                            </Row>
                        </FullWidthCol>
                    </FormRow>
                </div>

                <img id="city-illustration" src={citySvg} />
            </div>

            <div className="info-boxes grey">
                <div className="container">
                    <div className="row">
                        <div className="col-sm-6 col-md-5 col-md-push-1">
                            <div className="card">
                                <h2>Clever stuff</h2>
                            </div>
                        </div>
                        <div className="col-sm-6 col-md-5 col-md-push-1">
                            <div className="card">
                                <h2>Clever stuff</h2>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <Footer
                bgColor="#FFFFFF"
                color={secondColor}
                firstTo={translate('routes./signup')}
                secondTo={translate('routes./how-it-works')}
                firstLabel={translate('become-dj')}
                secondLabel={translate('how-it-works')}
                title={translate('are-you-a-dj', { location: title })}
                subTitle={translate('apply-to-become-dj-or-see-how-it-works')}
            />
        </div>
    );
};
const FormRow = styled(Row)`
    padding-left: 200px;
    @media only screen and (max-width: 768px) {
        padding-left: 0px;
    }
`;
export default addTranslate(Location, content);
