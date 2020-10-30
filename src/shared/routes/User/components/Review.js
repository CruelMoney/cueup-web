import React, { useEffect, useState, useRef } from 'react';
import { useMutation } from '@apollo/client';

import styled from 'styled-components';
import moment from 'moment-timezone';
import ReactDOM from 'react-dom';
import { Popper, usePopper } from 'react-popper';
import { ReviewSeoTag } from 'components/SeoTags';
import Rating from '../../../components/common/RatingNew';
import { HIGHLIGHT_REVIEW } from '../gql';
import QuotationMarkIcon from '../../../components/graphics/Quotes';
import { Col, Row, Avatar, ReadMoreText, TeritaryButton } from '../../../components/Blocks';
import ReadMoreExpander from '../../../components/ReadMoreExpander';
import { Title } from '../../../components/Text';

const Review = (props) => {
    const {
        id,
        title,
        rating,
        content,
        isTestimonial,
        author,
        citation,
        createdAt,
        removeTestimonial,
        isOwn,
    } = props;

    const [virtualReferenceElement, setVirtualReferenceElement] = useState(null);
    const [selection, setSelection] = useState(null);
    const [mounted, setMounted] = useState(false);
    const portal = useRef();

    const [addHighlight, { loading, data: hasAdded }] = useMutation(HIGHLIGHT_REVIEW, {
        update: () => {
            setTimeout(() => setVirtualReferenceElement(null), 3000);
        },
        variables: {
            id,
            selection,
        },
    });

    useEffect(() => {
        setMounted(true);
        portal.current = document.querySelector('#tooltip-portal');
    }, []);

    useEffect(() => {
        window.document.body.style.userSelect = 'none';

        return () => {
            window.document.body.style.userSelect = 'auto';
        };
    }, []);

    return (
        <ReviewWrapper>
            <ReviewSeoTag {...props} />
            <Title>{title}</Title>
            {isOwn && isTestimonial && (
                <RemoveButton onClick={() => removeTestimonial({ variables: { id } })}>
                    remove
                </RemoveButton>
            )}
            <Row middle style={{ marginTop: '36px' }}>
                <Col style={{ width: '100%' }}>
                    {isTestimonial && (
                        <Row middle style={{ marginBottom: '9px', marginTop: '2px' }}>
                            <QuotationMarkIcon
                                width={32}
                                height={24}
                                style={{ marginRight: '12px' }}
                            />
                            <ReadMoreText>TESTIMONIAL</ReadMoreText>
                            <div style={{ flex: 1 }} />
                            {rating && <Rating rating={rating} disabled />}
                        </Row>
                    )}
                    <ReadMoreExpander
                        onTextSelected={
                            isOwn
                                ? (rect, text) => {
                                      setVirtualReferenceElement(rect);
                                      setSelection(text);
                                  }
                                : null
                        }
                        content={content}
                    />
                    <Citation author={author} citation={citation} createdAt={createdAt} />
                </Col>
            </Row>
            {mounted &&
                isOwn &&
                portal.current &&
                ReactDOM.createPortal(
                    <ToolTip
                        virtualReferenceElement={virtualReferenceElement}
                        hasAdded={hasAdded}
                        loading={loading}
                        addHighlight={addHighlight}
                    />,
                    portal.current
                )}
        </ReviewWrapper>
    );
};

const ToolTip = ({ virtualReferenceElement, hasAdded, loading, addHighlight }) => {
    const [popperElement, setPopperElement] = useState(null);
    const { styles, attributes } = usePopper(virtualReferenceElement, popperElement);
    if (!virtualReferenceElement) {
        return null;
    }
    return (
        <div ref={setPopperElement} style={styles.popper} {...attributes}>
            <HighlightTooltip>
                <TeritaryButton
                    disabled={loading || hasAdded}
                    style={{ color: '#fff' }}
                    onClick={() => {
                        addHighlight();
                    }}
                >
                    {loading ? 'Adding...' : hasAdded ? 'Added' : 'Highlight on profile'}
                </TeritaryButton>
            </HighlightTooltip>
        </div>
    );
};

const RemoveButton = styled(TeritaryButton)`
    display: none;
    position: absolute;
    min-width: 0;
    height: 18px;
    top: 4px;
    right: -50px;
`;

const ReviewWrapper = styled.div`
    border-bottom: 1px solid #e9ecf0;
    margin-bottom: 60px;
    padding-bottom: 30px;
    margin-right: 24px;
    position: relative;
    ${RemoveButton} {
        right: 0;
    }
    :hover ${RemoveButton} {
        display: block;
    }
`;

const HighlightTooltip = styled.div`
    background: rgba(0, 0, 0, 0.84);
    border-radius: 4px;
`;

const AuthorName = styled.cite`
    font-weight: 600;
    font-size: 14px;
    color: #4d6480;
`;
const CreatedAtLabel = styled.p`
    font-weight: 600;
    font-size: 14px;
    color: #98a4b3;
`;
const Citation = ({ author, citation, createdAt }) => {
    const name = author ? author.userMetadata.firstName : citation;
    return (
        <Row right>
            {author && author.picure ? <Avatar size="small" src={author.picture.path} /> : null}
            <Col>
                <AuthorName>{name}</AuthorName>
                <CreatedAtLabel>{moment(createdAt).format('MMMM, YYYY')}</CreatedAtLabel>
            </Col>
        </Row>
    );
};

export default Review;
