import React, { useState } from 'react';
import { Manager, Reference, Popper } from 'react-popper';
import styled from 'styled-components';
import ReactDOM from 'react-dom';
import { BodySmall } from './Text';

const ToolTipBox = styled.div`
    opacity: ${({ showing }) => (showing ? 1 : 0)};
    pointer-events: none;
    background-color: #fff;
    border-radius: 4px;
    padding: 1em;
    color: #98a4b3;
    max-width: 300px;
    box-shadow: 0 1px 4px 0 rgba(152, 164, 179, 0.6);
`;

const Tooltip = ({ children, text, content }) => {
    const [showing, setShowing] = useState(false);
    const close = () => setShowing(false);
    const open = () => setShowing(true);

    return (
        <Manager>
            <Reference>{({ ref }) => children({ ref, close, open })}</Reference>
            {typeof document !== 'undefined' &&
                showing &&
                ReactDOM.createPortal(
                    <Popper placement="auto">
                        {({ ref, style, placement }) => (
                            <ToolTipBox
                                ref={ref}
                                style={style}
                                data-placement={placement}
                                showing={showing}
                            >
                                {content || <BodySmall>{text}</BodySmall>}
                            </ToolTipBox>
                        )}
                    </Popper>,
                    document.querySelector('#tooltip-portal')
                )}
        </Manager>
    );
};

export default Tooltip;
