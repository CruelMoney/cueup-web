import React, { useState } from 'react';
import { useLocation } from 'react-router';

import LazyGig from 'routes/Gig';
import { Col, Hr, Row } from 'components/Blocks';
import { HeaderTitle } from 'components/Text';

import Pagination from 'components/Pagination';

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
}) => {
    const { pathname } = useLocation();

    return (
        <Row style={{ flex: 1 }}>
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
                    />
                ))}

                {!gigs.length && (
                    <Col center middle style={{ flexGrow: 1, maxWidth: 450, alignSelf: 'center' }}>
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
            </Col>
            <Col style={{ maxWidth: 350, marginLeft: 60, position: 'sticky', top: 15 }}>
                {rightSideChildren}
            </Col>
        </Row>
    );
};

export default Layout;
