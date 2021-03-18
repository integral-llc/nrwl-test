import React from "react";
import "./app.css";
import {useAppContext} from './context/context';
import {LoadingComponent} from './components/LoadingComponent';
import {RouterComponent} from './components/RouterComponent';
import {css} from '@emotion/css';

const rootStyle = css`
    padding: 20px;
`

const App = () => {
    const {ticketsLoaded} = useAppContext()

    return (
        <div className={rootStyle}>
            <LoadingComponent/>
            {ticketsLoaded && <RouterComponent/>}
        </div>
    );
};

export default App;
