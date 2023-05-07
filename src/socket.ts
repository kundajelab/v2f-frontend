import { createContext } from 'react';
import { io, Socket } from 'socket.io-client';
import { getDomain } from './env';

export const socket = io(`http://${getDomain()}:4000`);

export const SocketContext = createContext<Socket>(socket);
