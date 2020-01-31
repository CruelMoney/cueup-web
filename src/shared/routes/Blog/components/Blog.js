import React, { Component } from 'react';
import { NavLink as Link } from 'react-router-dom';
import { localize } from 'react-localize-redux';
import { SmartButton, Row } from 'components/Blocks.js';
import posts from '../posts.json';
import Popup from '../../../components/common/Popup';
import NewsletterSignup from './NewsletterSignup';

class Blog extends Component {
    state = {
        showPopup: false,
    };

    hidePopup = () => {
        this.setState({
            showPopup: false,
        });
    };
    showPopup = () => {
        this.setState({
            showPopup: true,
        });
    };

    render() {
        const { translate } = this.props;

        return (
            <div className="blog-overview">
                <header className="title">
                    <h1>Blog</h1>
                    <p>{translate('blog.description')}</p>
                    <Row center>
                        <SmartButton
                            color={'#25F4D2'}
                            active
                            glow
                            className="subscribe-newsletter"
                            onClick={this.showPopup}
                        >
                            {translate('subscribe')}
                        </SmartButton>
                    </Row>
                </header>
                <main>
                    <div className="container">
                        <div className="post-feed">
                            {posts.map((post) => {
                                const link = `${translate('routes./blog')}/${post.slug}`;
                                return (
                                    <article key={post.slug} className="post-preview card">
                                        <div className="img-wrapper">
                                            <Link to={link}>
                                                <img
                                                    src={post.thumbnail_url}
                                                    alt={post.thumbnail_alt}
                                                />
                                            </Link>
                                        </div>
                                        <Link to={link}>
                                            <section>
                                                <header>
                                                    <h2>{post.title}</h2>
                                                </header>
                                                <p className="post-card-excerpt">{post.excerpt}</p>
                                                <footer>
                                                    <p className="author">{post.author}</p>
                                                </footer>
                                            </section>
                                        </Link>
                                    </article>
                                );
                            })}
                        </div>
                    </div>
                </main>
                <Popup showing={this.state.showPopup} onClickOutside={this.hidePopup}>
                    <div className="blog">
                        <NewsletterSignup />
                    </div>
                </Popup>
            </div>
        );
    }
}

export default localize(Blog, 'locale');
