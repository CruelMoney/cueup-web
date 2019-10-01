import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { localize } from 'react-localize-redux';
import { Query } from 'react-apollo';
import Formatter from '../../../../../utils/Formatter';
import NavLink from '../../../../../components/common/Navlink';
import LoadingPlaceholder from '../../../../../components/common/LoadingPlaceholder';
import { MY_EVENTS } from '../../../gql';

class Events extends PureComponent {
    static propTypes = {
        events: PropTypes.arrayOf(PropTypes.object),
        fetchEvents: PropTypes.func,
        payEvent: PropTypes.func,
        editEvent: PropTypes.func,
        cancelEvent: PropTypes.func,
        loading: PropTypes.bool,
    };

    render() {
        const { translate } = this.props;

        const renderEvent = (event, i) => {
            const { id, hash, name, location, start, status } = event;

            return (
                <div key={id}>
                    <NavLink
                        to={translate('routes./event/:id/:hash/overview', {
                            id: id,
                            hash: hash,
                        })}
                    >
                        <div>
                            <div className="event-card" key={i}>
                                <div>
                                    <div className="event-name">{name}</div>
                                    <div className="event-location">
                                        <svg
                                            version="1.1"
                                            id="Capa_1"
                                            x="0px"
                                            y="0px"
                                            width="15px"
                                            height="15px"
                                            viewBox="0 0 466.583 466.582"
                                            style={{
                                                enableBackground: 'new 0 0 466.583 466.582',
                                            }}
                                        >
                                            <g>
                                                <path d="M233.292,0c-85.1,0-154.334,69.234-154.334,154.333c0,34.275,21.887,90.155,66.908,170.834   c31.846,57.063,63.168,104.643,64.484,106.64l22.942,34.775l22.941-34.774c1.317-1.998,32.641-49.577,64.483-106.64   c45.023-80.68,66.908-136.559,66.908-170.834C387.625,69.234,318.391,0,233.292,0z M233.292,233.291c-44.182,0-80-35.817-80-80   s35.818-80,80-80c44.182,0,80,35.817,80,80S277.473,233.291,233.292,233.291z" />
                                            </g>
                                        </svg>
                                        {' ' + location.name}
                                    </div>
                                </div>
                                <div className="event-right">
                                    <div className="event-date">{start.formattedDate}</div>
                                    <div className="event-status">
                                        {Formatter.cueupEvent.GetStatus(status, translate)}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </NavLink>
                </div>
            );
        };

        function renderLoadingItem() {
            return [<LoadingPlaceholder key={1} />, <LoadingPlaceholder key={2} />];
        }

        return (
            <div className="events">
                <Query query={MY_EVENTS}>
                    {({ loading, data }) => {
                        if (loading || !data) {
                            return renderLoadingItem();
                        }

                        return data.me.events.edges.map((e, i) => renderEvent(e, i));
                    }}
                </Query>
            </div>
        );
    }
}

export default localize(Events, 'locale');
