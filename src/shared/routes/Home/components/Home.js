import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { PrimaryButton } from 'components/Blocks';
import Footer from '../../../components/common/Footer';
import padlock from '../../../assets/padlock.svg';
import note from '../../../assets/note.svg';
import RequestForm from '../../../components/common/RequestForm';
import DJCards from './djCards';

class Home extends Component {
    getChildContext() {
        return {
            color: this.themeColor,
        };
    }

    componentDidMount() {
        // scrollIntoView.polyfill()
    }

    themeColor = '#25F4D2';
    secondColor = '#31DAFF';

    requestForm = null;

    handleButtonClick = () => {
        window.scroll({
            top: this.requestForm.offsetTop - 20,
            left: 0,
            behavior: 'smooth',
        });
    };

    render() {
        const { translate } = this.props;

        return (
            <div className="header-wrapper pull-up">
                <header>
                    <div id="stripes" className="v1" />
                    <div className="container">
                        <div className="row">
                            <div className="col-md-5">
                                <h1 key="title">{translate('home.title')}</h1>
                                <p key="paragraph">{translate('home.introduction')}</p>

                                <div style={{ float: 'left', marginTop: '42px' }}>
                                    <PrimaryButton white onClick={this.handleButtonClick}>
                                        {translate('find-djs')}
                                    </PrimaryButton>
                                </div>
                            </div>
                            <div className="col-md-8 dj-cards-wrapper">
                                <DJCards {...translate(['copenhagen', 'denmark'])} />
                            </div>
                        </div>
                    </div>
                </header>

                <div className="container request-form-wrapper">
                    <div ref={(f) => (this.requestForm = f)} />
                    <RequestForm />
                </div>

                <div className="info-boxes grey">
                    <div className="container">
                        <div className="row">
                            <div className="col-sm-6 col-md-5 col-md-push-1">
                                <div className="card">
                                    <img suppressHydrationWarning={true} src={padlock} alt="icon" />
                                    <h2 style={{ color: this.themeColor }}>
                                        {translate('home.sections.left.title')}
                                    </h2>
                                    <p>{translate('home.sections.left.content')}</p>
                                </div>
                            </div>
                            <div className="col-sm-6 col-md-5 col-md-push-1">
                                <div className="card">
                                    <img suppressHydrationWarning={true} src={note} alt="icon" />
                                    <h2 style={{ color: this.themeColor }}>
                                        {translate('home.sections.right.title')}
                                    </h2>
                                    <p>{translate('home.sections.right.content')}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <Footer
                    bgColor="#FFFFFF"
                    color={this.secondColor}
                    firstTo={translate('routes./signup')}
                    secondTo={translate('routes./how-it-works')}
                    firstLabel={translate('apply-to-become-dj')}
                    secondLabel={translate('how-it-works')}
                    title={translate('home.footer.first')}
                    subTitle={translate('home.footer.second')}
                />
            </div>
        );
    }
}

Home.childContextTypes = {
    color: PropTypes.string,
};

export default Home;
