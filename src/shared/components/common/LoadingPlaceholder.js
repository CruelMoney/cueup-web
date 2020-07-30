import React, { Component } from 'react';
import Skeleton from 'react-loading-skeleton';

class LoadingPlaceholder2 extends Component {
    render() {
        return (
            <div {...this.props}>
                <Skeleton
                    count={2}
                    height={100}
                    style={{
                        marginBottom: 9,
                        backgroundColor: '#eff2f5',
                        backgroundImage: 'linear-gradient( 90deg,#eff2f5,#f7f7f8,#eff2f5)',
                    }}
                />
            </div>
        );
    }
}
export { LoadingPlaceholder2 };
