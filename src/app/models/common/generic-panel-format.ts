export class GenericXMLPanelFormat {
  panelID: any;
  panelRows: GenericXMLRow[];
  symIfVal?: boolean;
}

export class GenericXMLRow {
  columns: GenericXMLRowColumn[];
  symIfVal?: boolean;
}

export class GenericXMLRowColumn {
  field: string;
  model: any;
  className: any;
  isVisible: boolean;
  text: any;
  grid: string;
  gridOptions: any;
  gridWidth?: number;
  modelname: string;
  symIfVal?: boolean;
}
