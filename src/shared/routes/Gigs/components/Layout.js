import React, { useState } from 'react';
import { useLocation } from 'react-router';

import { Helmet } from 'react-helmet-async';
import styled from 'styled-components';
import LazyGig from 'routes/Gig';
import { Col, Hr, Row } from 'components/Blocks';
import { HeaderTitle } from 'components/Text';

import Pagination from 'components/Pagination';

import Sidebar from 'components/Sidebar';
import { Media } from 'components/MediaContext';
import GigCard from '../components/GigCard';

const Layout = ({
    title,
    children,
    gigs,
    loading,
    emptyChildren,
    pagination,
    setPagination,
    rightSideChildren,
    opportunity,
    user,
}) => {
    const { pathname } = useLocation();

    const metaTitle = `${title} · Cueup`;
    return (
        <>
            <Row style={{ flex: 1 }}>
                <Helmet>
                    <title>{metaTitle}</title>
                    <meta property="og:title" content={metaTitle} />
                    <meta name="twitter:title" content={metaTitle} />
                    <meta name="robots" content="noindex" />
                </Helmet>

                <Col style={{ flexGrow: 1 }}>
                    <HeaderTitle dark>{title}</HeaderTitle>
                    <Hr style={{ marginBottom: 24 }} />
                    {children}
                    {gigs.map((gig, idx) => (
                        <GigCard
                            loading={loading}
                            key={gig?.id || idx}
                            idx={idx}
                            onMouseEnter={() => LazyGig.preload()}
                            hasMessage={gig?.hasMessage}
                            gig={gig}
                            opportunity={opportunity}
                        />
                    ))}

                    {!gigs.length && (
                        <Col
                            center
                            middle
                            style={{
                                flexGrow: 1,
                                maxWidth: 450,
                                alignSelf: 'center',
                                marginTop: 100,
                            }}
                        >
                            {emptyChildren}
                        </Col>
                    )}

                    <Row style={{ marginBottom: 30 }}>
                        {!!gigs.length && (
                            <Pagination
                                activePage={pagination.page}
                                ellipsisBuffer={2}
                                onPageChange={(page) => {
                                    setPagination((pp) => ({ ...pp, page }));
                                }}
                                totalPages={pagination?.totalPages}
                                hrefConstructor={(page) => `${pathname}?page=${page}`}
                            />
                        )}
                    </Row>
                    <BottomRowMobile>{rightSideChildren}</BottomRowMobile>
                </Col>
                <RightSideBar>{rightSideChildren}</RightSideBar>
            </Row>
        </>
    );
};

const RightSideBar = styled(Col)`
    max-width: 350px;
    margin-left: 30px;
    position: sticky;
    top: 15px;
    > * {
        margin-bottom: 15px;
    }
    @media only screen and (max-width: 1399px) {
        display: none;
    }
`;

const BottomRowMobile = styled(Row)`
    display: none;
    > * {
        margin-bottom: 15px;
    }
    @media only screen and (max-width: 1399px) {
        display: block;
    }
`;

export default Layout;
