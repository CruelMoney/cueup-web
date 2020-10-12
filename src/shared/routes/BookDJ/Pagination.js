import React from 'react';
import styled, { css } from 'styled-components';
import { Icon } from '@iconify/react';
import backIcon from '@iconify/icons-ion/ios-arrow-back';
import forwardIcon from '@iconify/icons-ion/ios-arrow-forward';

const PaginationItem = styled.li`
    border-radius: 50%;
    cursor: pointer;
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
        width: 2.5em;
        height: 2.5em;
        text-align: center;
        margin: 0 0.1em;
        line-height: 2.5em;
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
    const previousHref = hrefConstructor && hrefConstructor(previousPage);

    const nextPage = activePage + 1;
    const nextHref = hrefConstructor && hrefConstructor(nextPage);

    const pages = Array(totalPages)
        .fill(0)
        .map((item, index) => index + 1);

    return (
        <PaginationWrapper>
            <PaginationItem>
                <Icon icon={backIcon} />
            </PaginationItem>
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
                    <PaginationItem
                        active={page === activePage}
                        disabled={page === activePage || disabledPages.includes(page)}
                        key={page}
                    >
                        <a
                            href={hrefConstructor && hrefConstructor(page)}
                            onClick={() => onPageChange && onPageChange(page)}
                        >
                            {page}
                        </a>
                    </PaginationItem>
                )
            )}
            <PaginationItem>
                <Icon icon={forwardIcon} />
            </PaginationItem>
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
