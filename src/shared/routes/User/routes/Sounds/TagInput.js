import React, { useState } from 'react';
// import { WithContext as ReactTags } from 'react-tag-input';
// import './TagInput.css';

const KeyCodes = {
    comma: 188,
    enter: 13,
};

const delimiters = [KeyCodes.comma, KeyCodes.enter];

const TagInput = ({ defaultValue = [], placeholder, onChange, ...props }) => {
    const [tags, setTags] = useState(defaultValue.map((t) => ({ text: t, id: t })));

    const handleChange = (newTags) => {
        setTags(newTags);
        onChange && onChange(newTags.map((t) => t.text));
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

    const handleDrag = (tag, currPos, newPos) => {
        const newTags = tags.slice();

        newTags.splice(currPos, 1);
        newTags.splice(newPos, 0, tag);

        handleChange(newTags);
    };

    return null;
    // <ReactTags
    //     tags={tags}
    //     handleDelete={handleDelete}
    //     handleAddition={handleAddition}
    //     handleInputBlur={(text) => !!text.trim() && handleAddition({ text: text, id: text })}
    //     handleDrag={handleDrag}
    //     delimiters={delimiters}
    //     autofocus={false}
    //     maxLength="24"
    //     placeholder={tags.length > 0 ? '' : placeholder}
    //     {...props}
    // />
};

export default TagInput;
