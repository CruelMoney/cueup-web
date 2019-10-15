export const ImageCompressor = (
    file,
    asFile,
    options = {
        maxWidth: 500,
        maxHeight: 500,
    }
) => {
    return new Promise(async (resolve, reject) => {
        const loadJS = require('load-js');
        await loadJS(['/load-image.js']);
        const reader = new FileReader();
        reader.onload = (upload) => {
            // if (file.size / 1024 > 5000) {
            // 	reject("Image cannot be larger than 5 Mb", null);
            // 	return;
            // }
            const loadingImage = window.loadImage(
                file,
                async (img) => {
                    if (img.type === 'error') {
                        reject('Something went wrong');
                    } else {
                        const imageData = img.toDataURL();

                        if (asFile) {
                            const res = await fetch(imageData);
                            const blob = await res.blob();

                            const file = new File([blob], 'profile_picture.jpg', {
                                type: 'image/jpeg',
                            });
                            resolve({ file, imageData });
                        } else {
                            resolve({ imageData });
                        }
                    }
                },
                {
                    maxWidth: options.maxWidth,
                    maxHeight: options.maxHeight,
                    cover: true,
                    orientation: true,
                    crop: true,
                }
            );

            loadingImage.onerror = () => {
                reject('Something went wrong');
            };
        };
        try {
            reader.readAsDataURL(file);
        } catch (error) {}
    });
};
