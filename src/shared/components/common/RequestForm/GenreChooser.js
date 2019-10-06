import React from 'react';
import ToggleButton from '../ToggleButton';
import InfoPopup from '../InfoPopup';

class GenreChooser extends React.Component {
    state = {
        selected: null,
    };

    // Fired on first select
    onChooseGenres = (val) => {
        this.setState({ selected: 'choose' }, () => {
            this.props.letCueupDecide(false);
        });
    };

    onLetCueup = () => {
        this.setState({ selected: 'cueup' }, () => {
            this.props.letCueupDecide(true);
        });
    };

    render() {
        const { selected } = this.state;
        const { cueupDecideLabel, chooseLabel } = this.props;
        return (
            <div className="toggle-options">
                <table>
                    <tbody>
                        <tr>
                            <td>
                                <ToggleButton
                                    key={selected === 'choose'}
                                    onClick={this.onChooseGenres}
                                    name="choose"
                                    label={chooseLabel}
                                    active={selected === 'choose'}
                                    rounded
                                >
                                    {chooseLabel}
                                </ToggleButton>
                            </td>
                            <td>
                                <ToggleButton
                                    key={selected === 'cueup'}
                                    onClick={this.onLetCueup}
                                    name="cueup"
                                    label={cueupDecideLabel}
                                    active={selected === 'cueup'}
                                    rounded
                                />
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
        );
    }
}

export default GenreChooser;
export { GenreChooser as DisconnectedGenreChooser };
