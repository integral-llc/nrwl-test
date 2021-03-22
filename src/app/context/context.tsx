import {createContext, FC, useContext, useEffect, useRef, useState} from 'react';
import {BackendService, Ticket, User} from '../../backend';
import {forkJoin, Subscription} from 'rxjs';
import {filter} from 'rxjs/operators';


export type ContextType = {
    tickets: Ticket[];
    ticketsLoaded: boolean;
    userById: (userId: number) => User;
    completeTicket: (ticketId: number) => void;
    isBusy: boolean;
    backend: BackendService;
    changeTicketUser: (ticketId: number, userId: number) => Promise<boolean>;
}

const AppContext = createContext<ContextType>({} as ContextType);

export const useAppContext = () => useContext<ContextType>(AppContext)

type Props = {
    backend: BackendService;
}

type UsersCache = {
    [key: number]: User;
}

export const AppContextProvider: FC<Props> = ({children, backend}) => {
    const [tickets, setTickets] = useState<Ticket[]>([]);
    const [ticketsLoaded, setTicketsLoaded] = useState<boolean>(false);
    const [isBusy, setIsBusy] = useState<boolean>(false);
    const usersCache = useRef<UsersCache>({});

    useEffect(() => {
        setIsBusy(true);
        const loadData = async () => {
            const tickets = await backend.tickets().toPromise();
            setTickets(tickets);
            const uniqueUsers: { [key: number]: string } = {};
            tickets.filter(t => !!t.assigneeId).forEach(t => uniqueUsers[t.assigneeId!] = '');
            const users = await forkJoin(Object.keys(uniqueUsers).map(id => backend.user(+id)))
                .pipe(
                    filter(u => !!u)
                ).toPromise();
            users.forEach(u => (usersCache.current[+u!.id] = u!));
            setTicketsLoaded(true)
            setIsBusy(false);
        }

        loadData()
    }, [backend])

    const getCachedUser = (id: number) => usersCache.current[id];

    const completeTicket = async (ticketId: number) => {
        setIsBusy(true);
        await backend.complete(ticketId).toPromise();
        setTickets([...tickets.map(t => {
            if (t.id === ticketId) {
                t.completed = true;
            }
            return t;
        })]);
        setIsBusy(false);
    }

    // having this wrapper here to keep a cache of users for tickets list page
    // if needed this can be removed and make always queries to get all users from
    // all visible tickets
    const changeTicketUser = (ticketId: number, userId: number): Promise<boolean> => {
        return new Promise(async (resolve, reject) => {
            setIsBusy(true);
            const res = await backend.assign(ticketId, userId).toPromise();
            if (!res) {
                setIsBusy(false);
                reject(false);
                return;
            }

            if (!(userId in usersCache.current)) {
                const user = await backend.user(userId).toPromise();
                if (user)
                    usersCache.current[userId] = user;
            }

            setIsBusy(false);
            resolve(true);
        })
    }

    const contextValue: ContextType = {
        tickets,
        ticketsLoaded,
        isBusy,
        userById: getCachedUser,
        completeTicket,
        backend,
        changeTicketUser
    }

    return (
        <AppContext.Provider value={contextValue}>
            {children}
        </AppContext.Provider>
    )
}
