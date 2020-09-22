import React, { useRef } from 'react';
import styled from 'styled-components';
import LocationSelector from 'components/common/LocationSelectorSimple';
import { useForm } from 'components/hooks/useForm';
import DatePickerPopup from 'components/DatePickerPopup';
import { Input } from 'components/FormComponents';
import { CTAButton } from 'components/CTAButton';
import { StyledLabelComponent } from './Components';

const BookDJForm = ({ checkAvailability, activeLocation }) => {
    const locationRef = useRef();
    const dateRef = useRef();
    const { registerValidation, unregisterValidation, runValidations, form, setValue } = useForm();

    const { iso2 } = activeLocation;
    return (
        <form>
            <StyledLabelComponent>
                <LocationSelector
                    data-cy={'location-input'}
                    ref={locationRef}
                    name="query"
                    label={'LOCATION'}
                    placeholder={"Where's the event?"}
                    wrapperStyle={{
                        flex: 1,
                        height: '100%',
                        display: 'flex',
                        position: 'initial',
                        marginBottom: 0,
                    }}
                    countries={iso2 ? [iso2] : null}
                    onSave={(locationName) => setValue({ locationName })}
                    defaultValue={form.locationName}
                />
            </StyledLabelComponent>

            <StyledLabelComponent>
                <DatePickerPopup
                    data-cy={'date-input'}
                    ref={dateRef}
                    label="WHEN"
                    maxDate={new Date().setFullYear(new Date().getFullYear() + 5)}
                    buttonText="Add date"
                    onSave={(date) => {
                        setValue({ date });
                    }}
                />
                <span className="divider" />
                <Input
                    blurOnEnter={false}
                    label="BUDGET"
                    placeholder="Add budget"
                    onChange={(budget) => setValue({ budget })}
                />
            </StyledLabelComponent>

            <StyledLabelComponent>
                <Input
                    blurOnEnter={false}
                    label="SPEAKERS"
                    placeholder="Add speakers"
                    onChange={(speakers) => setValue({ speakers })}
                />
                <span className="divider" />
                <Input
                    blurOnEnter={false}
                    label="LIGHTS"
                    placeholder="Add lights"
                    onChange={(lights) => setValue({ lights })}
                />
            </StyledLabelComponent>
            <CustomCTAButton
                noMargin
                noIcon
                type="submit"
                // loading={loading}
                // onClick={submit}
            >
                {checkAvailability ? 'Check availability' : 'Find DJs'}
            </CustomCTAButton>
        </form>
    );
};

const CustomCTAButton = styled(CTAButton)`
    width: 100%;
    border-radius: 8px;
    margin: 0;
    height: 55px;
    margin-top: 6px;
    justify-content: center;
    padding: 0;
    font-size: 18px;
    font-weight: 600;
    letter-spacing: 0;
`;

export default BookDJForm;
