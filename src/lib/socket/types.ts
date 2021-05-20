export interface ClientSocket<States, Actions> {
  readyState: number;
  send: (action: Actions) => void;
  close: () => void;
  onopen?: () => void;
  onclose?: () => void;
  onmessage?: (state: States) => void;
}

export interface ServerSocket<States> {
  send: (state: States) => void;
}

export interface Server<States, Actions> {
  onOpen: (socket: ServerSocket<States>) => void;
  onClose: (socket: ServerSocket<States>) => void;
  onAction: (socket: ServerSocket<States>, action: Actions) => void;
}
