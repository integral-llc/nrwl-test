import React from "react";
import ReactDOM from "react-dom";
import {BackendService} from "./backend";
import "./index.css";
import App from "./app/app";
import {AppContextProvider} from './app/context/context';

const backend = new BackendService();

ReactDOM.render(
    <React.StrictMode>
        <AppContextProvider backend={backend}>
            <App/>
        </AppContextProvider>
    </React.StrictMode>,
    document.getElementById("root")
);
