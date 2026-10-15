export class TabItem {
  id: string;
  modelList?: any[];
  isSelected?: boolean;
  errorCount?: number;
  text?: string;
  index?: number;
  visible?: boolean = true;
  imageSrc?: any;
  shortText?: string;
  isSuccessfullyCompleted?: boolean;
  xmlDom?: any;
  xmlIfExpression?: string;
  dependentFields?: any;
  isRightContentAdded?: boolean;
  constructor() {
    this.visible = true;
    this.isSuccessfullyCompleted = false;
  }
}
