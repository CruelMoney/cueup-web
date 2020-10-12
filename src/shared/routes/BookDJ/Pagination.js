import React from 'react';
import styled, { css } from 'styled-components';
import { Icon } from '@iconify/react';
import backIcon from '@iconify/icons-ion/ios-arrow-back';
import forwardIcon from '@iconify/icons-ion/ios-arrow-forward';

const PaginationItem = styled.a`
    display: inline-block;
    width: 2.5em;
    height: 2.5em;
    border-radius: 50%;
    ${({ active }) =>
        active &&
        css`
            background-color: #e9ecf0;
            font-weight: 500;
        `}
    &:hover {
        background-color: #e9ecf0;
    }
    ${({ disabled }) =>
        disabled &&
        css`
            cursor: default;
        `}
    svg {
        height: 2.1em;
        font-size: 1.2em;
    }
`;

const PaginationWrapper = styled.ul`
    list-style: none;
    display: flex;
    margin: 0 auto;
    > li {
        text-align: center;
        margin: 0 0.1em;
        line-height: 2.5em;
        width: 2.5em;
        height: 2.5em;
    }
`;

const Pagination = ({
    onPageChange,
    activePage,
    ellipsisBuffer,
    totalPages,
    hrefConstructor,
    disabledPages = [],
}) => {
    const previousPage = activePage - 1;
    const previousHref = previousPage > 0 && hrefConstructor && hrefConstructor(previousPage);

    const nextPage = activePage + 1;
    const nextHref = nextPage < totalPages && hrefConstructor && hrefConstructor(nextPage);

    const pages = Array(totalPages)
        .fill(0)
        .map((item, index) => index + 1);

    const handleClick = (page) => (e) => {
        e.preventDefault();
        if (onPageChange) {
            onPageChange(page);
        }
    };

    return (
        <PaginationWrapper>
            {previousHref && (
                <li>
                    <PaginationItem onClick={handleClick(previousPage)} href={previousHref}>
                        <Icon icon={backIcon} />
                    </PaginationItem>
                </li>
            )}
            {(ellipsisBuffer
                ? getEllipsisItems(
                      {
                          ellipsisProps: {
                              disabledPages,
                              hrefConstructor,
                              onPageChange,
                          },
                          items: pages,
                      },
                      ellipsisBuffer,
                      activePage - 1
                  )
                : pages
            ).map((page, index) =>
                React.isValidElement(page) ? (
                    React.cloneElement(page, { key: `ellipsis${index}` })
                ) : (
                    <li key={page}>
                        <PaginationItem
                            active={page === activePage}
                            disabled={page === activePage || disabledPages.includes(page)}
                            href={hrefConstructor && hrefConstructor(page)}
                            onClick={handleClick(page)}
                        >
                            {page}
                        </PaginationItem>
                    </li>
                )
            )}
            {nextHref && (
                <li>
                    <PaginationItem href={nextHref} onClick={handleClick(nextPage)}>
                        <Icon icon={forwardIcon} />
                    </PaginationItem>
                </li>
            )}
        </PaginationWrapper>
    );
};

const getBufferList = (start, end, config) => {
    const { items } = config;

    const removedItems = items.slice(start, Math.max(end, start));

    if (removedItems.length > 1) {
        return [<li key="ellipsisComponent">{'...'}</li>];
    }

    return removedItems;
};

const getEllipsisItems = (config, ellipsisBuffer, activeIndex = 0) => {
    const { items } = config;

    const lastIndex = items.length - 1;

    const leftBufferEnd = activeIndex - ellipsisBuffer;

    const rightBufferStart = activeIndex + ellipsisBuffer + 1;

    const leftBuffer = getBufferList(1, leftBufferEnd, config);
    const rightBuffer = getBufferList(rightBufferStart, lastIndex, config);

    const newArray = [
        items[0],
        ...leftBuffer,
        ...items.slice(
            Math.max(activeIndex - ellipsisBuffer, 1),
            // Add 1 to account for active index
            Math.min(activeIndex + ellipsisBuffer + 1, lastIndex)
        ),
        ...rightBuffer,
    ];

    if (items.length > 1) {
        newArray.push(items[lastIndex]);
    }

    return newArray;
};

export default Pagination;
