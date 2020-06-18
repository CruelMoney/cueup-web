import { useMutation } from 'react-apollo';
import { useState } from 'react';
import { UPLOAD_FILE } from 'routes/User/gql';
import { ImageCompressor } from '../../utils/ImageCompressor';

const useImageUpload = ({ onCompleted, initialPreview } = {}) => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState();
    const [mutate] = useMutation(UPLOAD_FILE, {
        onCompleted,
        onError: setError,
    });
    const [preview, setPreview] = useState(initialPreview);

    const beginUpload = async (ogFile) => {
        try {
            setLoading(true);
            const { imageData: base64, file } = await ImageCompressor(ogFile, true, {
                maxWidth: 1000,
                maxHeight: 1000,
            });
            setPreview(base64);

            const {
                data: { singleUpload },
            } = await mutate({ variables: { file } });
            return singleUpload;
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
