import { createContext } from 'react';

const ReceiverIdContext = createContext({
  receiverId: null,
  setReceiverId: () => {},
});

export default ReceiverIdContext;