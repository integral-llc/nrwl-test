import React from 'react';
import {useAppContext} from '../context/context';

export const LoadingComponent = () => {
    const { ticketsLoaded } = useAppContext();

    if (ticketsLoaded) {
        return null;
    }

    return (
        <div>Loading...</div>
    )
}

