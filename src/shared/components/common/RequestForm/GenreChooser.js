import React from 'react';
import ToggleButton from '../ToggleButton';

const GenreChooser = ({ letCueupDecide, setLetcueupDecide, chooseLabel, cueupDecideLabel }) => {
    return (
        <div className="toggle-options">
            <table>
                <tbody>
                    <tr>
                        <td>
                            <ToggleButton
                                key={letCueupDecide}
                                onClick={() => setLetcueupDecide(false)}
                                name="choose"
                                label={chooseLabel}
                                active={letCueupDecide === false}
                                rounded
                            >
                                {chooseLabel}
                            </ToggleButton>
                        </td>
                        <td>
                            <ToggleButton
                                key={letCueupDecide}
                                onClick={() => setLetcueupDecide(true)}
                                name="cueup"
                                label={cueupDecideLabel}
                                active={letCueupDecide === true}
                                rounded
                            />
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>
    );
};

export default GenreChooser;
