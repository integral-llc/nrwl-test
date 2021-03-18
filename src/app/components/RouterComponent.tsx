import {TicketsListComponent} from './TicketsListComponent';
import {BrowserRouter as Router, Route, Switch} from 'react-router-dom';
import EditTicketComponent from './EditTicketComponent';

export const RouterComponent = () => {
    return (
        <Router>
            <Switch>
                <Route exact path="/">
                    <TicketsListComponent />
                </Route>
                <Route path="/edit/:ticketId?">
                    <EditTicketComponent />
                </Route>
            </Switch>
        </Router>
    )
}
