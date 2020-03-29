import React, { Component } from 'react';
import { addTranslation, getTranslate, getActiveLanguage } from 'react-localize-redux';
import { connect } from 'react-redux';

const addTranslate = (Wrappee, content = []) => {
    class Index extends Component {
        constructor(props) {
            super(props);
            props.initLocale();
        }

        render() {
            return <Wrappee {...this.props} />;
        }
    }

    const mapStateToProps = (state) => {
        return {
            translate: getTranslate(state.locale),
            currentLanguage: getActiveLanguage(state.locale).code,
        };
    };

    const mapDispatchToProps = (dispatch) => {
        return {
            initLocale: () => {
                if (Array.isArray(content)) {
                    content.forEach((data) => {
                        dispatch(addTranslation(data));
                    });
                } else {
                    dispatch(addTranslation(content));
                }
            },
        };
    };

    return connect(mapStateToProps, mapDispatchToProps)(Index);
};

export default addTranslate;
