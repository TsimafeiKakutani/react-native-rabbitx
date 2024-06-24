import {ReactNode, createContext, useEffect, useRef, useContext} from 'react';
import {WSProviderType, FeedsResponse} from './types';
import {useState} from 'react';
import {Centrifuge, State} from 'centrifuge';
import {StatusType} from './types';
import {WS_TOKEN} from '../config/const';

const WSContext = createContext<WSProviderType>({
  centrifuge: undefined,
  status: State.Disconnected,
});

// Custom hook to access the Centrifuge context
export const useWSContext = () => useContext(WSContext);

const WSProvider = ({children}: {children: ReactNode}) => {
  const [status, setStatus] = useState<StatusType>(State.Disconnected);
  const centrifuge = useRef<Centrifuge>();

  useEffect(() => {
    // Create a new Centrifuge instance if not already created or disconnected
    if (!centrifuge.current || centrifuge.current.state === 'disconnected') {
      console.log('AAAA', WS_TOKEN);
      centrifuge.current = new Centrifuge('wss://api.prod.rabbitx.io/ws', {
        token: WS_TOKEN,
      });

      // Event handler for when the connection is established
      centrifuge.current.on('connected', () => {
        console.log('connected');
        setStatus(State.Connected);
      });

      // Event handler for connection errors
      centrifuge.current.on('error', ({error}) => {
        console.log('error', error);
        setStatus('error');
      });

      // Event handler for disconnection
      centrifuge.current.on('disconnected', () => {
        console.log('disconnected');
        setStatus(State.Disconnected);
      });

      centrifuge.current.connect();
    }

    return () => centrifuge.current?.disconnect();
  }, []);

  return (
    <WSContext.Provider
      value={{
        centrifuge: centrifuge.current,
        status: status,
      }}>
      {children}
    </WSContext.Provider>
  );
};

export default WSProvider;
