import React, { useState } from 'react';
import styled, { css } from 'styled-components';
import { Col, Row, RowWrap, SmartButton } from 'components/Blocks';
import { CheckBoxRow } from 'components/CheckboxTable';
import { useForm } from 'components/hooks/useForm';
import ToggleButtonHandler from 'components/common/ToggleButtonHandler';
import { GENRES } from 'constants/constants';
import { Label } from 'components/FormComponents';
import Checkmark from '../../assets/Checkmark';

const InsidePopup = styled.div`
    position: absolute;
    top: 0px;
    left: 0px;
    right: 0px;
    bottom: 0px;
    padding: 20px;
    box-shadow: none;
    background: #fff;
    border: 1px solid #e9ecf0;
    border-radius: 12px;
    -ms-overflow-style: none;
    scrollbar-width: none;
    z-index: 1;
    button.withIcon span {
        justify-content: space-between;
        display: flex;
        flex-direction: row;
        width: 100%;
        align-items: center;
    }
    .toggle-button-handler button {
        text-transform: capitalize;
    }
`;

const FilterPill = styled.button`
    padding: 0.5em 1em;
    background: #ffffff;
    border: 0.5px solid rgba(77, 100, 128, 0.2);
    border-radius: 20px;
    color: #4d6480;
    font-size: 14px;
    font-weight: 500;
    margin-right: 6px !important;
    margin-top: 6px !important;
    margin-left: 0px !important;
    ${({ active }) =>
        active &&
        css`
            box-shadow: inset 0 0 0px 2px #4d6480;
            text-transform: capitalize;
        `}
`;

export const FilterPills = ({ form, setValue }) => {
    const [showEventTypes, setShowEventTypes] = useState(false);
    const [showBudget, setShowBudget] = useState(false);
    const [showEquipment, setShowEquipment] = useState(false);
    const [showGenres, setShowGenres] = useState(false);

    const selectedGenre = form.genres?.length === 1 && form.genres[0];
    const selectedEventType = form.eventTypes?.length === 1 && form.eventTypes[0];

    return (
        <>
            <RowWrap style={{ marginBottom: 30, marginTop: 20 }}>
                <FilterPill onClick={() => setShowGenres(true)} active={!!form.genres?.length}>
                    {selectedGenre || 'Music genres'}
                </FilterPill>
                <FilterPill
                    onClick={() => setShowEquipment(true)}
                    active={form.equipment && Object.values(form.equipment).filter(Boolean).length}
                >
                    Equipment
                </FilterPill>

                <FilterPill active={form.budget} onClick={() => setShowBudget(true)}>
                    {form.budget?.label || 'Budget'}
                </FilterPill>
                <FilterPill
                    active={form.eventTypes?.length}
                    onClick={() => setShowEventTypes(true)}
                >
                    {selectedEventType || 'Type of event'}
                </FilterPill>
            </RowWrap>
            {showEventTypes && (
                <EventTypeSelector
                    initialvalues={form.eventTypes}
                    onSave={(eventTypes) => {
                        setValue({ eventTypes });
                        setShowEventTypes(false);
                    }}
                />
            )}

            {showBudget && (
                <BudgetSelector
                    initialvalues={form.budget}
                    onSave={(budget) => {
                        setValue({ budget });
                        setShowBudget(false);
                    }}
                />
            )}

            {showEquipment && (
                <EquipmentSelector
                    initialvalues={form.equipment}
                    onSave={(equipment) => {
                        setValue({ equipment });
                        setShowEquipment(false);
                    }}
                />
            )}

            {showGenres && (
                <GenreSelector
                    initialvalues={form.genres}
                    onSave={(genres) => {
                        setValue({ genres });
                        setShowGenres(false);
                    }}
                />
            )}
        </>
    );
};

const EventTypeSelector = ({ initialvalues, onSave, loading }) => {
    const [eventTypes, setEventTypes] = useState(initialvalues || []);

    const handleSave = () => {
        onSave(eventTypes);
    };

    const handleToggle = (key) => (value) => {
        if (value) {
            setEventTypes((ee) => [...ee, key]);
        } else {
            setEventTypes((ee) => ee.filter((e) => e !== key));
        }
    };

    return (
        <InsidePopup>
            <Col style={{ height: '100%' }}>
                <RowWrap>
                    <Label v2>
                        <span>EVENT TYPE</span>
                    </Label>
                </RowWrap>
                <CheckBoxRow
                    withBorder={false}
                    label="Wedding"
                    checked={eventTypes.includes('wedding')}
                    onChange={handleToggle('wedding')}
                />
                <CheckBoxRow
                    withBorder={false}
                    label="Birthday"
                    checked={eventTypes.includes('birthday')}
                    onChange={handleToggle('birthday')}
                />
                <CheckBoxRow
                    withBorder={false}
                    label="Corporate event"
                    checked={eventTypes.includes('corporate')}
                    onChange={handleToggle('corporate')}
                />
                <CheckBoxRow
                    withBorder={false}
                    label="Club"
                    checked={eventTypes.includes('club')}
                    onChange={handleToggle('club')}
                />
                <CheckBoxRow
                    withBorder={false}
                    label="Festival"
                    checked={eventTypes.includes('festival')}
                    onChange={handleToggle('festival')}
                />
                <CheckBoxRow
                    withBorder={false}
                    label="School"
                    checked={eventTypes.includes('school')}
                    onChange={handleToggle('school')}
                />
                <CheckBoxRow
                    withBorder={false}
                    label="Outdoor"
                    checked={eventTypes.includes('outdoor')}
                    onChange={handleToggle('outdoor')}
                />
                <Row style={{ marginTop: 'auto' }} right>
                    <SmartButton
                        level="tertiary"
                        onClick={() => {
                            setEventTypes([]);
                        }}
                    >
                        Clear
                    </SmartButton>
                    <SmartButton level="secondary" loading={loading} onClick={handleSave}>
                        Save
                    </SmartButton>
                </Row>
            </Col>
        </InsidePopup>
    );
};

const BudgetButton = ({ value, label, setBudget, budget }) => (
    <Row
        fullWidth
        level="secondary"
        className="withIcon"
        onClick={() => setBudget({ value, label })}
        style={{
            marginBottom: 6,
            height: 40,
            width: '100%',
            justifyContent: 'space-between',
            cursor: 'pointer',
        }}
    >
        <Label>
            <span>{label}</span>
        </Label>

        <Checkmark
            style={{
                height: 24,
                width: 24,
                borderRadius: 12,
                backgroundColor: budget?.value === value ? '#25F4D2' : '#E9ECF0',
                padding: 6,
            }}
            color={budget?.value === value ? '#fff' : '#E9ECF0'}
        />
    </Row>
);

const BudgetSelector = ({ initialvalues, onSave, loading }) => {
    const [budget, setBudget] = useState(initialvalues);

    const handleSave = () => {
        onSave(budget);
    };

    return (
        <InsidePopup>
            <Col style={{ height: '100%' }}>
                <RowWrap>
                    <Label v2>
                        <span>BUDGET</span>
                    </Label>
                </RowWrap>

                <BudgetButton
                    value={200}
                    setBudget={setBudget}
                    budget={budget}
                    label={'Up to 200 USD'}
                />
                <BudgetButton
                    value={500}
                    setBudget={setBudget}
                    budget={budget}
                    label={'Up to 500 USD'}
                />
                <BudgetButton
                    value={800}
                    setBudget={setBudget}
                    budget={budget}
                    label={'Up to 800 USD'}
                />
                <BudgetButton
                    value={1000}
                    setBudget={setBudget}
                    budget={budget}
                    label={'Up to 1.000 USD'}
                />
                <BudgetButton
                    value={1500}
                    setBudget={setBudget}
                    budget={budget}
                    label={'Up to 1.500 USD'}
                />
                <BudgetButton
                    value={2000}
                    setBudget={setBudget}
                    budget={budget}
                    label={'More than 1.500 USD'}
                />

                <Row style={{ marginTop: 'auto' }} right>
                    <SmartButton
                        level="tertiary"
                        onClick={() => {
                            setBudget(null);
                        }}
                    >
                        Clear
                    </SmartButton>
                    <SmartButton level="secondary" loading={loading} onClick={handleSave}>
                        Save
                    </SmartButton>
                </Row>
            </Col>
        </InsidePopup>
    );
};

const EquipmentSelector = ({ initialvalues, onSave, loading }) => {
    const { form, setValue, clearForm } = useForm(null, initialvalues);
    const [key, setKey] = useState(0);

    const handleSave = () => {
        onSave(form);
    };

    return (
        <InsidePopup>
            <Col key={key} style={{ height: '100%' }}>
                <RowWrap>
                    <Label v2>
                        <span>EQUIPMENT</span>
                    </Label>
                </RowWrap>
                <CheckBoxRow
                    withBorder={false}
                    label="Sound system"
                    checked={form.speakers}
                    onChange={(speakers) => setValue({ speakers })}
                />
                <CheckBoxRow
                    withBorder={false}
                    label="Lights"
                    checked={form.lights}
                    onChange={(lights) => setValue({ lights })}
                />
                <CheckBoxRow
                    withBorder={false}
                    label="Microphone"
                    checked={form.microphone}
                    onChange={(microphone) => setValue({ microphone })}
                />
                <CheckBoxRow
                    withBorder={false}
                    label="Smoke machine"
                    checked={form.smokeMachine}
                    onChange={(smokeMachine) => setValue({ smokeMachine })}
                />

                <Row style={{ marginTop: 'auto' }} right>
                    <SmartButton
                        level="tertiary"
                        onClick={() => {
                            clearForm();
                            setKey((k) => k + 1);
                        }}
                    >
                        Clear
                    </SmartButton>
                    <SmartButton level="secondary" loading={loading} onClick={handleSave}>
                        Save
                    </SmartButton>
                </Row>
            </Col>
        </InsidePopup>
    );
};

const GenreSelector = ({ initialvalues, onSave, loading }) => {
    const [genres, setgenres] = useState(initialvalues || []);

    const handleSave = () => {
        onSave(genres);
    };

    return (
        <InsidePopup>
            <Col style={{ height: '100%' }}>
                <RowWrap>
                    <Label v2>
                        <span>MUSIC GENRES</span>
                    </Label>
                </RowWrap>
                <ToggleButtonHandler
                    key={genres.length}
                    onChange={(genres) => {
                        setgenres(genres);
                    }}
                    colored
                    value={genres}
                    potentialValues={GENRES}
                    columns={3}
                />

                <Row style={{ marginTop: 'auto' }} right>
                    <SmartButton
                        level="tertiary"
                        onClick={() => {
                            setgenres([]);
                        }}
                    >
                        Clear
                    </SmartButton>
                    <SmartButton level="secondary" loading={loading} onClick={handleSave}>
                        Save
                    </SmartButton>
                </Row>
            </Col>
        </InsidePopup>
    );
};
