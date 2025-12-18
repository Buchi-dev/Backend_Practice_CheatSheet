export type NavigateFunction = (path: string, options?: { replace?: boolean }) => void;

export type Status = 'idle' | 'loading' | 'success' | 'error';