import React, { useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { PrimaryButton } from 'components/Blocks';
import Footer from '../../../components/common/Footer';
import padlock from '../../../assets/padlock.svg';
import note from '../../../assets/note.svg';
import RequestForm from '../../../components/common/RequestForm';
import DJCards from './djCards';

const Home = () => {
    const requestForm = useRef();
    const { t } = useTranslation();

    const handleButtonClick = () => {
        window.scroll({
            top: requestForm.current.offsetTop - 20,
            left: 0,
            behavior: 'smooth',
        });
    };

    return (
        <div className="header-wrapper pull-up">
            <header>
                <div id="stripes" className="v1">
                    <span />
                </div>
                <div className="container">
                    <div className="row">
                        <div className="col-md-5">
                            <h1 key="title">{t('home.title')}</h1>
                            <p key="paragraph">{t('home.introduction')}</p>

                            <div style={{ float: 'left', marginTop: '20px' }}>
                                <PrimaryButton invert onClick={handleButtonClick}>
                                    {t('get-offers')}
                                </PrimaryButton>
                            </div>
                        </div>
                        <div className="col-md-8 dj-cards-wrapper">
                            <DJCards {...t(['copenhagen', 'denmark'])} />
                        </div>
                    </div>
                </div>
            </header>

            <div className="container request-form-wrapper">
                <div ref={requestForm} />
                <RequestForm />
            </div>

            <div className="info-boxes grey">
                <div className="container">
                    <div className="row">
                        <div className="col-sm-6 col-md-5 col-md-push-1">
                            <div className="card">
                                <img suppressHydrationWarning={true} src={padlock} alt="icon" />
                                <h2>{t('home.sections.left.title')}</h2>
                                <p>{t('home.sections.left.content')}</p>
                            </div>
                        </div>
                        <div className="col-sm-6 col-md-5 col-md-push-1">
                            <div className="card">
                                <img suppressHydrationWarning={true} src={note} alt="icon" />
                                <h2>{t('home.sections.right.title')}</h2>
                                <p>{t('home.sections.right.content')}</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <Footer
                bgColor="#FFFFFF"
                firstTo={t('routes./signup')}
                secondTo={t('routes./how-it-works')}
                firstLabel={t('become-dj')}
                secondLabel={t('how-it-works')}
                title={t('home.footer.first')}
                subTitle={t('home.footer.second')}
            />
        </div>
    );
};

export default Home;
