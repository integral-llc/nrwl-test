import React, {FC, useEffect, useState} from 'react';
import {Link, useParams, withRouter} from 'react-router-dom';
import {css} from '@emotion/css';
import {Ticket, User} from '../../backend';
import {useAppContext} from '../context/context';
import {forkJoin} from 'rxjs';
import {RouteComponentProps} from 'react-router';

type Params = {
    ticketId: string;
}

const rootStyles = css`
  display: flex;
  flex-direction: column;

  & .title {
    font-size: 30px;
    font-weight: bold;
    text-align: center;
    margin-bottom: 20px;
  }

  & .description {
    font-weight: bold;
  }
`


const EditTicketComponent: FC<RouteComponentProps> = ({history}) => {
    const {ticketId} = useParams<Params>();
    const [description, setDescription] = useState<string>('');
    const [users, setUsers] = useState<User[]>([]);
    const [userId, setUserId] = useState<number>(0);
    const [isBusy, setIsBusy] = useState<boolean>(false);
    const {backend, changeTicketUser} = useAppContext();
    const [error, setError] = useState<string>('');

    useEffect(() => {
        let observables: any[];
        if (+ticketId) {
            setIsBusy(true);
            observables = [backend.users(), backend.ticket(+ticketId)];
            const sub = forkJoin(observables)
                .subscribe(result => {
                    if (result.length === 1) {
                        setUsers([{id: -1, name: '<Not Assigned>'}, ...result[0] as User[]]);
                    } else {
                        setUsers([{id: -1, name: '<Not Assigned>'}, ...result[0] as User[]]);
                        const ticket: Ticket = result[1] as Ticket;
                        setDescription(ticket.description);
                        setUserId(ticket.assigneeId || -1);
                    }

                    setIsBusy(false);
                })

            return () => {
                sub.unsubscribe();
            }
        }
    }, [backend, ticketId])

    const handleCreateTicket = async () => {
        setIsBusy(true);
        setError('');
        const res = await backend.newTicket({description}).toPromise();
        if (!res) {
            setError('An error occurred.');
            setIsBusy(false);
            return;
        }

        setIsBusy(false);
        history.push('/');
    }

    const handleSaveTicket = async () => {
        // when saving mainly we need to re-assign the ticket if it was changed
        setIsBusy(true);
        setError('');
        const res = await changeTicketUser(+ticketId, userId);
        if (!res) {
            setError('Could not update.');
            setIsBusy(false);
            return;
        }

        setIsBusy(false);
    }

    return (
        <div className={rootStyles}>
            <div className="title">{ticketId ? 'Edit' : 'New'} ticket</div>
            <table>
                <tbody>
                <tr>
                    <td>Description</td>
                    <td>
                        <textarea disabled={!!ticketId}
                                  cols={50} rows={5}
                                  onChange={e => setDescription(e.target.value)}
                                  value={description}/>
                    </td>
                </tr>
                {!!ticketId &&
                <tr>
                  <td>Assigned To</td>
                  <td>
                    <select value={userId} disabled={isBusy} onChange={e => setUserId(+e.target.value)}>
                        {users.map(u => (<option key={u.id} value={u.id}>{u.name}</option>))}
                    </select>
                  </td>
                </tr>
                }
                <tr>
                    <td/>
                    <td>
                        {!ticketId && <button onClick={handleCreateTicket} disabled={isBusy}>New Ticket</button>}
                        {!!ticketId && <button onClick={handleSaveTicket} disabled={isBusy}>Save Changes</button>}
                    </td>
                </tr>
                <tr>
                    <td>
                        <Link to='/'>List of Tickets</Link>
                    </td>
                </tr>
                </tbody>
            </table>
            {error && (<div className={css`color: red`}>{error}</div>)}
        </div>
    )
}

export default withRouter(EditTicketComponent);
