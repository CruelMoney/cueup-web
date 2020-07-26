import React, { useState } from 'react';
import { NavLink as Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { SmartButton, Row, Container } from 'components/Blocks.js';
import { appRoutes } from 'constants/locales/appRoutes';
import posts from '../posts.json';
import Popup from '../../../components/common/Popup';
import NewsletterSignup from './NewsletterSignup';

const Blog = () => {
    const [showPopup, setShowPopup] = useState(false);

    const { t } = useTranslation();

    return (
        <div className="blog-overview">
            <header className="title">
                <h1>Blog</h1>
                <p>{t('blog:description')}</p>
                <Row center>
                    <SmartButton
                        color={'#25F4D2'}
                        active
                        glow
                        className="subscribe-newsletter"
                        onClick={() => setShowPopup(true)}
                    >
                        {t('subscribe')}
                    </SmartButton>
                </Row>
            </header>
            <main>
                <Container>
                    <div className="post-feed">
                        {posts.map((post) => {
                            const link = `${t(appRoutes.blog)}/${post.slug}`;
                            return (
                                <article key={post.slug} className="post-preview card">
                                    <div className={'img-wrapper ' + (post.thumbnail_fit || '')}>
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
                </Container>
            </main>
            <Popup showing={showPopup} onClickOutside={() => setShowPopup(false)}>
                <div className="blog">
                    <NewsletterSignup />
                </div>
            </Popup>
        </div>
    );
};

export default Blog;
