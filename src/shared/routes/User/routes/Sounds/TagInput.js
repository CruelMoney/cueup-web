import React, { useState } from 'react';
import ReactTags from 'react-tag-autocomplete';
import { GENRES } from 'constants/constants';
import './TagInput.css';

const KeyCodes = {
    comma: 188,
    enter: 13,
};

const delimiters = [KeyCodes.comma, KeyCodes.enter, 'Enter', 'Tab'];

const TagInput = ({ defaultValue = [], placeholder, onChange, ...props }) => {
    const [tags, setTags] = useState(defaultValue.map((t) => ({ name: t, id: t })));

    const handleChange = (newTags) => {
        setTags(newTags);
        onChange && onChange(newTags.map((t) => t.name));
    };

    const handleDelete = (idx) => {
        handleChange(tags.filter((_tag, i) => idx !== i));
    };

    const handleAddition = (tag) => {
        if (tag) {
            if (tags.length > 5) {
                window.alert('Max 6 tags');
            } else {
                handleChange([...tags, tag]);
            }
        }
    };

    return (
        <ReactTags
            tags={tags}
            addOnBlur
            allowNew
            suggestions={GENRES.map((g) => ({ name: g, id: g }))}
            onDelete={handleDelete}
            onAddition={handleAddition}
            delimiters={delimiters}
            autofocus={false}
            maxLength="24"
            placeholder={tags.length > 0 ? '' : placeholder}
            {...props}
        />
    );
};

export default TagInput;
