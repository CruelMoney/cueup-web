import React from 'react';
import { Helmet } from 'react-helmet-async';
import styled, { keyframes } from 'styled-components';
import { NavLink } from 'react-router-dom';
import { Container, Card, Avatar, ReadMore } from 'components/Blocks';
import { Body } from 'components/Text';
import posts from '../posts';
import Sharing from '../../../components/common/Sharing-v2';
import swirlyArrow from '../../../assets/icons/swirly-scribbled-arrow.png';

const Post = ({ match }) => {
    const { params, url } = match;
    const { postTitle } = params;

    const post = posts.find((p) => p.slug === postTitle);
    const publishedDate = new Date(post.updated_date.split(' ')[0]);

    const siteTitle = post.title + ' | Cueup Blog';

    return (
        <article className="blog-post">
            <Helmet>
                <title>{siteTitle}</title>

                <meta name="description" content={post.excerpt} />

                <meta property="og:type" content="article" />
                <meta property="og:title" content={siteTitle} />
                <meta property="og:description" content={post.excerpt} />
                <meta property="og:image" content={post.og_image || post.thumbnail_url} />

                <meta name="twitter:title" content={siteTitle} />
                <meta name="twitter:description" content={post.excerpt} />
                <meta name="twitter:image" content={post.twitter_image || post.thumbnail_url} />

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
                {post.author_image && (
                    <Avatar
                        size="large"
                        style={{ margin: 'auto', marginBottom: 12 }}
                        src={post.author_image}
                        alt="Author image"
                    />
                )}

                {post.author_link ? (
                    <a className="author-link" href={post.author_link}>
                        By {post.author}
                    </a>
                ) : (
                    <p>By {post.author}</p>
                )}
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

                <h1>{post.title}</h1>
            </header>
            <main>
                {!post.hide_image && (
                    <div className={'img-wrapper ' + (post.thumbnail_fit || '')}>
                        <img src={post.thumbnail_url} alt={post.thumbnail_alt} loading="lazy" />
                    </div>
                )}
                <Container className="container">
                    <div
                        className="post-content"
                        dangerouslySetInnerHTML={{ __html: post.content }}
                    />
                    <CallToBlock category={post.category} />
                    <Sharing shareUrl={url} title={post.title} />
                </Container>
            </main>
        </article>
    );
};

const shakeAnimation = keyframes`
  0% { transform: translate(-100%, 0%) rotate(135deg) }
  100% { transform:  translate(-100%, 0%) rotate(145deg) }
`;

const ArrowIndicator = styled.div`
    background: url('${swirlyArrow}');
    height: 60px;
    width: 60px;
    display: block;
    background-position: center;
    background-repeat: no-repeat;
    background-size: cover;
    transform-origin: center right;
    animation-name: ${shakeAnimation};
    animation-duration: 1s;
    animation-iteration-count: infinite;
    animation-timing-function: steps(2, start);
    margin: auto;
    margin-top: 60px;
`;

const CallToBlock = ({ category }) => {
    const title = {
        organizer: 'Find a DJ for you party',
        dj: 'Get more DJ gigs',
    };

    const content = {
        organizer:
            'Cueup makes it easier than ever to find a great DJ. Search DJs, check prices, and book a DJ near you.',
        dj:
            'Create a free DJ profile and check the gigs in your city. Cueup makes it easy to get booked. ',
    };

    const link = {
        dj: '/signup',
        organizer: '/s',
    };
    const button = {
        dj: 'Sign up as DJ',
        organizer: 'Find a DJ now',
    };
    return (
        <NavLink to={link[category] ?? link.dj}>
            <ArrowIndicator />
            <CTACard shadow className="signup">
                <h3>{title[category] ?? title.dj}</h3>
                <Body center>{content[category] ?? content.dj}</Body>

                <ReadMore size="18px" uppercase={false} white center style={{ marginTop: 24 }}>
                    {button[category] ?? button.dj}
                </ReadMore>
            </CTACard>
        </NavLink>
    );
};

const CTACard = styled(Card)`
    padding: 2em 0.5em;
    margin-bottom: 60px;
    text-align: center;
    box-shadow: none;
    background-color: #31daff;
    transition: 200ms ease;
    display: flex;
    flex-direction: column;
    button,
    h3,
    a,
    p {
        color: white !important;
        margin: auto !important;
        max-width: 500px;
    }
    p {
        font-weight: 500;
    }
    h3 {
        margin-bottom: 15px !important;
    }
    &:hover {
        background-color: #00d1ff;
        transition: 700ms ease;
    }
    button {
        margin-top: 24px;
        background: transparent !important;
    }
`;

export default Post;
