import React from 'react';

import Menu from 'components/Navigation';
import ScrollToTop from '../../components/common/ScrollToTop';
import Jobs from './components/Jobs';

const Index = () => {
    return (
        <div>
            <ScrollToTop />
            <Menu relative dark withSearch />
            <Jobs />
        </div>
    );
};

export default Index;
