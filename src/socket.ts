import { createContext } from 'react';
import { io, Socket } from 'socket.io-client';
import { getApiUrl } from './env';

export const socket = io(getApiUrl());

export const SocketContext = createContext<Socket>(socket);
