import React, { Component } from 'react';
import { Helmet } from 'react-helmet-async';
import Disqus from 'disqus-react';
import { posts } from '../posts.json';
import Formatter from '../../../utils/Formatter';
import Sharing from '../../../components/common/Sharing-v2';
import ButtonLink from '../../../components/common/ButtonLink';
import { Environment } from '../../../constants/constants';
import OnlyClientSide from '../../../components/higher-order/onlyClientSide';
import NewsletterSignup from './NewsletterSignup';

class Post extends Component {
    render() {
        const { match } = this.props;
        const { params, url } = match;
        const { postTitle } = params;

        const post = posts.find((p) => p.slug === postTitle);
        const publishedDate = new Date(post.updated_date);

        const disqusShortname = 'cueup';
        const disqusConfig = {
            url: String(Environment.CALLBACK_DOMAIN) + String(url),
            identifier: post.id,
            title: post.title,
        };

        const siteTitle = post.title + ' | Cueup Blog';

        return (
            <article className="blog-post">
                <Helmet>
                    <title>{siteTitle}</title>

                    <meta name="description" content={post.excerpt} />

                    <meta property="og:type" content="article" />
                    <meta property="og:title" content={siteTitle} />
                    <meta property="og:description" content={post.excerpt} />
                    <meta property="og:image" content={post.thumbnail_url} />

                    <meta name="twitter:title" content={siteTitle} />
                    <meta name="twitter:description" content={post.excerpt} />
                    <meta name="twitter:image" content={post.thumbnail_url} />

                    <meta property="article:content_tier" content="free" />
                    <meta property="article:published_time" content={post.published_date} />
                    <meta property="article:modified_time" content={post.updated_date} />
                    <meta property="article:tag" content={post.tag} />
                    <meta property="article:publisher" content="https://www.facebook.com/cueupdk" />
                </Helmet>

                <header className="title">
                    <time
                        dateTime={`${publishedDate.getFullYear()}-${publishedDate.getMonth() +
                            1}-${publishedDate.getDate()}`}
                    >
                        {Formatter.date.ToLocalString(publishedDate)}
                    </time>
                    {post.author_link ? (
                        <a className="author-link" href={post.author_link}>
                            Skrevet af {post.author}
                        </a>
                    ) : (
                        <p>Skrevet af {post.author}</p>
                    )}

                    <h1>{post.title}</h1>
                </header>
                <main>
                    <div className="img-wrapper">
                        <img src={post.thumbnail_url} alt={post.thumbnail_alt} />
                    </div>
                    <div className="container">
                        <div
                            className="post-content"
                            dangerouslySetInnerHTML={{ __html: post.content }}
                        />
                        <Sharing shareUrl={url} title={post.title} />
                        <div className="signup">
                            <h3>Bliv DJ hos Cueup</h3>
                            <p>
                                Opret en gratis bruger og begynd at blive tilbudt spillejobs. Log
                                ind med soundcloud, facebook eller din email. Ved tilmelding
                                accepterer du automatisk vores vilkår og betingelser.
                            </p>
                            <div className="row center" style={{ margin: '3em 0' }}>
                                <ButtonLink
                                    active
                                    glow
                                    color={'rgb(37, 244, 210)'}
                                    className="button"
                                    to={'/signup'}
                                >
                                    Apply to become dj
                                </ButtonLink>
                            </div>
                        </div>
                        <hr />
                        <OnlyClientSide>
                            <Disqus.DiscussionEmbed
                                shortname={disqusShortname}
                                config={disqusConfig}
                            />
                        </OnlyClientSide>
                    </div>
                </main>
                <footer className="newsletter-signup">
                    <div className="card">
                        <NewsletterSignup />
                    </div>
                </footer>
            </article>
        );
    }
}

export default Post;
