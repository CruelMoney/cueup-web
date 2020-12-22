import { createGlobalStyle } from 'styled-components';

export const Style = createGlobalStyle`
    * {
        font-family: 'Avenir Next', Open Sans, Segoe UI, Helvetica, sans-serif;
        box-sizing: border-box;
    }
    body {
        color: #32325d;
        margin: 0;
    }
    p{
        margin: 0;
        text-rendering: optimizelegibility;
    }
    a{
        text-decoration: none
    }
    article {
        padding: 1em;
    }
`;
