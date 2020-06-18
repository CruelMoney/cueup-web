import React, { Component } from 'react';
import ScrollToTop from '../../components/common/ScrollToTop';
import Home from './components/Home';

class Index extends Component {
    render() {
        return (
            <>
                <Home {...this.props} cache />
                <ScrollToTop alwaysScroll />
            </>
        );
    }
}

export default Index;
