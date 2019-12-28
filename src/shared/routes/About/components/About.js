import React, { Component } from 'react';
import Footer from '../../../components/common/Footer';

export default class About extends Component {
    themeColor = '#25F4D2';

    render() {
        return (
            <div className="">
                <div className="about-content container">
                    <div style={{ marginBottom: '100px' }} className="row">
                        <div className="col-sm-2" />
                        <div className="col-sm-8">
                            <h1>About Cueup</h1>
                            <p style={{ marginBottom: '30px' }}>
                                Cueup was founded in 2016 by Christopher Dengsø in Copenhagen,
                                Denmark. Since then the company has grown to parts of Asia and
                                America and continues to expand the community to new countries every
                                day.
                                <br />
                                <br />
                                We strive to help DJs get ahead in the world and connect them across
                                borders - all meanwhile making it easier for event organizers to
                                find a DJ than ever before.
                            </p>

                            <p className="terms_link">
                                Have questions? Read the{' '}
                                <a target="_blank" href="/faq/dj">
                                    FAQ
                                </a>
                            </p>
                            <p className="terms_link">
                                Feel like chatting?{' '}
                                <a
                                    onClick={(e) => {
                                        e.preventDefault();
                                        window.olark('api.box.expand');
                                    }}
                                >
                                    Send a message
                                </a>
                            </p>
                            <p className="terms_link">
                                By using Cueup, you agree to our{' '}
                                <a target="_blank" href="/terms/agreements">
                                    terms and conditions
                                </a>
                            </p>
                        </div>
                    </div>
                </div>
                <Footer
                    noSkew
                    color={this.themeColor}
                    firstTo="/"
                    secondTo="/signup"
                    firstLabel="Arrange event"
                    secondLabel="Become DJ"
                    title="Ready to get started?"
                    subTitle="Arrange an event, or apply to become DJ."
                />
            </div>
        );
    }
}
