import React, { useState, useRef } from 'react';
import styled, { css } from 'styled-components';
import { InlineIcon } from '@iconify/react';
import starIcon from '@iconify/icons-ion/star';
import { useRouteMatch } from 'react-router';
import { NavLink } from 'react-router-dom';
import Checkmark from '../assets/Checkmark';
import {
    Row,
    Col,
    secondaryButtonStyle,
    LoadingIndicator,
    Select,
    ButtonInput,
    FileInputWrapper,
    inputStyle,
    TextInput,
    FileInput,
} from './Blocks';
import { Title, Body, BodySmall } from './Text';
import Checkbox from './Checkbox';
import { useValidation } from './hooks/useForm';
import ConditionalWrap from './ConditionalWrap';

const Label = styled.label`
    font-size: 18px;
    color: #4d6480;
    font-weight: 300;
    display: inline-block;
    .error {
        margin-bottom: 0;
    }
`;

export const InputLabel = styled(Label)`
    margin-bottom: 30px;
    min-width: 100%;
    flex: 2;
    > * {
        margin-top: 6px;
    }
`;

export const LabelHalf = styled(InputLabel)`
    flex: 1;
`;

const SectionRow = styled(Row)`
    padding-bottom: 30px;
    margin-bottom: 42px;
    border-bottom: 1px solid #e9ecf0;
    flex-wrap: wrap;
`;

const LeftCol = styled(Col)`
    min-width: 250px;
    flex: 1;
    margin-right: 42px;
    position: sticky;
    top: ${({ stickyTop }) => stickyTop};
    @media only screen and (max-width: 1024px) {
        position: initial;
    }
`;

export const InputRow = styled(Row)`
    flex-wrap: wrap;
    ${({ small }) =>
        small
            ? css`
                  margin-right: -15px;
                  .suggestionList {
                      min-width: calc(100% - 15px);
                      margin-right: 15px;
                      align-self: flex-start;
                      label {
                          margin-bottom: 0;
                      }
                  }
                  ${InputLabel} {
                      min-width: calc(100% - 15px);
                      margin-right: 15px;
                      align-self: flex-start;
                  }
                  ${LabelHalf},
                  .half {
                      margin-right: 15px;
                      min-width: calc(50% - 15px);
                      width: calc(50% - 15px);
                      align-self: flex-start;
                  }
              `
            : css`
                  margin-right: -36px;
                  .suggestionList {
                      min-width: calc(100% - 36px);
                      margin-right: 36px;
                      align-self: flex-start;
                  }
                  ${InputLabel} {
                      min-width: calc(100% - 36px);
                      margin-right: 36px;
                      align-self: flex-start;
                  }
                  ${LabelHalf},
                  .half {
                      margin-right: 36px;
                      min-width: calc(50% - 36px);
                      width: calc(50% - 36px);
                      align-self: flex-start;
                  }
              `}
    @media only screen and (max-width: 425px) {
        margin-right: -15px;
        ${LabelHalf},
        .half {
            margin-right: 15px;
            min-width: calc(100% - 15px);
            width: calc(100% - 15px);
        }
    }
`;

const RightCol = styled(InputRow)`
    flex: 2;
    min-width: 400px;
    flex-wrap: wrap;
    ${({ disable }) =>
        disable &&
        css`
            opacity: 0.25;
            pointer-events: none;
        `}
    @media only screen and (max-width: 425px) {
        min-width: 100%;
        margin-right: -15px;
        ${InputLabel} {
            min-width: calc(100% - 15px);
            margin-right: 15px;
        }
        ${LabelHalf} {
            margin-right: 15px;
            min-width: calc(50% - 15px);
            width: calc(50% - 15px);
        }
    }
`;

const SettingsSection = ({
    title,
    description,
    children,
    stickyTop = '90px',
    disable,
    ...props
}) => {
    return (
        <SectionRow {...props}>
            <LeftCol stickyTop={stickyTop}>
                <Title>{title}</Title>
                <Body style={{ marginBottom: '24px', whiteSpace: 'pre-wrap' }}>{description}</Body>
            </LeftCol>
            <RightCol disable={disable}>{children}</RightCol>
        </SectionRow>
    );
};

const DeleteFileButton = styled.button`
    width: 40px;
    right: 0;
    position: absolute;
    height: 40px;
    font-size: 1em;
    font-weight: 600;
`;

const FormattedText = ({ defaultValue, save, ...props }) => {
    const prefix = 'cueup.io/user/';

    const [value, setValue] = useState(defaultValue);

    const updateVal = (val) => {
        if (!val.includes(prefix)) {
            setValue('');
            return;
        }
        val = val.replace(prefix, '');
        val = val.replace(/[^\w-:]|_/, '');
        setValue(val.toLowerCase());
    };

    return (
        <TextInput
            {...props}
            type="text"
            onChange={(e) => updateVal(e.target.value)}
            onBlur={() => save(value)}
            value={prefix + value}
        />
    );
};

const InputType = React.forwardRef(
    (
        { buttonText, type, error, save, children, loading, success, blurOnEnter = true, ...props },
        ref
    ) => {
        switch (type) {
            case 'text-area':
                return (
                    <>
                        <TextArea {...props} ref={ref} type={type} error={!!error} />
                        {children}
                    </>
                );
            case 'select':
                return (
                    <Select {...props} error={!!error} onChange={save} ref={ref}>
                        {children}
                    </Select>
                );
            case 'button':
                return (
                    <ButtonInput {...props} error={!!error} ref={ref}>
                        {buttonText}
                        {loading && <LoadingIndicator style={{ marginLeft: '6px' }} />}
                        {success && <Checkmark style={{ marginLeft: '6px' }} color="#50e3c2" />}
                    </ButtonInput>
                );
            case 'file':
                return (
                    <FileInputWrapper {...props} error={!!error} ref={ref}>
                        {buttonText}
                        <FileInput {...props} onChange={save} />
                        {children}
                    </FileInputWrapper>
                );

            case 'formatted-text':
                return (
                    <>
                        <FormattedText
                            {...props}
                            ref={ref}
                            type={type}
                            error={!!error}
                            save={save}
                            onKeyDown={(e) => {
                                if (e.key === 'Enter' && blurOnEnter) {
                                    e.target.blur();
                                }
                            }}
                        />
                        {children}
                    </>
                );
            default:
                return (
                    <>
                        <TextInput
                            {...props}
                            ref={ref}
                            type={type}
                            error={!!error}
                            onKeyDown={(e) => {
                                if (e.key === 'Enter' && blurOnEnter) {
                                    e.target.blur();
                                }
                            }}
                        />
                        {children}
                    </>
                );
        }
    }
);

const Input = React.forwardRef(
    (
        {
            error: propsError,
            half,
            label,
            warning,
            type,
            onSave,
            validation,
            onChange,
            registerValidation,
            onBlur,
            unregisterValidation = () => {},
            errorOutside,
            description,
            labelStyle,
            proFeature,
            ...props
        },
        fRef
    ) => {
        const ref = useRef(fRef);
        const LabelComponent = half ? LabelHalf : InputLabel;

        const saveIfInvalid = !!registerValidation;

        const { runValidation, error } = useValidation({
            registerValidation,
            unregisterValidation,
            validation,
            ref,
        });

        const save = (e) => {
            const value = e.target ? e.target.value : e;
            if (typeof warning === String) {
                const confirmed = window.confirm(warning);
                if (!confirmed) {
                    return;
                }
            }
            const err = runValidation(value);
            if (!err || saveIfInvalid) {
                onSave && onSave(value, e);
            }
        };

        const change = (e) => {
            e.persist();
            onChange && onChange(e.target.value);
        };

        const handleBlur = (e) => {
            e.persist();
            save(e);
            onBlur && onBlur();
        };

        const displayError = propsError || error;

        return (
            <>
                <LabelComponent style={labelStyle}>
                    {label}
                    {proFeature && <ProFeature />}
                    <InputType
                        type={type}
                        save={save}
                        error={error || propsError}
                        warning={warning}
                        onChange={change}
                        ref={ref}
                        onBlur={handleBlur}
                        {...props}
                    />
                    {description && <BodySmall>{description}</BodySmall>}
                    {!errorOutside && displayError && <p className="error">{displayError}</p>}
                </LabelComponent>
                {errorOutside && displayError && <p className="error">{displayError}</p>}
            </>
        );
    }
);

const ButtonFileLabel = styled.label`
    ${secondaryButtonStyle};
    position: relative;
    text-align: center;
    line-height: 40px !important;
    transition: all 200ms ease;
    cursor: pointer;
`;

export const ButtonFileInput = ({ children, style, ...props }) => (
    <ButtonFileLabel style={style}>
        {children}
        <FileInput {...props} />
    </ButtonFileLabel>
);

const ButtonText = styled.span`
    overflow: hidden;
    white-space: nowrap;
    display: block;
    text-overflow: ellipsis;
`;

const Value = styled.p`
    font-size: 18px;
    color: #122b48;
`;

const TextArea = styled.textarea`
    ${inputStyle}
    resize: none;
    text-indent: 0;
    padding: 0.5em;
    height: auto;
    min-height: 40px;
    ::placeholder,
    ::-webkit-input-placeholder {
        color: #98a4b3;
    }
    :-ms-input-placeholder {
        color: #98a4b3;
    }
    :focus {
        background: #e9ecf0;
    }
`;

const ProSpan = styled.span`
    background-color: #122b48;
    color: #fff;
    font-weight: 500;
    align-items: center;
    justify-content: center;
    display: inline-flex;
    flex-direction: row;
    font-size: ${({ small }) => (small ? '13px' : '20px')};
    padding: 0.15em;
    border-radius: 1em;
    position: relative;
    top: -1px;
    > span {
        font-size: 0.7em;
        font-weight: 500;
        line-height: 0.7em;
        margin-left: 0.3em;
        margin-right: 0.3em;
    }
`;

const IconWrapper = styled.div`
    display: inline-flex;
    background: #31daff;
    border-radius: 0.4em;
    height: 0.8em;
    width: 0.8em;
    align-items: center;
    justify-content: center;
`;

export const ProFeature = ({ children, style, small, disabled }) => {
    const match = useRouteMatch();

    return (
        <ConditionalWrap
            condition={!disabled}
            wrap={(children) => (
                <NavLink disabled={disabled} to={match.url + '/get-pro'}>
                    {children}
                </NavLink>
            )}
        >
            <ProSpan small={small} style={style}>
                <IconWrapper>
                    <InlineIcon color={'#fff'} width={'0.6em'} height={'0.6em'} icon={starIcon} />
                </IconWrapper>
                <span>{children || 'Pro only'}</span>
            </ProSpan>
        </ConditionalWrap>
    );
};

export {
    ButtonText,
    Input,
    Label,
    SettingsSection,
    Value,
    Checkbox,
    DeleteFileButton,
    TextArea,
    Select,
};
