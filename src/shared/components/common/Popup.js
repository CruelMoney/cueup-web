import React, { useEffect, useState, memo } from 'react';
import Modal from 'react-modal';
import styled from 'styled-components';
import { TeritaryButton } from 'components/Blocks';

const Popup = memo((props) => {
    const {
        showing,
        onClickOutside,
        onClose,
        noPadding,
        width,
        hideClose,
        noBackground,
        children,
        lazy = true,
        style,
    } = props;
    const [showingChildren, setShowingChildren] = useState(showing);

    useEffect(() => {
        if (!showing) {
            document.body.classList.remove('popup-open');
            //allow animation
            const time = setTimeout(() => {
                setShowingChildren(false);
            }, 500);
            return () => {
                clearTimeout(time);
            };
        }
        setShowingChildren(true);
        const time = setTimeout(() => {
            document.body.classList.add('popup-open');
        }, 100);
        return () => {
            clearTimeout(time);
            document.body.classList.remove('popup-open');
        };
    }, [showing]);

    const baseStyle = {
        overlay: {
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'none',
            zIndex: 1000,
            pointerEvents: 'none',
        },
        content: {
            position: 'absolute',
            overflow: 'auto',
            WebkitOverflowScrolling: 'touch',
            outline: 'none',
            padding: noPadding ? 0 : '20px',
            border: 'none',
            background: 'none',
            pointerEvents: 'none',
        },
    };
    return (
        <Modal style={baseStyle} isOpen={true} contentLabel="popup">
            <div
                className={'filter-background' + (showing ? ' active' : '')}
                style={{
                    position: 'fixed',
                    zIndex: '1000',
                    left: '0',
                    top: '0',
                    width: '100%',
                    height: '100% ',
                    overflow: 'auto',
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    padding: noPadding ? 0 : '10px',
                }}
                onClick={(_) => onClickOutside && onClickOutside()}
            >
                <div
                    style={{
                        padding: noPadding ? 0 : '20px',
                        paddingTop: hideClose || noPadding ? '0px' : '5px',
                        minWidth: '300px',
                        width: width ? width : null,
                        backgroundColor: noBackground ? 'transparent' : 'white',
                        zIndex: '1001',
                        ...style,
                    }}
                    className={
                        'card popup' + (showing ? ' active' : '') + (noPadding ? ' no-padding' : '')
                    }
                    onClick={function (event) {
                        event.stopPropagation();
                    }}
                >
                    {!hideClose ? (
                        <div
                            style={{
                                position: noPadding ? 'absolute' : 'relative',
                                textAlign: 'right',
                                right: noPadding ? '1em' : null,
                                width: '100%',
                            }}
                        >
                            <ClosePopupButton
                                data-cy="close-popup-button"
                                onClick={(_) => {
                                    if (onClose) {
                                        onClose();
                                        return;
                                    }
                                    onClickOutside && onClickOutside();
                                }}
                            >
                                ×
                            </ClosePopupButton>
                        </div>
                    ) : null}
                    {!lazy || showingChildren ? <div>{children}</div> : null}
                </div>
            </div>
        </Modal>
    );
});

const ClosePopupButton = styled(TeritaryButton)`
    font-size: 28px;
    color: #aaaaaa !important;
    font-weight: bold;
    cursor: pointer;
    border-radius: 20px;
    min-height: 40px;
    min-width: 40px;
    max-height: 40px;
    max-width: 40px;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 0;
    margin-left: auto;
    right: -10px;
`;

export default Popup;
