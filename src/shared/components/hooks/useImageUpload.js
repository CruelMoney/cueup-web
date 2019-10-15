import { useMutation } from 'react-apollo';
import { useState } from 'react';
import { UPLOAD_FILE } from 'routes/User/gql';
import { ImageCompressor } from '../../utils/ImageCompressor';

const useImageUpload = ({ onCompleted } = {}) => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState();
    const [mutate] = useMutation(UPLOAD_FILE, {
        onCompleted,
        onError: setError,
    });
    const [preview, setPreview] = useState();

    const beginUpload = async (file) => {
        try {
            setLoading(true);
            const { imageData: base64 } = await ImageCompressor(file, true, {
                maxWidth: 1000,
                maxHeight: 1000,
            });
            setPreview(base64);

            return await mutate({ variables: { file } });
        } catch (error) {
            setError(error);
        } finally {
            setLoading(false);
        }
    };

    return {
        beginUpload,
        loading,
        error,
        preview,
    };
};

export default useImageUpload;
