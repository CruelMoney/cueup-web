import React from 'react';

import Menu from 'components/Navigation';
import ScrollToTop from '../../components/common/ScrollToTop';
import About from './components/About';

const Index = () => {
    return (
        <div>
            <ScrollToTop />
            <Menu relative dark withSearch />
            <About />
        </div>
    );
};

export default Index;
