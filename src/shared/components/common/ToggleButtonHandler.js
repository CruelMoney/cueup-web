import React, { Component } from 'react';
import ToggleButton from './ToggleButton';
import ToggleButtonInput from './ToggleButtonInput';

class ToggleButtonHandler extends Component {
    static defaultProps = {
        columns: 3,
        potentialValues: [],
        value: [],
        errorAbove: false,
        required: true,
        errors: [],
    };

    constructor(props) {
        super(props);
        this.state = {
            addedGenres: [],
            selectedValues: [...this.parseValues(props.value)],
            potentialValues: [...new Set(this.parseValues(props.potentialValues))],
        };
    }

    parseValues = (vals) => {
        return vals
            .filter((v) => !!v)
            .map((v) => {
                const name = typeof v === 'string' ? v : v.name;
                return name.trim().toLowerCase();
            })
            .filter((v) => !!v);
    };

    spliceHelper(list, index) {
        list.splice(index, 1);
        return list;
    }

    getFilteredAddedGenres = () => {
        return this.state.addedGenres.filter((g) => !this.state.selectedValues.includes(g));
    };

    updateContext = () => {
        const concatList = [
            ...new Set([
                ...this.state.addedGenres.filter((g) => !!g?.trim()).map((g) => g.toLowerCase()),
                ...this.state.selectedValues.map((g) => g.toLowerCase()),
            ]),
        ];

        this.props.onChange && this.props.onChange(concatList);
    };

    handleButtonPress = (genre) => (value) => {
        const toggledButtons = this.state.selectedValues;
        const valueIndex = toggledButtons.indexOf(genre);

        const newList =
            valueIndex === -1
                ? [...toggledButtons, genre]
                : this.spliceHelper(toggledButtons, valueIndex);

        this.setState(
            {
                selectedValues: newList,
            },
            this.updateContext
        );
    };

    handleAddNew = () => {
        this.setState((state) => ({
            addedGenres: [...state.addedGenres, ' '],
        }));
    };

    inputUpdate = (val, id) => {
        if (typeof val === 'string') {
            if (!val.trim()) {
                this.setState((state) => {
                    const addedGenres = state.addedGenres.filter((g, idx) => {
                        if (idx === id) {
                            return false;
                        }
                        return true;
                    });
                    return {
                        addedGenres,
                    };
                }, this.updateContext);
                return;
            }
            this.setState((state) => {
                const addedGenres = state.addedGenres.map((g, idx) => {
                    if (idx === id) {
                        return val;
                    }
                    return g;
                });
                return {
                    addedGenres,
                };
            }, this.updateContext);
        }
    };

    getButton = (genre, type, idx) => {
        let name = typeof genre === 'string' ? genre : genre.name;
        name = name.toLowerCase();

        switch (type) {
            case 'add-button':
                return (
                    <td key={genre} data-key={genre}>
                        <ToggleButton
                            key={this.state.addedGenres.length}
                            color={this.props.color}
                            label={'Add new +'}
                            active={false}
                            disabled={this.props.disabled}
                            onClick={this.handleAddNew}
                        />
                    </td>
                );
            case 'edit-button':
                return (
                    <td key={'edit-genre-' + idx} data-key={'edit-genre-' + idx}>
                        <ToggleButtonInput
                            color={this.props.color}
                            onChange={(value) => this.inputUpdate(value, idx)}
                            active={true}
                        />
                    </td>
                );
            default:
                return (
                    <td key={genre} data-key={genre}>
                        <ToggleButton
                            colored={this.props.colored}
                            color={this.props.color}
                            label={name}
                            active={this.state.selectedValues.includes(name)}
                            disabled={this.props.disabled}
                            onClick={this.handleButtonPress(genre)}
                        />
                    </td>
                );
        }
    };

    render() {
        const { addedGenres, potentialValues } = this.state;

        const rows = [];
        let buttons = [];
        let currentRow = 0;
        let idx = 0;
        let itemCount = potentialValues.length + addedGenres.length;
        itemCount = !this.props.disabled && this.props.enableAdditions ? itemCount + 1 : itemCount;

        const rowLogic = (_) => {
            if (++idx % this.props.columns === 0 || idx === itemCount) {
                currentRow++;
                rows.push(<tr key={currentRow}>{buttons}</tr>);
                buttons = [];
            }
        };

        potentialValues.forEach((genre) => {
            buttons.push(this.getButton(genre, 'normal-button'));
            rowLogic();
        });
        addedGenres.forEach((genre, _idx) => {
            buttons.push(this.getButton(genre, 'edit-button', _idx));
            rowLogic();
        });

        if (!this.props.disabled && this.props.enableAdditions) {
            buttons.push(this.getButton('add', 'add-button'));
            rowLogic();
        }

        return (
            <div>
                <div className="toggle-button-handler">
                    {this.props.errors.length && this.props.errorAbove ? (
                        <div className="errors">
                            {this.props.errors.map((error, i) => (
                                <p key={i}>{error}</p>
                            ))}
                        </div>
                    ) : null}

                    <table>
                        <tbody>{rows}</tbody>
                    </table>
                </div>
                {this.props.errors.length && !this.props.errorAbove ? (
                    <div style={{ marginTop: '10px' }} className="errors">
                        {this.props.errors.map((error, i) => (
                            <p className="error" key={i}>
                                {error}
                            </p>
                        ))}
                    </div>
                ) : null}
            </div>
        );
    }
}

export default ToggleButtonHandler;

export { ToggleButtonHandler };
