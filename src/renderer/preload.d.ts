import { ElectronHandler } from '../main/preload';

declare global {
  // eslint-disable-next-line no-unused-vars
  interface Window {
    electron: ElectronHandler;
  }
}

export interface IElectronAPI {
  openByButton: () => Promise<string | void | undefined>;
}

declare global {
  interface Window {
    myAPI: IElectronAPI;
  }
}

export {};
