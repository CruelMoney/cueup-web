import React, { useRef, useEffect } from 'react';

const ReactComment = ({ comment }) => {
    const el = useRef();
    useEffect(() => {
        el.current.outerHTML = `<!-- ${comment} -->`;
    }, [comment]);
    return <div ref={el} />;
};

export default ReactComment;
