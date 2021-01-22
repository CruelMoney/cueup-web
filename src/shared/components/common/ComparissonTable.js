import styled from 'styled-components';

export const ComparisonTable = styled.div`
    flex: 1;
    word-break: break-word;
    font-size: 16px;
    margin: 0.625em;
    margin-top: -2em;
    z-index: 2;
    text-align: left;
    table {
        width: 100%;
        border-collapse: separate;
        position: relative;
    }
    table::before {
        content: '';
        position: absolute;
        top: 1.75em;
        right: -0.625em;
        bottom: -0.625em;
        left: -0.625em;
        border-radius: 1.25em;
        padding: 0.625em;
        background-color: #122b48;
        box-shadow: 0px 4px 20px rgba(0, 0, 0, 0.4);
    }
    thead {
        th,
        td {
            padding-bottom: 1em;
        }
    }
    tbody {
        position: relative;
        color: #fff;
        tr:nth-of-type(2n + 1) {
            th,
            td {
                background-color: rgba(255, 255, 255, 0.1);
            }
        }
    }
    tr {
        position: relative;
        height: 2.625em;
        padding: 0.5em 0;
        span {
            display: inline-block;
            margin: 0.4em 0;
        }
    }
    td,
    th {
        padding-left: 0.625em;
        margin: 0;
        position: relative;

        svg {
            font-size: 1.3em;
            position: absolute;
            left: 0.375em;
            top: 50%;
            transform: translateY(-50%) !important;
        }
    }
    td:last-of-type {
        padding-left: 2.2em;
    }
    th {
        font-weight: 500;
    }

    th {
        border-top-left-radius: 0.625em;
        border-bottom-left-radius: 0.625em;
    }
    td:last-of-type {
        border-top-right-radius: 0.625em;
        border-bottom-right-radius: 0.625em;
    }
    td:before {
        content: '';
        display: block;
        position: absolute;
        top: 20%;
        left: 0;
        width: 2px;
        height: 60%;
        background-color: rgba(255, 255, 255, 0.15);
    }

    @media screen and (max-width: 768px) {
        width: calc(100% - 15px);
        min-width: calc(100% - 15px);
        margin-top: 3em;
        font-size: 12px;
    }
`;
