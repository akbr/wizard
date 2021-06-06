export interface Socket<Input, Output> {
  send: (action: Output) => void;
  close: () => void;
  onopen?: () => void;
  onclose?: () => void;
  onmessage?: (state: Input) => void;
}
