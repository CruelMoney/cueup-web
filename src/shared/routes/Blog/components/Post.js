import React from 'react';
import { Helmet } from 'react-helmet-async';
import Disqus from 'disqus-react';
import styled from 'styled-components';
import { useServerContext } from 'components/hooks/useServerContext';
import { Hr, Container, CardSimple, Row, Col, Card } from 'components/Blocks';
import posts from '../posts';
import Sharing from '../../../components/common/Sharing-v2';
import ButtonLink from '../../../components/common/ButtonLink';
import OnlyClientSide from '../../../components/higher-order/onlyClientSide';
import NewsletterSignup from './NewsletterSignup';

const Post = ({ match }) => {
    const { environment } = useServerContext();

    const { params, url } = match;
    const { postTitle } = params;

    const post = posts.find((p) => p.slug === postTitle);
    const publishedDate = new Date(post.updated_date.split(' ')[0]);

    const disqusShortname = 'cueup';
    const disqusConfig = {
        url: String(environment.CALLBACK_DOMAIN) + String(url),
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
                <meta
                    property="article:publisher"
                    content="https://www.facebook.com/cueup.dj.booking"
                />
            </Helmet>

            <header className="title">
                <time
                    dateTime={`${publishedDate.getFullYear()}-${
                        publishedDate.getMonth() + 1
                    }-${publishedDate.getDate()}`}
                >
                    {publishedDate.toLocaleDateString(undefined, {
                        weekday: 'long',
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                    })}
                </time>
                {post.author_link ? (
                    <a className="author-link" href={post.author_link}>
                        Written by {post.author}
                    </a>
                ) : (
                    <p>Written by {post.author}</p>
                )}

                <h1>{post.title}</h1>
            </header>
            <main>
                {!post.hide_image && (
                    <div className={'img-wrapper ' + (post.thumbnail_fit || '')}>
                        <img src={post.thumbnail_url} alt={post.thumbnail_alt} />
                    </div>
                )}
                <Container className="container">
                    <div
                        className="post-content"
                        dangerouslySetInnerHTML={{ __html: post.content }}
                    />
                    <Sharing shareUrl={url} title={post.title} />
                    <CallToBlock category={post.category} />
                    <Hr />
                    <OnlyClientSide>
                        <Disqus.DiscussionEmbed shortname={disqusShortname} config={disqusConfig} />
                    </OnlyClientSide>
                </Container>
            </main>
        </article>
    );
};

const CallToBlock = ({ category }) => {
    const title = {
        organizer: 'Find a DJ',
        dj: 'Become DJ at Cueup',
    };

    const content = {
        organizer:
            "Cueup makes it easier than ever to find a DJ. Enter a details about your event and we'll help you today.",
        dj:
            'Cueup is one of the easiest ways to evolve your DJ career. Create a free profile and start getting gigs today.',
    };

    const link = {
        dj: '/signup',
        organizer: '/',
    };
    const button = {
        dj: 'Apply to become dj',
        organizer: 'Find a DJ',
    };
    return (
        <CTACard shadow className="signup">
            <h3>{title[category] ?? title.dj}</h3>
            <p>{content[category] ?? content.dj}</p>
            <ButtonLink
                active
                glow
                color={'rgb(37, 244, 210)'}
                className="button"
                to={link[category] ?? link.dj}
            >
                {button[category] ?? button.dj}
            </ButtonLink>
        </CTACard>
    );
};

const CTACard = styled(Card)`
    padding: 2em 4em;
    margin-bottom: 60px;
    text-align: center;

    button,
    h3,
    a {
        margin: auto;
    }
`;

export default Post;
