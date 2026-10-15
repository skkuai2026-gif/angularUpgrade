import {
  Component,
  OnInit,
  Input,
  SimpleChanges,
  Output,
  EventEmitter,
  OnChanges,
  ChangeDetectionStrategy,
} from '@angular/core';
import { FieldItem } from 'src/app/models/common/field-item';
import { ResponseIO } from 'src/app/models/responseIO';
import { BaseService } from '../services/base.service';
import { SettingService } from '../services/setting.service';
import { BaseComponent } from 'src/app/system-common/base/base.component';

@Component({
  selector: 'sym-data-entry-grid',
  templateUrl: './data-entry-grid.component.html',
  styleUrls: ['./data-entry-grid.component.css'],
  changeDetection: ChangeDetectionStrategy.Eager,
  standalone: false,
})
export class DataEntryGridComponent extends BaseComponent<BaseService> implements OnInit, OnChanges {
  fieldsInitialized: boolean;

  /**
   * It is required input. It is of type ResposeIO.
   *
   * It contains the value to be displayed inside the table.
   * @ResponseIO contains JSON Object of { data; metadata; lookups; validationerrors; }
   */
  @Input() responseIO: ResponseIO;

  /**
   * It expects the field code that needs to be dispalyed. e.g:'selected,productLongName'.
   * If isFormFormatRequired is true then the fieldIds can be bifurcate in rows using ':' separator
   * e.g: 'identityNum:issueDt,expiryDt:issuingAuthority'
   */
  @Input() fieldIds: string;

  /**
   * It expect the path from where the data is to be extracted from @responseIO
   * e.g: 'RiderList.insuredPartyRefGuid'
   */
  @Input() modelPath: string;

  /**
   * It expect the model list
   *
   * e.g: service.responseIO.data.WithdrawalList
   */
  @Input() modelList: any[];

  /**
   * It expects boolean value if more option is required.
   */
  @Input() isMoreRequired: boolean;

  /**
   * It expects boolean value. Default value is true. To hide the option 'false' needs to be set.
   */
  @Input() isDeleteRequired: boolean;

  /**
   * It expects boolean value. Default value is true. To hide the option 'false' needs to be set.
   */
  @Input() isAddRequired: boolean;

  /**
   * It expects Column width Configuration as either
   * - a Stringified number array (e.g: '[50,50]' ) from XML
   * - or a number array (e.g: [50,50]) from Angular templates
   * Each number represents the column width's as percentage of the total 100%
   * e,g: [columWidthPerc] = "[50,50]" this will have 2 column which will be 50% each.
   */
  @Input() columWidthPerc: string | number[];

  /**
   * It expects Column width Configuration as either
   * - a Stringified number array (e.g: '[4,4,4]' ) from XML
   * - or a number array (e.g: [4,4,4]) from Angular templates
   * Each number represents the BootStrap grid column width(out of 12) for one column
   * e,g: [columnWidths] = "[6,6]" this will have 2 column with 6 Bootstrap grid units each(50%)
   */
  @Input() columnWidths: string | number[];

  /**
   * This expects boolean value. This option toggels the table view and form view.
   * Default value is false.
   */
  @Input() isFormFormatRequired: boolean;

  @Input() isCustomLayout: boolean;
  @Input() itemTpl;

  /**
   * It expects string value which will distrubute the width of form view accordingly. Row separation
   * is included with ':' separation based on bootstrap 4 col-grid class.
   * e.g: [columnWidth]="2,4,6:6,6" this will have 2 row which will be displayed 3 field and
   *  2 field respectively. Distribution will be row 0: col-2, col-4, col-6 and row 1 col-6, col-6.
   */
  @Input() formColumnWidth: string;

  /**
   * this is label text that used while delete confirmation.
 
   */
  @Input() deleteLabelText: string;

  /**
   * Specifies the max. number of rows allowed in the grid.
   */
  @Input() maxRecordCount: number;
  /**
   * To check if the fields are rendered using XML.
   */
  @Input() isXMLCodeRendered: boolean;

  /**
   * It expects the labelkey to use for ADD button Label (For eg: add_nominee)
   * When not used/undefined default label key 'add' will be used.
   */
  @Input() addLabelText: string;

  /**
   * To check if the form is set to ReadOnly
   */
  @Input() isFormReadOnly: boolean;

  /**
   * It is triggered when there is a event to emitt on field value is changed.
   * @FieldItem EventEmitter<FieldItem> parameter will send FieldItem JSON Object from the called component
   *
   */
  @Output() notifyChange = new EventEmitter<FieldItem>();

  /**
   * It is triggered when there is a event to emitt on field value is focused.
   * @FieldItem EventEmitter<FieldItem> parameter will send FieldItem JSON Object from the called component
   *
   */
  @Output() notifyFocus = new EventEmitter<FieldItem>();

  /**
   * It is triggered when there is a event to emitt on more selection.
   * @number EventEmitter<number> parameter will send number from the called component
   *
   */
  @Output() onMoreSelected = new EventEmitter<number>();

  /**
   * It is triggered when there is a event to emitt on row added.
   * @number EventEmitter<number> parameter will send number from the called component
   *
   */
  @Output() onRowAdded = new EventEmitter<any>();

  /**
   * This is triggered when fields are rendered on the screen.
   * @FieldItem EventEmitter<FieldItem> parameter will send
   * array of FieldItem JSON Object from the called component
   */
  @Output() onFieldsCreated = new EventEmitter<FieldItem[]>();

  /**
   * @ignore
   */
  public list;

  /**
   * @ignore
   */
  public fieldCodes: string[];

  /**
   * @ignore
   */
  public rowFieldCodes: string[];

  /**
   * @ignore
   */
  public rowColumnWidth: number[][];

  /**
   * @ignore
   */
  public metadataKeyList: any;

  /**
   * @ignore
   */
  public totalValidrecordCount: number;

  /**
   * @ignore
   */
  public classNamesList: string[];

  /**
   * @ignore
   */
  public colWidthPercList: number[];

  constructor(public settingService: SettingService, public baseService: BaseService) {
    super(baseService);
    this.list = [];
    this.totalValidrecordCount = 0;
    this.isAddRequired = true;
    this.isDeleteRequired = true;
    this.isFormReadOnly = false;
    this.fieldsInitialized = false;
  }
  ngOnInit(): void {}

  ngOnChanges(changes: SimpleChanges) {
    if (
      (changes['responseIO'] && changes['responseIO'].currentValue) ||
      (changes['modelList'] && changes['modelList'].currentValue) ||
      (changes['modelPath'] && changes['modelPath'].currentValue)
    ) {
      this.fieldCodes = [];
      this.classNamesList = [];
      this.colWidthPercList = [];
      this.rowFieldCodes = [];
      if (this.baseService.isFormReadOnly || this.isFormReadOnly) {
        this.isFormReadOnly = true;
        this.isAddRequired = false;
        this.isDeleteRequired = false;
      }
      if (this.responseIO?.data?.Entity?.isCompleted || this.responseIO?.data?.Entity?.isInvalid) {
        this.isAddRequired = false;
        this.isDeleteRequired = false;
      }
      //list for the data table to be displayed.
      if (this.modelList != null && this.modelList != undefined) {
        this.list = this.modelList;
      } else {
        this.list = this.baseService.getModelAtPath(this.responseIO.data, this.modelPath);
      }

      //If model metadata is undefined then assigning 0th index Metadata to the model.
      //required in DMS Agent Maintenace , after adding the row and after refreshing the added row is showing beacuase
      //metadata is missing.
      if (this.list != undefined && this.list.length > 0) {
        const firstModel = this.list[0];
        for (const model of this.list) {
          if (this.responseIO.metadata[model.guid] == undefined && firstModel != undefined) {
            this.createFieldMetatada(model, firstModel);
          }
        }
      }
      this.setTotalValidRecordCount();
      if (this.list != undefined)
        this.setFieldFocus(this.list[this.list.length - 1 > 0 ? this.list.length : 0], this.fieldCodes[0]);
      // console.log(this.list);
      // console.log(this.responseIO);
      if (this.fieldIds != undefined) {
        this.fieldIds.split(':').forEach((property) => {
          this.rowFieldCodes.push(property);
        });
        // console.log(this.rowFieldCodes);

        // this.fieldIds.split(',').forEach((property) => {
        //   this.fieldCodes.push(property);
        // });

        this.fieldCodes = this.fieldIds.split(',');
        this.fieldCodes.forEach((property) => {
          if (this.columnWidths != undefined) {
            this.classNamesList.push(
              String(this.computeWidth(property, this.getColumnWidth(this.columnWidths), 'bootstrap'))
            );
          } else {
            this.colWidthPercList.push(
              Number(this.computeWidth(property, this.getColumnWidth(this.columWidthPerc), 'percentage'))
            );
          }
        });
      }
      if (this.responseIO['isMetadataHelpReqd'] === true && this.list != undefined && this.list.length > 0) {
        this.metadataKeyList = [];
        Object.keys(this.responseIO.metadata[this.list[0].guid]).forEach((key) => {
          // console.log(key);
          this.metadataKeyList[key] = [];
          Object.keys(this.responseIO.metadata[this.list[0].guid][key]).forEach((attribute) => {
            // console.log(key);
            this.metadataKeyList[key].push(attribute);
          });
        });
        // console.log(this.metadataKeyList);
      }
      // console.log(this.lookupDesc);
      // console.log(this.fieldCodes);
      // console.log(this.rowColumnWidth);
    }

    if (changes['columWidthPerc'] && changes['columWidthPerc'].currentValue) {
      // console.log(this.columWidthPerc[0]);
    }
    if (changes['formColumnWidth'] && changes['formColumnWidth'].currentValue) {
      // console.log(this.columWidthPerc[0]);
      this.rowColumnWidth = [];
      this.formColumnWidth.split(':').forEach((property) => {
        let col: number[];
        col = [];
        property.split(',').forEach((indCol) => {
          col.push(parseInt(indCol));
        });
        this.rowColumnWidth.push(col);
      });
    }
    this.fieldsInitialized = true;
  }

  /**
   * This is triggered when add button is clicked.
   * @param event clicked event is passed.
   */
  onAddClick(event: any) {
    if (this.list?.length > 0 && this.list[0].objName != undefined) {
      if (this.modelPath != undefined) {
        let modelSrcPath = this.modelPath.replace(this.list[0].objName, '');
        modelSrcPath = modelSrcPath.replace(/\.$/, '');
        this.list[0]['modelSrcPath'] = modelSrcPath;
      }
      this.onRowAdded.emit(this.list[0]);
    } else if (this.modelPath != undefined) {
      let modelName = undefined;
      let modelNameArr = this.modelPath.split('.'); //e.g: modelPath = 'RiderList.insuredPartyRefGuid'
      if (modelNameArr.length > 1) {
        modelName = modelNameArr[1];
      } else {
        modelName = modelNameArr[0];
      }
      this.onRowAdded.emit(modelName);
    } else {
      this.onRowAdded.emit(event);
    }

    setTimeout(() => {
      this.setFieldFocus(this.list[this.list.length - 1 > 0 ? this.list.length - 1 : 0], this.fieldCodes[0]);
    }, 550);
  }

  /**
   * This will be triggered when a item is selected to delete
   * @param rowIndex index of item to be deleted in the list displayed
   * @param event type event which is triggered on click
   */
  onDeleteSelected(rowIndex: number, event: any): void {
    if (this.deleteLabelText == undefined) this.deleteLabelText = 'record';
    //For tabular grid view (Delete Checkbox)
    if (
      event != undefined &&
      event.target != undefined &&
      event.target.checked != undefined &&
      event.target.checked
    )
      this.confirm(
        this.service.getMultilingualMessage('deleteConfirmation', [this.deleteLabelText]),
        () => {
          //mark row as deleted
          if (this.list[rowIndex]['status']) {
            this.list[rowIndex]['status'] = 'D';
          }
          if (this.list[rowIndex]['removed'] !== undefined) {
            this.list[rowIndex]['removed'] = 'YES';
          }
          this.totalValidrecordCount--;
        },
        () => {
          //If cancel is clicked then uncheck the delete checkbox
          event.target.checked = false;
        }
      );
    else if (event != undefined && event.target != undefined && event.target.checked != undefined) {
      //If max records limit reached, then don't allow to restore the current record.
      if (this.maxRecordCount == this.totalValidrecordCount) {
        this.info(this.service.getMultilingualLabel('maxRecordCountReached'));
        event.target.checked = true;
      }
      //If max records limit is not satisfied, then allow to restore current record.
      else {
        this.totalValidrecordCount++;
        this.list[rowIndex]['status'] = this.list[rowIndex]['id'] === '' ? 'I' : 'U';
        if (this.list[rowIndex]['removed'] !== undefined) {
          this.list[rowIndex]['removed'] = '';
        }
      }
    }
    //For Form View grid
    else {
      this.confirm(this.service.getMultilingualMessage('deleteConfirmation', [this.deleteLabelText]), () => {
        this.baseService.setDeleted(this.list[rowIndex]);
        this.totalValidrecordCount--;
      });
    }
  }

  /**
   * on grid event change this method is trigger
   * @param fieldItem item whose value is been changed
   */
  onGridChanged(fieldItem: FieldItem): void {
    //    alert('onGridChanged' + fieldItem.fieldCd);
    this.notifyChange.emit(fieldItem);
  }

  /**
   * on grid event focused this method is trigger
   * @param fieldItem item whose value is been focused
   */
  onGridFocused(fieldItem: FieldItem): void {
    //    alert('onGridFocused' + fieldItem.fieldCd);
    this.notifyFocus.emit(fieldItem);
  }

  /**
   * emit the onFieldsCreated function
   *
   * @param fields
   */
  onComponentFieldsCreated(fields: FieldItem[]): void {
    this.onFieldsCreated.emit(fields);
  }

  private setTotalValidRecordCount() {
    this.totalValidrecordCount = 0;
    if (this.list) {
      this.list.forEach((record) => {
        if (record.status !== 'D') this.totalValidrecordCount++;
      });
    }
  }

  private getColumnWidth(rawValue: string | number[]): number[] {
    let widthsArr: number[] = [];

    if (Array.isArray(rawValue)) return rawValue;

    if (typeof rawValue === 'string') {
      let widths = rawValue.replace(']', '').replace('[', '');
      widths.split(',').forEach((width) => {
        widthsArr.push(parseInt(width));
      });
    }

    return widthsArr;
  }

  private computeWidth(field: string, widthArr: number[], mode: string): string | number {
    const index = this.fieldCodes.indexOf(field);
    const fieldCount = this.fieldCodes.length;

    if (widthArr.length == 0) {
      const baseWidth = Math.floor(100 / fieldCount);
      const remainderWidth = 100 - baseWidth * fieldCount;

      return index < remainderWidth ? baseWidth + 1 : baseWidth;
    } else if (widthArr?.length > 0 && widthArr[index] != undefined && widthArr[index] > 0) {
      const width = widthArr[index];
      return mode == 'percentage' ? width : `col-sm-${width} col-md-${width} col-lg-${width}`;
    }
  }

  // Create a metadata entry for the target field by duplicating the metadata
  // from the source field and storing it under the target field's GUID.
  private createFieldMetatada(model, fromModel) {
    this.responseIO.metadata[model.guid] = this.responseIO.metadata[fromModel.guid];
  }
}
