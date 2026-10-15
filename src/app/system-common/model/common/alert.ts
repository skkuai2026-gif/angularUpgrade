export class Alert {
  id: string;
  type: AlertType;
  message: string;
  isConfirmationAlert: boolean;
  okCallBack: any;
  cancelCallBack: any;
  parameter: any;
  autoClose: boolean;
  fade: boolean;
  keepAfterRouteChange: boolean;
  okButLabel: string;
  cancelButLabel: string;

  constructor(init?: Partial<Alert>) {
    Object.assign(this, init);
  }
}

export enum AlertType {
  Success,
  Error,
  Info,
  Warning,
  Question,
}
