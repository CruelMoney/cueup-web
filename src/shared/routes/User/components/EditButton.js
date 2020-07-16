import React from 'react';
import { Link } from 'react-router-dom';
import Icon from '@iconify/react';
import editIcon from '@iconify/icons-ion/pencil';
import { TeritaryButton } from 'components/Blocks';

const EditButton = ({ style, title, to }) => {
    return (
        <Link to={to}>
            <TeritaryButton
                title={title}
                style={{
                    position: 'absolute',
                    top: 0,
                    right: 0,
                    maxWidth: 40,
                    minWidth: 40,
                    borderRadius: 20,
                    marginRight: 12,
                    padding: 0,
                    marginTop: 12,
                    ...style,
                }}
            >
                <Icon icon={editIcon} width={24} height={24} />
            </TeritaryButton>
        </Link>
    );
};

export default EditButton;
