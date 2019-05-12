import React from 'react';
import { DrizzleProvider } from "drizzle-react";
import { LoadingContainer } from "drizzle-react-components";
import store from '../../middleware'
import drizzleOptions from "../../drizzleOptions";

const DrizzleWrapper = ({ children }) => (
    <DrizzleProvider store={store} options={drizzleOptions}>
        <LoadingContainer>
            {children}
        </LoadingContainer>
    </DrizzleProvider>
)

export default DrizzleWrapper