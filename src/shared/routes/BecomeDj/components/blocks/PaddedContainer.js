import React from 'react';
import styled from 'styled-components';
import { Container } from '../../../../components/Blocks';

export const PaddedContainer = styled(Container)`
    padding-top: ${({ paddingTop }) => (paddingTop ? paddingTop : '0')};
    padding-bottom: ${({ paddingBottom }) => (paddingBottom ? paddingBottom : '0')};
`;
