import React, { useState } from 'react';
import { Input } from './FormComponents';

const ImageUploader = ({ onSave, options, ...props }) => {
    const [error, setError] = useState(props.error);

    const handleFile = async (_, e) => {
        const file = e.target.files[0];

        try {
            // const { file: image } = await ImageCompressor(file, true, options);

            onSave(file);
        } catch (error) {
            console.log({ error });
            setError(error.message || error);
        }
    };

    return (
        <Input
            type="file"
            name="picture"
            accept="image/*"
            onSave={handleFile}
            {...props}
            error={error}
        />
    );
};

export default ImageUploader;
