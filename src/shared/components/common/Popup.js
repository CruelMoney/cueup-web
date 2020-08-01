import React, { memo } from 'react';
import Modal from 'react-modal';
import styled, { createGlobalStyle } from 'styled-components';
import { ClosePopupButton, CardSimple } from 'components/Blocks';

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

    const baseStyle = {
        overlay: {
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            padding: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
            zIndex: 99,
        },
        content: {
            position: 'absolute',
            outline: 'none',
            border: 'none',
            background: 'none',
            left: 0,
            top: 0,
            right: 0,
            bottom: 0,
            padding: 0,
        },
    };
    const handleClose = (_) => {
        if (onClose) {
            onClose();
            return;
        }
        onClickOutside && onClickOutside();
    };

    return (
        <>
            <GlobalStyle />
            <Modal
                style={baseStyle}
                isOpen={showing}
                contentLabel="popup"
                bodyOpenClassName={'active'}
                htmlOpenClassName="popup-open"
                onRequestClose={handleClose}
            >
                <PopupContent
                    style={{
                        padding: noPadding ? 0 : '20px',
                        paddingTop: hideClose || noPadding ? '0px' : '5px',
                        width: width ? width : null,
                        backgroundColor: noBackground ? 'transparent' : 'white',
                        ...style,
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
                                style={{
                                    right: '-10px',
                                }}
                                onClick={handleClose}
                            />
                        </div>
                    ) : null}
                    {!lazy || showing ? children : null}
                </PopupContent>
            </Modal>
        </>
    );
});

const GlobalStyle = createGlobalStyle`
    .popup-open{
        overflow: hidden;
    }
`;

const PopupContent = styled(CardSimple)`
    overflow: auto;
    -webkit-overflow-scrolling: touch;
    min-width: 300px;
    position: absolute;
    transform: translate(-50%, -50%);
    top: 50%;
    left: 50%;
    @media screen and (max-width: 480px) {
        width: 100vw !important;
        height: 100% !important;
        border-radius: 0 !important;
    }
`;

export default Popup;
