import React from 'react';
import {useAppContext} from '../context/context';
import {css, cx} from '@emotion/css';
import { Link } from 'react-router-dom';

const rootStyle = css`
  display: flex;
  flex-direction: column;
`

const titleStyle = css`
  margin: 20px 0;
  font-size: 40px;
  text-align: center;
`

const tableStyle = css`
  td {
    padding: 5px;
  }

  td.completed {
    background: darkseagreen;
  }
`

export const TicketsListComponent = () => {
    const {tickets, userById, completeTicket, isBusy} = useAppContext()

    const renderNoTickets = () => {
        return (
            <div className={css`
              border: 5px solid darkseagreen;
              padding: 20px;
            `}>
                No Ticket Available
            </div>
        )
    }

    const renderTickets = () => {
        return (
            <table className={tableStyle}>
                <thead>
                <tr>
                    <th>Description</th>
                    <th>Assigned To</th>
                    <th>Completed</th>
                    <th>Actions</th>
                </tr>
                </thead>
                <tbody>
                {tickets.map(t => {
                    return (
                        <tr key={t.id}>
                            <td>{t.description}</td>
                            <td>{t.assigneeId ? userById(t.assigneeId).name : 'Not Assigned'}</td>
                            <td className={cx({completed: t.completed})}>
                                {t.completed ? 'Completed' : 'Not Completed'}
                            </td>
                            <td>
                                {!t.completed && <button onClick={() => completeTicket(t.id)} disabled={isBusy}>
                                  Mark as completed
                                </button>}
                                {!isBusy && <Link to={`edit/${t.id}`}>Edit</Link>}
                            </td>
                        </tr>
                    )
                })}
                </tbody>
            </table>
        )
    }

    return (
        <div className={rootStyle}>
            <div className={titleStyle}>Tickets</div>
            <div className="content">
                {!tickets.length && renderNoTickets()}
                {tickets.length && renderTickets()}
                <Link to="/edit/">New Ticket</Link>
            </div>
        </div>
    )
}
