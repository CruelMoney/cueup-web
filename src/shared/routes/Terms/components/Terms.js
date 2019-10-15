import React, { Component } from 'react';
import { localize } from 'react-localize-redux';
import Footer from '../../../components/common/Footer';
import ButtonLink from '../../../components/common/ButtonLink';

class Terms extends Component {
    componentDidMount() {
        window.addEventListener('scroll', this.handleScroll);
    }
    componentWillUnmount() {
        window.removeEventListener('scroll', this.handleScroll);
    }
    themeColor = '#25F4D2';

    handleScroll = (event) => {
        const scrollTop = window.pageYOffset;
        if (scrollTop > 80) {
            this.nav.className = 'fixed terms-navigation';
        } else {
            this.nav.className = 'terms-navigation';
        }
    };
    render() {
        const { translate } = this.props;

        return (
            <div className="terms-content">
                <div className="container">
                    <div className="row">
                        <div className="col-md-3 ">
                            <div className="terms-navigation" ref={(ref) => (this.nav = ref)}>
                                <ButtonLink
                                    color={this.themeColor}
                                    to={translate('routes./terms/agreements')}
                                >
                                    <svg
                                        width="20"
                                        height="20"
                                        viewBox="0 0 20 20"
                                        xmlns="http://www.w3.org/2000/svg"
                                    >
                                        <title>icon-references</title>
                                        <g fillRule="evenodd">
                                            <path d="M9.928 4.41c-.634-.292-1.78-.75-2.89-.833-1.65-.125-2.936.086-3.72.192-.885.12-1.184.913-1.278 1.3H2c-.556 0-1 .448-1 1v7.65l2 .85v-1.912c.924.015 1.766.046 2.407.102a17.26 17.26 0 0 1 4.162.9v.273s.12-.057.344-.146c.33.126.513.21.513.21v-.402a17.26 17.26 0 0 1 4.162-.9c.64-.056 1.482-.087 2.405-.102v1.912l2-1.022v-7.48c0-.55-.443-.998-1-.998h-.04c-.093-.387-.392-1.18-1.277-1.3-.784-.107-2.07-.318-3.722-.193-1.195.09-2.434.615-3.028.898zm-2.07.686c-1.144-.276-3.757-.07-4.06-.026-.306.046-.445.215-.445.645v6.355s3.01-.18 4.176.026c1.164.205 1.507.908 1.507 1v-7c0-.356 0-.717-1.178-1zm8.324-.117c.304.044.443.213.443.643v6.356s-3.012-.138-4.177.067c-1.165.206-1.508.91-1.508 1v-7c0-.355 0-.716 1.178-1 1.146-.276 3.76-.114 4.064-.068z" />
                                            <path d="M6.637 14.566c-1.477-.168-4.32-.062-5.318-.017l1.8-2.418s1.39-.173 1.916-.13c1.99.163 3.617.635 4.494.937.143.048.563.048.695.003a18.833 18.833 0 0 1 4.505-.94c.526-.044 1.915.13 1.915.13l1.954 2.416c-.998-.046-3.842-.152-5.32.016-1.142.13-2.296.623-2.992.97H9.63c-.696-.347-1.85-.84-2.993-.97z" />
                                        </g>
                                    </svg>
                                    Terms of Service
                                </ButtonLink>
                                <ButtonLink
                                    color={this.themeColor}
                                    to={translate('routes./terms/privacy')}
                                >
                                    <svg
                                        width="20"
                                        height="20"
                                        viewBox="0 0 20 20"
                                        xmlns="http://www.w3.org/2000/svg"
                                    >
                                        <title>icon-references</title>
                                        <g fillRule="evenodd">
                                            <path d="M9.928 4.41c-.634-.292-1.78-.75-2.89-.833-1.65-.125-2.936.086-3.72.192-.885.12-1.184.913-1.278 1.3H2c-.556 0-1 .448-1 1v7.65l2 .85v-1.912c.924.015 1.766.046 2.407.102a17.26 17.26 0 0 1 4.162.9v.273s.12-.057.344-.146c.33.126.513.21.513.21v-.402a17.26 17.26 0 0 1 4.162-.9c.64-.056 1.482-.087 2.405-.102v1.912l2-1.022v-7.48c0-.55-.443-.998-1-.998h-.04c-.093-.387-.392-1.18-1.277-1.3-.784-.107-2.07-.318-3.722-.193-1.195.09-2.434.615-3.028.898zm-2.07.686c-1.144-.276-3.757-.07-4.06-.026-.306.046-.445.215-.445.645v6.355s3.01-.18 4.176.026c1.164.205 1.507.908 1.507 1v-7c0-.356 0-.717-1.178-1zm8.324-.117c.304.044.443.213.443.643v6.356s-3.012-.138-4.177.067c-1.165.206-1.508.91-1.508 1v-7c0-.355 0-.716 1.178-1 1.146-.276 3.76-.114 4.064-.068z" />
                                            <path d="M6.637 14.566c-1.477-.168-4.32-.062-5.318-.017l1.8-2.418s1.39-.173 1.916-.13c1.99.163 3.617.635 4.494.937.143.048.563.048.695.003a18.833 18.833 0 0 1 4.505-.94c.526-.044 1.915.13 1.915.13l1.954 2.416c-.998-.046-3.842-.152-5.32.016-1.142.13-2.296.623-2.992.97H9.63c-.696-.347-1.85-.84-2.993-.97z" />
                                        </g>
                                    </svg>
                                    Privacy Policy
                                </ButtonLink>
                            </div>
                        </div>

                        <div className="col-md-10">
                            <div className="card terms">{this.props.children}</div>
                        </div>
                    </div>
                </div>
                <Footer
                    color={this.themeColor}
                    firstTo={translate('routes./')}
                    secondTo={translate('routes./signup')}
                    firstLabel={translate('arrange-event')}
                    secondLabel={translate('apply-to-become-dj')}
                    title={translate('ready-to-get-started')}
                    subTitle={translate('arrange-event-or-become-dj')}
                />
            </div>
        );
    }
}

export default localize(Terms, 'locale');
