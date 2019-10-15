import React, { Component } from 'react';
import { Input, InputRow } from 'components/FormComponents';
import { SmartButton, Row, TextInput } from 'components/Blocks';
import Checkmark from '../../../assets/Checkmark';

class NewsletterSignup extends Component {
    state = {
        loading: false,
    };

    submit = (e) => {
        e.preventDefault();
        this.setState({
            loading: true,
        });
        const FD = new FormData(this.form);

        fetch('https://cudeup.createsend.com/t/d/s/firdyj/', {
            method: 'POST',
            body: FD,
            headers: {
                'content-type': 'application/json',
            },
            mode: 'no-cors',
        })
            .then((response) => {
                this.setState({
                    loading: false,
                    success: true,
                });
            })
            .catch((error) => {
                console.error('Error:', error);
                this.setState({
                    loading: false,
                    success: false,
                });
            });

        return false;
    };

    render() {
        const { loading, success } = this.state;
        return (
            <div className="newsletter-signup">
                <h3>Abonner på Cueup blog</h3>
                <p>Få de nyeste indlæg leveret direkte til din indboks.</p>
                <form
                    id="subForm"
                    className="js-cm-form"
                    method="post"
                    data-id=""
                    ref={(r) => {
                        if (r) {
                            this.form = r;
                        }
                    }}
                    onSubmit={this.submit}
                >
                    <Row
                        style={{
                            width: '100%',
                            marginTop: '16px',
                        }}
                    >
                        <TextInput
                            required
                            id="fieldEmail"
                            name="cm-firdyj-firdyj"
                            type="email"
                            placeholder="Email"
                            style={{ flex: 1, fontSize: '18px' }}
                        />
                        <SmartButton loading={loading} success={success} type="submit">
                            Abonnér
                            {success && (
                                <Checkmark
                                    style={{
                                        left: '6px',
                                        width: '15px',
                                        height: '15px',
                                        position: 'relative',
                                        marginRight: '-15px',
                                        top: '2px',
                                        marginTop: '-6px',
                                    }}
                                    color="white"
                                />
                            )}
                        </SmartButton>
                    </Row>
                </form>
            </div>
        );
    }
}

export default NewsletterSignup;
