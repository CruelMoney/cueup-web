import React, { useState } from 'react';
import styled, { css } from 'styled-components';
import { Col, Row, RowWrap, SmartButton } from 'components/Blocks';
import { CheckBoxRow } from 'components/CheckboxTable';
import { useForm } from 'components/hooks/useForm';
import ToggleButtonHandler from 'components/common/ToggleButtonHandler';
import { GENRES } from 'constants/constants';
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
    border-radius: 27px;
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
        `}
`;

export const FilterPills = ({ form, setValue }) => {
    const [showEventTypes, setShowEventTypes] = useState(false);
    const [showBudget, setShowBudget] = useState(false);
    const [showEquipment, setShowEquipment] = useState(false);
    const [showGenres, setShowGenres] = useState(false);

    const selectedGenre = form.genres?.length === 1 && form.genres[0];

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
                    active={
                        form.eventTypes && Object.values(form.eventTypes).filter(Boolean).length
                    }
                    onClick={() => setShowEventTypes(true)}
                >
                    Type of event
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
    const { form, setValue, clearForm } = useForm(null, initialvalues);
    const [key, setKey] = useState(0);

    const handleSave = () => {
        onSave(form);
    };

    return (
        <InsidePopup>
            <Col key={key} style={{ height: '100%' }}>
                <RowWrap>
                    <label>EVENT TYPE</label>
                </RowWrap>
                <CheckBoxRow
                    label="Wedding"
                    checked={form.wedding}
                    onChange={(wedding) => setValue({ wedding })}
                />
                <CheckBoxRow
                    label="Birthday"
                    checked={form.birthday}
                    onChange={(birthday) => setValue({ birthday })}
                />
                <CheckBoxRow
                    label="Corporate event"
                    checked={form.corporate}
                    onChange={(corporate) => setValue({ corporate })}
                />
                <CheckBoxRow
                    label="Club"
                    checked={form.club}
                    onChange={(club) => setValue({ club })}
                />
                <CheckBoxRow
                    label="Festival"
                    checked={form.festival}
                    onChange={(festival) => setValue({ festival })}
                />
                <CheckBoxRow
                    label="School"
                    checked={form.school}
                    onChange={(school) => setValue({ school })}
                />
                <CheckBoxRow
                    label="Outdoor"
                    checked={form.outdoor}
                    onChange={(outdoor) => setValue({ outdoor })}
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

const BudgetButton = ({ value, label, setBudget, budget }) => (
    <SmartButton
        fullWidth
        level="secondary"
        className="withIcon"
        style={{ marginBottom: 6 }}
        onClick={() => setBudget({ value, label })}
    >
        {label}{' '}
        {budget?.value === value && (
            <Checkmark
                style={{
                    height: 24,
                    width: 24,
                    borderRadius: 12,
                    backgroundColor: '#fff',
                    padding: 6,
                }}
                color={'#25F4D2'}
            />
        )}
    </SmartButton>
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
                    <label>BUDGET</label>
                </RowWrap>

                <BudgetButton
                    value={250}
                    setBudget={setBudget}
                    budget={budget}
                    label={'Up to 250 USD'}
                />
                <BudgetButton
                    value={500}
                    setBudget={setBudget}
                    budget={budget}
                    label={'Up to 500 USD'}
                />
                <BudgetButton
                    value={750}
                    setBudget={setBudget}
                    budget={budget}
                    label={'Up to 750 USD'}
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
                    <label>EQUIPMENT</label>
                </RowWrap>
                <CheckBoxRow
                    label="Sound system"
                    checked={form.speakers}
                    onChange={(speakers) => setValue({ speakers })}
                />
                <CheckBoxRow
                    label="Lights"
                    checked={form.lights}
                    onChange={(lights) => setValue({ lights })}
                />
                <CheckBoxRow
                    label="Microphone"
                    checked={form.microphone}
                    onChange={(microphone) => setValue({ microphone })}
                />
                <CheckBoxRow
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
                    <label>MUSIC GENRES</label>
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
