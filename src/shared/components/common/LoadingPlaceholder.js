import React, { Component } from 'react';
import Skeleton from 'react-loading-skeleton';

class LoadingPlaceholder2 extends Component {
    render() {
        return (
            <div {...this.props}>
                <Skeleton count={2} height={100} style={{ marginBottom: 9 }} />
            </div>
        );
    }
}
export { LoadingPlaceholder2 };
