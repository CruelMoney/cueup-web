import React from 'react';
import styled from 'styled-components';
import { NavLink } from 'react-router-dom';
import { Title, Body, TitleClean } from 'components/Text';
import { Col } from 'components/Blocks';
import useTranslate from 'components/hooks/useTranslate';
import { appRoutes } from 'constants/locales/appRoutes';

const CountriesList = ({ countries = [] }) => {
    const { translate } = useTranslate();
    return (
        <FormRow middle center>
            <Overview>
                <ul>
                    {countries.map(({ country, countrySlug, iso2 }, _idx) => (
                        <li key={iso2}>
                            <a
                                href={`${translate(appRoutes.bookDj)
                                    .replace(':city?', '')
                                    .replace(':country', countrySlug)}`}
                            >
                                <Body>DJs in {country}</Body>
                            </a>
                        </li>
                    ))}
                </ul>
            </Overview>
        </FormRow>
    );
};

export const CitiesList = ({ cities, country }) => {
    if (!cities?.length) {
        return null;
    }
    return (
        <FormRow middle center>
            <TitleClean>Top locations in {country}</TitleClean>
            <Overview>
                <ul>
                    {cities.map(({ countrySlug, city, citySlug, id }) => (
                        <li key={id}>
                            <a href={`/${citySlug || countrySlug}/book-dj`}>
                                <Body>{city}</Body>
                            </a>
                        </li>
                    ))}
                </ul>
            </Overview>
        </FormRow>
    );
};

const FormRow = styled(Col)`
    margin: 60px 0;
    width: 100%;
    padding-left: 170px;
    @media only screen and (max-width: 768px) {
        padding-left: 0px;
    }
`;

const Overview = styled.div`
    ul {
        display: flex;
        flex-direction: row;
        flex-wrap: wrap;
        margin-left: 2em;
        li {
            width: 200px;
            margin: 0 1em;
            a:hover {
                text-decoration: underline;
            }
            p {
                text-overflow: ellipsis;
                overflow: hidden;
                white-space: nowrap;
            }
        }
    }
`;

export default CountriesList;
