import { DatePipe } from '@angular/common';
import {
  Component,
  EventEmitter,
  Input,
  Output,
  SimpleChanges,
  forwardRef,
  ChangeDetectionStrategy,
} from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

import { FieldItem } from 'src/app/models/common/field-item';
import { ResponseIO } from 'src/app/models/responseIO';
import { SettingService } from 'src/app/system-common/services/setting.service';
import { CustomFormatPipe } from '../pipe/custom-format.pipe';
import { BaseService } from '../services/base.service';
import { TabItem } from 'src/app/models/common/tab-items';

declare const initTooltip: any;
declare const disableScroll: any;
declare const enableScroll: any;

@Component({
  selector: 'sym-field-group',
  templateUrl: './field-group.component.html',
  styleUrls: ['./field-group.component.css'],
  providers: [{ provide: NG_VALUE_ACCESSOR, useExisting: forwardRef(() => FieldGroupComponent), multi: true }],
  changeDetection: ChangeDetectionStrategy.Eager,
  standalone: false,
})
export class FieldGroupComponent implements ControlValueAccessor {
  /**
   * It is required input. It is of type ResposeIO.
   *
   * It contains the value to be displayed in the UI.
   * @ResponseIO contains JSON Object of { data; metadata; lookups; validationerrors; }
   */
  @Input() responseIO: ResponseIO;

  /**
   * It expects the field code that needs to be dispalyed. e.g:'firstname,lastname'.
   */
  @Input() fieldIds: string;

  /**
   * It hides the field label.
   *
   * Default value is false. If it true it will display the field without labels.
   */
  @Input() hideLabel: boolean;

  /**
   * It hides individual field label.
   *
   */
  @Input() hideLabelList: boolean[];
  /**
   * If indexing is requiered on the field rendered.
   *
   * e.g: 0 means the field rendered is at 0th index.
   */
  @Input() rowIndex: number;

  /**
   * It expect the path from where the data is to be extracted from @responseIO
   * e.g: 'Proposer'
   */
  @Input() modelPath: string;

  /**
   * It expects the model from which the fields are to be renderd based on the code
   *
   * e.g: service.responseIO.data.Proposer
   */
  @Input() model: any;

  /**
   * It displays only field without any css class and its label.
   * default value is false.
   */
  @Input() inputOnly: boolean;

  /**
   * This is to display the field based on bootstrap col class.
   *
   * e.g: [4,6] means there are 2 fields to be displayed one with col-4 and one with col-6 based on
   *  the screens
   */
  @Input() gridColumns: number[];

  /**
   * It displays only label without its respective fields.
   * Default value is false. If true it will display just the labels.
   */
  @Input() labelOnly: boolean;

  /**
   * If you dont want to add row class in html by default pass this as 'false'
   * Default value is true.
   */
  @Input() isRowRequired: boolean;

  /**
   * Displaying the search icon next to the given ID.
   */
  @Input() displaySearchForField: string;

  /**
   * Pass prefix if you want to append this to the fieldId that is generated.
   * this is to avoid to fields to have same id. this happens in cases where the same entity is opened in different components on the same page
   */
  @Input() prefix: string;

  /**
   * Displays only error icon and text.
   */
  @Input() displayErrorOnly: boolean;

  /**
   * To check if the fields are rendered using XML.
   */
  @Input() isXMLCodeRendered: boolean;

  /**
   * To check if the form is set to ReadOnly using XML
   */
  @Input() isFormReadOnly: boolean;

  /**
   * It expects the width list as a string using XML config
   */
  @Input() gridColumnsStr: string;

  /**
   * It expects a boolean value to set the form dirty value
   */
  @Input() isFormDirtyCheckReq: boolean;
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
   * It is triggered when it is clicked on search Icon next to the field displayed.
   *  @FieldItem EventEmitter<FieldItem> parameter will send FieldItem JSON Object from the called component
   */
  @Output() searchIconClicked = new EventEmitter<FieldItem>();

  /**
   * This is triggered when fields are rendered on the screen.
   * @FieldItem EventEmitter<FieldItem> parameter will send
   * array of FieldItem JSON Object from the called component
   */
  @Output() onFieldsCreated = new EventEmitter<FieldItem[]>();

  /**
   * This event is triggered when an element has sumClick attribute and is invoked by clicking on the element.
   */
  @Output() onElementClicked = new EventEmitter<any>();

  /**
   * It is triggered when there is a event to emitt on key down of the field.
   * @FieldItem EventEmitter<FieldItem> parameter will send FieldItem JSON Object from the called component
   *
   */
  @Output() notifyKeyDown = new EventEmitter<FieldItem>();
  /**
   * @ignore
   */
  public fieldCodes: string[];
  /**
   * @ignore
   */
  public fields: FieldItem[];
  /**
   * @ignore
   */
  public isLabelHidden: boolean[];
  /**
   * @ignore
   */
  public displayLabelOnly: boolean;

  /**
   * @ignore
   */
  fieldIDsList: string[];

  // public options: Options;
  /**
   * @ignore
   */
  public isCustomerPortal: boolean;

  isFieldUpperCaseReq: boolean;

  constructor(
    public settingService: SettingService,
    public baseService: BaseService,
    public datepipe: DatePipe,
    private customFormatPipe: CustomFormatPipe
  ) {
    // this.isLabelHidden = false;
    // this.isLabelHidden = [];
    //this.hideLabel = false;
    this.inputOnly = false;
    this.displayLabelOnly = false;
    this.isRowRequired = true;
    this.displayErrorOnly = false;
    // this.options = {
    //     theme: 'classic',
    //     closeOnSelect: false,
    // };
    initTooltip();
    this.isCustomerPortal = this.settingService.isCustomerPortal();
    this.isFieldUpperCaseReq = SettingService.getApplicationPropertiesValue('CONVERTTOUPPERCASE') === 'YES';
    this.isFormDirtyCheckReq = true;
  }

  ngOnChanges(changes: SimpleChanges) {
    if (
      (changes['responseIO'] && changes['responseIO'].currentValue) ||
      (changes['modelPath'] && changes['modelPath'].currentValue) ||
      (changes['model'] && changes['model'].currentValue) ||
      (changes['fieldIds'] && (changes['fieldIds'].currentValue || changes['fieldIds'].currentValue == undefined))
    ) {
      if (this.responseIO.data.length != 0) {
        if (this.baseService.isFormReadOnly || this.isFormReadOnly) {
          this.isFormReadOnly = true;
          this.loadReadOnlyFields();
          return;
        }
        if (this.baseService.isXMLCodeRendered) {
          this.isXMLCodeRendered = true;
        }
        this.fieldCodes = [];
        let tempFields = this.fields;
        this.fields = [];
        this.initFields();
        // console.log('tempFields', tempFields);
        // console.log('fields', this.fields);
        //if onchange already triggered on this field dont call again
        // if (
        //   (changes['responseIO'] && !changes['responseIO'].isFirstChange) ||
        //   (changes['model'] && !changes['model'].isFirstChange) ||
        //   (changes['fieldIds'] && !changes['fieldIds'].isFirstChange)
        // ) {
        if (tempFields != undefined && this.fields != undefined) {
          tempFields.filter((tempField) => {
            this.fields.filter((field) => {
              if (
                field.fieldCd == tempField.fieldCd &&
                field.fieldValue != tempField.fieldValue &&
                tempField.isOnChangeTriggered == false &&
                !this.displayLabelOnly
              ) {
                //for checkbox null and NO value means the same and hence input change should not be called.
                //example proposerLASame checkbox
                if (
                  !(
                    tempField.fieldMetadata.INPUTTYPECD == 'CHECKBOX' &&
                    (tempField.fieldValue == null || tempField.fieldValue == 'NO') &&
                    (field.fieldValue == null || field.fieldValue == 'NO')
                  )
                ) {
                  console.log(
                    field.model.objName + '.' + field.fieldCd + ' Previous:',
                    tempField.fieldValue,
                    ' Current:',
                    field.fieldValue
                  );
                  // console.log('changes', changes);
                  this.onInputChange(field, undefined);
                }
              }
            });
          });
        }
        // }

        // console.log(this.responseIO);
        // console.log(this.modelPath);
      }
    }
    if (changes['hideLabel'] && changes['hideLabel'].currentValue) {
      // this.isLabelHidden.push(this.hideLabel);
      //console.log(this.hideLabel);
    }
    if (changes['hideLabelList'] && changes['hideLabelList'].currentValue) {
      if (this.hideLabelList != undefined && typeof this.hideLabelList === 'string' && this.hideLabelList != '') {
        this.hideLabelList = this.setHideLabelList(this.hideLabelList);
      }
      this.isLabelHidden = this.hideLabelList;
    }
    if (changes['labelOnly'] && changes['labelOnly'].currentValue) {
      this.displayLabelOnly = this.labelOnly;
    }
    if (changes['displayErrorOnly'] && changes['displayErrorOnly'].currentValue) {
      this.displayErrorOnly = this.displayErrorOnly;
    }
    setTimeout(() => {
      initTooltip();
    }, 5);
  }

  /**
   * @ignore
   * used to initialize the fields based on the field ids provided when the form is set to read only.
   * isFormReadOnly is set to true.
   */
  private loadReadOnlyFields() {
    if (this.fieldIds != undefined && this.fieldIds != null) {
      this.fieldIDsList = [];
      if (this.responseIO != undefined) {
        this.baseService.responseIO = this.responseIO;
      }
      this.model =
        this.model != undefined
          ? this.model
          : this.modelPath != undefined
          ? this.baseService.getModelAtPath(this.responseIO.data, this.modelPath)
          : undefined;
      if (this.model == undefined) return;
      this.fieldIds.split(',').forEach((property) => {
        property = property.trim();
        if (
          this.responseIO.metadata[this.model['guid']][property] != undefined &&
          (this.responseIO.metadata[this.model['guid']][property].APPLICABLE == undefined ||
            this.responseIO.metadata[this.model['guid']][property].APPLICABLE === 'YES') &&
          (this.responseIO.metadata[this.model['guid']][property].VISIBILITY == undefined ||
            this.responseIO.metadata[this.model['guid']][property].VISIBILITY === 'YES')
        ) {
          this.fieldIDsList.push(property);
        }
      });
      this.fields = this.fieldIDsList.map((code) => {
        return this.getReadOnlyField(code);
      });
      this.fields.filter((field) => {
        field.divClass = this.getClass(field.fieldCd);
      });
    }
  }
  /**
   * @ignore
   * This function is internally called by loadReadOnlyFields to set the label and fieldValue
   */
  private getReadOnlyField(code: string): FieldItem {
    let item = new FieldItem();
    item.fieldCd = code;
    let fieldMetadata = this.responseIO.metadata[this.model['guid']][item.fieldCd];

    item.label = this.settingService.getLabelValue(fieldMetadata.LABELKEY);

    item.type = fieldMetadata.INPUTTYPECD;

    if (['DATE', 'DATETIME'].includes(item.type)) {
      item.fieldValue = this.baseService.getDateFormatted(this.model[item.fieldCd]);
    } else if (this.responseIO.metadata[this.model['guid']][item.fieldCd].LOOKUPCD != undefined) {
      item.fieldValue = this.baseService.getFieldLookupDesc(this.model, item.fieldCd);
    } else {
      item.fieldValue = this.model[item.fieldCd];
    }
    return item;
  }

  /**
   * @ignore
   * used to initialize the fields based on the field ids provided.
   */
  private initFields() {
    if (this.fieldIds != undefined && this.fieldIds != null) {
      let model =
        this.modelPath != undefined
          ? this.baseService.getModelAtPath(this.responseIO.data, this.modelPath)
          : this.model != undefined
          ? this.model
          : undefined;
      this.fieldIDsList = [];
      this.fieldIds.split(',').forEach((property) => {
        property = property.trim();
        this.fieldIDsList.push(property.trim());
        let value =
          this.modelPath != undefined
            ? this.baseService.getModelAtPath(this.responseIO.data, this.modelPath + '.guid')
            : this.model != undefined
            ? this.model.guid
            : undefined;

        if (
          value != undefined &&
          this.responseIO.metadata[value] != undefined &&
          this.responseIO.metadata[value][property] != undefined
        ) {
          let visibility = this.responseIO.metadata[model['guid']][property].VISIBILITY;
          if (visibility === undefined || visibility === null || visibility === 'YES') {
            visibility = true;
          } else {
            visibility = false;
          }

          let enabled = this.responseIO.metadata[model['guid']][property].ENABLED;
          if (enabled === undefined || enabled === null || enabled === 'YES') {
            enabled = true;
          } else {
            enabled = false;
          }

          let applicable = this.responseIO.metadata[model['guid']][property].APPLICABLE;
          if (applicable === undefined || applicable === null || applicable === 'YES') {
            applicable = true;
          } else {
            applicable = false;
            //field value will be set as undefined for blanking out fields which are not applicable.
            if (!applicable && (!visibility || !enabled)) model[property] = undefined;
          }

          if (applicable && visibility) {
            this.fieldCodes.push(property);
          }
        }
      });

      let name = this.modelPath != undefined ? this.getNameFromPath(this.modelPath) : this.model?.objName;

      if (model != undefined) {
        this.fields = this.fieldCodes.map((code) => {
          return this.createField(code, name, model);
        });
        this.fields.filter((d, index) => {
          d.divClass = this.getClass(d.fieldCd);
          if (d.type == 'HIDDEN') {
            let hidden = this.fields.splice(index, 1);
            this.fields.push(hidden[0]);
          }
        });
      }
    }
    this.onFieldsCreated.emit(this.fields);
  }

  /**
   * @ignore
   * @param code expects the propert or feildID
   * called when model is updated and create a feild item to display the data accordingly
   */
  private createField(code: string, name: string, model: any): FieldItem {
    let item = new FieldItem();
    item.model = model;
    item.fieldCd = code;
    item.modelName = name;
    item.path = this.modelPath;
    item.fieldID = model.guid + '_' + code;
    item.isOnChangeTriggered = false;
    //if some prefix has been passed then set the fieldid appended with that prefix
    //to avoid duplication of ids with same guid and field code
    if (this.prefix != undefined) item.fieldID = this.prefix + '_' + item.fieldID;
    item.index = undefined;
    if (this.rowIndex != undefined) {
      item.index = this.rowIndex;
    }
    item.fieldMetadata = this.responseIO.metadata[item.model['guid']][item.fieldCd];
    item.type = item.fieldMetadata.INPUTTYPECD || 'TEXT';
    //unique name for every field based on the model name + attribute name. For grid index is also appended.
    if (item.path != undefined) name = item.path == item.modelName ? name : item.path;
    item.fieldUnName =
      item.index != undefined && item.index != null
        ? name + '_' + item.index + '_' + item.fieldCd
        : name + '_' + item.fieldCd;
    if (this.prefix != undefined) item.fieldUnName = this.prefix + '_' + item.fieldUnName;
    //numeric combo having issue of saving value as well as setting value so temporary set as FCOMBO
    let datatype = item.fieldMetadata.DATATYPE;
    if (datatype != undefined && datatype != null) {
      if (
        (datatype == 'DOUBLE' ||
          datatype == 'SHORT' ||
          datatype == 'INT' ||
          datatype == 'NUMBER' ||
          datatype == 'BIGDECIMAL' ||
          datatype == 'LONG') &&
        item.type === 'COMBO'
      ) {
        item.type = 'FCOMBO';
      }
    }
    if ((this.isCustomerPortal || this.settingService.isNewUIDisplayed) && item.type == 'COMBO') {
      item.type = 'FCOMBO';
    }
    if (item.type == 'SLIDER') {
      item.type = 'TEXT';
    } else if (item.type == 'LOOKUPTEXT' || item.type == 'FCOMBO' || item.type == 'NCOMBO') {
      item.model[item.fieldCd + '_fc'] = item.model[item.fieldCd] != null ? item.model[item.fieldCd] : null;
      this.baseService.setItemOptions(item, this.responseIO.lookups[item.fieldMetadata.LOOKUPCD]);
      let value = undefined;
      if (item.type == 'NCOMBO') {
        value = item.model[item.fieldCd]; //for NCOMBO you wont find exact match
      } else {
        value = item.foptions.find(
          (opt: any) =>
            opt.value == item.model[item.fieldCd] ||
            (item.model[item.fieldCd + '_fc'] != undefined && opt.value == item.model[item.fieldCd + '_fc'].value)
        );
      }
      if (value == undefined) {
        item.model[item.fieldCd + '_fc'] = undefined;
        item.model[item.fieldCd] = undefined;
      } else if (this.isXMLCodeRendered) {
        item.model[item.fieldCd + '_fc'] = value;
      }
    } else if (item.type === 'LABELCOMBO' || item.type === 'COMBO') {
      item.model[item.fieldCd] =
        item.model[item.fieldCd] != undefined && item.model[item.fieldCd] != null
          ? item.model[item.fieldCd]
          : null;
    } else if (
      item.type == 'CHECKBOX' &&
      (item.fieldMetadata.LOOKUPCD != 'BOOLEAN' || this.responseIO.lookups[item.fieldMetadata.LOOKUPCD].length > 1)
    ) {
      this.baseService.setItemOptions(item, this.responseIO.lookups[item.fieldMetadata.LOOKUPCD]);
      item.multiSelectValues =
        item.model[item.fieldCd] != undefined && item.model[item.fieldCd] != null
          ? item.model[item.fieldCd].split(',')
          : null;
      if (item.multiSelectValues != null && item.multiSelectValues != undefined)
        for (let i = 0; i < item.multiSelectValues.length; i++) {
          if (item.multiSelectValues[i] == '') {
            item.multiSelectValues.splice(i, 1);
          }
        }
    }

    if (item.type == 'SWITCHBUTTON') {
      item.model[item.fieldCd] =
        item.model[item.fieldCd] != undefined && item.model[item.fieldCd] != null
          ? item.model[item.fieldCd]
          : 'NO';
    }
    //adding temp variable for masking
    if (item.type == 'TEXT' && item.fieldMetadata.MASK != undefined)
      item.model[item.fieldCd + '_mk'] = this.customFormatPipe.transform(
        item.model[item.fieldCd],
        item.fieldMetadata
      );

    //item.model[item.fieldCd + '_mk'] = item.model[item.fieldCd];

    // console.log(this.responseIO.lookups[item.fieldMetadata.LOOKUPCD]);
    item.options = item.fieldMetadata.LOOKUPCD ? this.responseIO.lookups[item.fieldMetadata.LOOKUPCD] : null;

    let lookupDataCodes = item.fieldMetadata.LOOKUPDATACODES;
    let lookupDataArray = [];
    if (lookupDataCodes != undefined) lookupDataArray = lookupDataCodes.split(',');

    let notlookupDataCodes = item.fieldMetadata.NOTLOOKUPDATACODES;
    let notlookupDataArray = [];
    if (notlookupDataCodes != undefined) notlookupDataArray = notlookupDataCodes.split(',');

    let lookupDataCodesRange = item.fieldMetadata.LOOKUPDATACODESRANGE;
    let lookupDataCodesRangeArray = [];
    let fromLookupDataCodesRange;
    let toLookupDataCodesRange;
    let multipleFactorInRange;
    if (lookupDataCodesRange != undefined) {
      lookupDataCodesRangeArray = lookupDataCodesRange.split('-');
      fromLookupDataCodesRange = lookupDataCodesRangeArray[0].trim();
      toLookupDataCodesRange = lookupDataCodesRangeArray[1].trim();
      if (lookupDataCodesRangeArray[2] != undefined) multipleFactorInRange = lookupDataCodesRangeArray[2].trim();
    }

    let newLookupDataList = [];

    if (item.options && item.options != undefined && item.options != null) {
      setTimeout(() => {
        for (let i = 0; i < item.options.length; i++) {
          if (
            (lookupDataCodes != undefined &&
              lookupDataArray != undefined &&
              lookupDataArray.includes(item.options[i].cd)) ||
            (notlookupDataCodes != undefined &&
              notlookupDataArray != undefined &&
              !notlookupDataArray.includes(item.options[i].cd)) ||
            (lookupDataCodesRange != undefined &&
              lookupDataCodesRangeArray != undefined &&
              parseInt(fromLookupDataCodesRange) <= parseInt(item.options[i].cd) &&
              parseInt(item.options[i].cd) <= parseInt(toLookupDataCodesRange) &&
              (multipleFactorInRange == undefined ||
                (multipleFactorInRange != undefined && newLookupDataList.length == 0) ||
                (newLookupDataList.length > 0 &&
                  parseInt(newLookupDataList[newLookupDataList.length - 1].value) +
                    parseInt(multipleFactorInRange) ==
                    parseInt(item.options[i].cd))))
          ) {
            if (item.type == 'LOOKUPTEXT' || item.type == 'FCOMBO' || item.type == 'NCOMBO')
              newLookupDataList.push({
                value: item.options[i].cd,
                label: item.options[i].desc,
                isDef: item.options[i].isDef,
              });
            else
              newLookupDataList.push({
                cd: item.options[i].cd,
                desc: item.options[i].desc,
                isDef: item.options[i].isDef,
              });
          }
          if (
            (item.model[item.fieldCd] == undefined || item.model[item.fieldCd] == null) &&
            item.options[i].isDef &&
            item.options[i].isDef == 1
          ) {
            if (
              notlookupDataCodes == undefined ||
              (notlookupDataCodes != undefined &&
                notlookupDataArray != undefined &&
                !notlookupDataArray.includes(item.options[i].cd)) ||
              (lookupDataCodesRange != undefined &&
                parseInt(fromLookupDataCodesRange) < parseInt(item.options[i].cd) &&
                parseInt(item.options[i].cd) < parseInt(toLookupDataCodesRange))
            ) {
              item.model[item.fieldCd] = item.options[i].cd;

              //marking the object as updated if default value is set
              this.setUpdated(item.model);
              item.fieldValue = item.model[item.fieldCd];
              let opt = { value: item.options[i].cd, label: item.options[i].desc };
              item.model[item.fieldCd + '_fc'] = opt;
            }
            if (
              lookupDataCodes == undefined &&
              notlookupDataCodes == undefined &&
              lookupDataCodesRange == undefined
            )
              break;
          }
        }

        if (
          newLookupDataList != undefined &&
          newLookupDataList.length > 0 &&
          (lookupDataCodes != undefined || notlookupDataCodes != undefined || lookupDataCodesRange != undefined)
        ) {
          if (item.type == 'LOOKUPTEXT' || item.type == 'FCOMBO' || item.type == 'NCOMBO')
            item.foptions = newLookupDataList;
          else item.options = newLookupDataList;
        }
      }, 10);
    }

    let visitedTabs: string = '';
    if (
      this.responseIO.data.Entity != undefined &&
      this.responseIO.data.Entity.visitedTabs != undefined &&
      this.responseIO.data.Entity.visitedTabs != null
    )
      visitedTabs = this.responseIO.data.Entity.visitedTabs;
    let visitedTabsArr = visitedTabs.split(',');

    for (let tabname in this.responseIO.validationerrors) {
      //display only those errors if the tab is visited
      if (!visitedTabsArr.includes(tabname)) {
        enableScroll();
        continue;
      }
      if (
        this.responseIO.validationerrors[tabname] != undefined &&
        this.responseIO.validationerrors[tabname][item.model.guid] != undefined &&
        this.responseIO.validationerrors[tabname][item.model.guid][item.fieldCd] != undefined
      ) {
        item.error = this.responseIO.validationerrors[tabname][item.model.guid][item.fieldCd];
        //  item.error = 'Demo test; error test ; temp test;nesxt;; sdds sds;';
        if (item.error.indexOf(this.settingService.getSymErrorSeperator()) > -1) {
          // item.errorList = item.error.split(';').map((text, index) => {
          //   return text.trim();
          // });
          item.errorList = item.error.split(this.settingService.getSymErrorSeperator());
          let errDisplayList = '';
          var countOfErr = item.errorList.length;
          var counter = 0;
          for (var err of item.errorList) {
            ++counter;
            errDisplayList = errDisplayList + err;
            if (counter != countOfErr) errDisplayList = errDisplayList + ' & ';
          }
          item.error = errDisplayList;
        }
      }
    }
    if (this.responseIO['isMetadataHelpReqd'] === true) {
      item['metadataKeyList'] = [];
      Object.keys(item.fieldMetadata).forEach((key) => {
        // console.log(key);
        item['metadataKeyList'].push(key);
      });
    }
    //setting value to items
    item.fieldValue = item.model[item.fieldCd];

    //console.log(item);
    // this.isLabelHidden.push(this.hideLabel);
    return item;
  }

  /**
   * @ignore
   * this check if the item entered is number or not
   */
  public numberOnly(event: any, item: FieldItem): boolean {
    let dataType: any;
    let inputType = item.fieldMetadata.INPUTTYPECD;
    dataType = item?.fieldMetadata?.DATATYPE;
    let allowKeys = ['Backspace', 'Delete', 'ArrowLeft', 'ArrowRight', 'Tab', 'Enter', 'Alt', 'Control', ' '];
    let allowDecimal: boolean = dataType == 'SHORT' || dataType == 'INT' ? false : true;
    if (item?.fieldMetadata?.MASK != undefined && item?.fieldMetadata?.MASK.endsWith('.0-0')) allowDecimal = false;
    if (
      allowKeys.includes(event.key) ||
      (event.ctrlKey && ['c', 'v', 'x', 'a'].includes(event.key.toLowerCase()))
    ) {
      return true;
    }
    /**This done to check the copied value is proper or not for masked field. If it is then paste it else not */
    if (item.fieldMetadata.MASK != undefined && event instanceof ClipboardEvent) {
      let pastedValue = event.clipboardData?.getData('text');
      let unmaskedValue = typeof pastedValue == 'number' ? pastedValue : pastedValue.replace(/[^\d.-]/g, '');
      if (
        typeof unmaskedValue === 'number' ||
        (!isNaN(parseFloat(unmaskedValue)) && isFinite(parseInt(unmaskedValue)))
      ) {
        let maskedValue = this.customFormatPipe.transform(unmaskedValue, item.fieldMetadata);
        if (pastedValue == maskedValue) return true;
        else if (pastedValue != maskedValue) {
          const inputElement = event.target as HTMLInputElement;
          inputElement.value = '';
        }
      }
    }
    if (dataType != undefined && dataType != null) {
      if (dataType == 'DOUBLE' || dataType == 'SHORT' || dataType == 'INT' || inputType == 'NUMERICSTRING') {
        // const charCode = event.which ? event.which : event.keyCode;
        // if (charCode > 31 && (charCode < 48 || charCode > 57)) {
        //var key = event.keyCode || event.which;
        //key = String.fromCharCode(key);
        let key = event.key;
        if (!/^[0-9]$/.test(key) && (allowDecimal ? key != '.' : true)) {
          /*It replaces all the alphabets irrespective of any language*/
          const inputElement = event.target as HTMLInputElement;
          if (inputElement != undefined) {
            const unCleanPattern = allowDecimal ? /[^\d.]/g : /[^\d]/g;
            if (item.fieldMetadata.MASK != undefined) {
              let maskedValue = this.customFormatPipe.transform(inputElement.value, item.fieldMetadata);
              let previousEnteredValue = inputElement.value;
              if (/^[a-z]$/i.test(key)) {
                //If masked value is already present and english alphabet is entered then preserve masked value and remove english alphabet
                inputElement.value = maskedValue;
              } else if (previousEnteredValue == maskedValue) {
                //If no newly chinese value entered then remove the chinese character
                let replacedValue = inputElement.value.replace(unCleanPattern, '');
                inputElement.value = replacedValue;
              } else if (previousEnteredValue.startsWith(maskedValue)) {
                //If masked value is already present and chinese character is entered then preserve masked value and remove  chinese character
                inputElement.value = maskedValue;
              }
            } else {
              let replacedValue = inputElement.value.replace(unCleanPattern, '');
              // if (!isNaN(parseFloat(replacedValue))) inputElement.value = replacedValue;
              inputElement.value = replacedValue;
            }
          }
          this.baseService.setModelFieldValue(item.model, item.model[item.fieldCd], inputElement.value);
          event.returnValue = false;
          if (event.preventDefault) event.preventDefault();
          return false;
        }
        return true;
      }
    } else {
      return true;
    }
  }
  // this method sets the value programmatically
  writeValue(value: any) {}
  // upon UI element value changes, this method gets triggered
  registerOnChange(fn: any) {}
  // upon touching the element, this method gets triggered
  registerOnTouched(fn: any) {}
  /**
   *
   * @param item a particular field item which is update
   * @param event current event
   * triggered when a value is updated on field item.
   * it updates the data in responseIO.data for respective model.
   */
  public onInputChange(item: FieldItem, event: any) {
    // //alert(event.target.id + event.target.value);
    // // console.log(item)
    if (event != null && this.isFormDirtyCheckReq) this.settingService.setFormDirty(true);
    if (SettingService.getApplicationPropertiesValue('VALIDATEDATAFORMATONUI') != 'NO') {
      if (event != undefined && event.target != undefined) {
        let isClearRequired = true;

        //for format pattern mismatch set custom message since default one
        //does not show what is the required format.
        if (event.target.validity != undefined && event.target.validity.patternMismatch) {
          let formatTxt =
            item.fieldMetadata.FORMATTTEXT != undefined
              ? item.fieldMetadata.FORMATTTEXT
              : item.fieldMetadata.FORMAT;
          //let msg = 'Expected format is ' + formatTxt + '. Please match the requested format.';
          let msg = this.baseService.getMultilingualMessage('ERR_FORMAT', [
            item.fieldMetadata.LABELKEY,
            formatTxt,
          ]);
          event.target.setCustomValidity(msg);
        }
        //code added for check black list char
        if (item.fieldMetadata.BLACKLISTCHARS != undefined) {
          const blacklistArray = item.fieldMetadata.BLACKLISTCHARS.split(',').map((char) => char.trim());
          let blackListCharFound;

          for (let blackListChar of blacklistArray) {
            if (item.model[item.fieldCd] != null || item.model[item.fieldCd] != undefined) {
              if (item.model[item.fieldCd].includes(blackListChar)) {
                blackListCharFound = blackListChar;
                break;
              }
            }
          }
          if (blackListCharFound != undefined) {
            let msg = this.baseService.getMultilingualMessage('ERR_BLACKLISTCHAR', [
              item.fieldMetadata.LABELKEY,
              blackListCharFound,
              item.fieldMetadata.BLACKLISTCHARS,
            ]);
            event.target.setCustomValidity(msg);
          }
        }
        if (
          event?.target?.type === 'text' &&
          (item.fieldMetadata.DATATYPE == 'DOUBLE' ||
            item.fieldMetadata.DATATYPE == 'SHORT' ||
            item.fieldMetadata.DATATYPE == 'INT' ||
            item.fieldMetadata.DATATYPE == 'NUMBER')
        ) {
          let enteredValue = item.model[item.fieldCd] != undefined ? Number(item.model[item.fieldCd]) : undefined;

          if (enteredValue != undefined) {
            let maxValue =
              item.fieldMetadata.MAXVALUE != undefined ? Number(item.fieldMetadata.MAXVALUE) : undefined;
            if (maxValue != undefined && enteredValue > maxValue) {
              let msg = this.baseService.getMultilingualMessage('ERR_MAXVALUE', [
                item.fieldMetadata.LABELKEY,
                maxValue,
                enteredValue,
              ]);
              event.target.setCustomValidity(msg);
            } else {
              let maxValueWarn =
                item.fieldMetadata.MAXVALUEWARN != undefined ? Number(item.fieldMetadata.MAXVALUEWARN) : undefined;

              if (maxValueWarn != undefined && enteredValue > maxValueWarn) {
                isClearRequired = false;
                let msg = this.baseService.getMultilingualMessage('ERR_MAXVALUEWARN', [
                  item.fieldMetadata.LABELKEY,
                  maxValueWarn,
                  enteredValue,
                  maxValue,
                ]);
                event.target.setCustomValidity(msg);
              }
            }
            let minValue =
              item.fieldMetadata.MINVALUE != undefined ? Number(item.fieldMetadata.MINVALUE) : undefined;
            if (minValue != undefined && enteredValue < minValue) {
              let msg = this.baseService.getMultilingualMessage('ERR_MINVALUE', [
                item.fieldMetadata.LABELKEY,
                minValue,
                enteredValue,
              ]);
              event.target.setCustomValidity(msg);
            } else {
              let minValueWarn =
                item.fieldMetadata.MINVALUEWARN != undefined ? Number(item.fieldMetadata.MINVALUEWARN) : undefined;

              if (minValueWarn != undefined && enteredValue < minValueWarn) {
                isClearRequired = false;
                let msg = this.baseService.getMultilingualMessage('ERR_MINVALUEWARN', [
                  item.fieldMetadata.LABELKEY,
                  minValueWarn,
                  enteredValue,
                  minValue,
                ]);
                event.target.setCustomValidity(msg);
              }
            }
          }
        }
        if (typeof event.target.reportValidity === 'function') {
          let ret = event.target.reportValidity();
          if (!ret) {
            //if invalid then clear the value after showing the validity error
            //added timeout since the validity error would disappear
            setTimeout(() => {
              if (isClearRequired) {
                item.model[item.fieldCd] = undefined;
                item.model[item.fieldCd + '_mk'] = undefined;
              }
              event.target.setCustomValidity('');
            }, 5000);
            //item.model[item.fieldCd] = undefined;
            return;
          }
        }
      }
    }

    item.event = event;
    if (item.type == 'CHECKBOX') {
      if (item.fieldMetadata.LOOKUPCD != 'BOOLEAN') {
        if (this.responseIO.lookups[item.fieldMetadata.LOOKUPCD].length > 1) {
          let values =
            event.target.checked && item.model[item.fieldCd] != undefined && item.model[item.fieldCd] != null
              ? item.model[item.fieldCd] + ',' + event.target.value
              : event.target.value;

          item.options.filter((opt) => {
            if (event.target.checked && event.target.value == opt.cd) {
              item.model[item.fieldCd] =
                item.model[item.fieldCd] != undefined && item.model[item.fieldCd] != ''
                  ? item.model[item.fieldCd] + ',' + opt.cd
                  : opt.cd;
            } else if (!event.target.checked && event.target.value == opt.cd) {
              item.model[item.fieldCd] =
                item.model[item.fieldCd] != undefined && item.model[item.fieldCd] != ''
                  ? item.model[item.fieldCd].replaceAll(opt.cd, '')
                  : '';
            }
            item.multiSelectValues =
              item.model[item.fieldCd] != undefined && item.model[item.fieldCd] != null
                ? item.model[item.fieldCd].split(',')
                : null;
          });
        } else {
          item.model[item.fieldCd] =
            event.target.checked === true ? this.responseIO.lookups[item.fieldMetadata.LOOKUPCD][0].cd : null;
        }
      } else {
        item.model[item.fieldCd] = event?.target?.checked === true ? 'YES' : 'NO';
      }

      let values =
        item.model[item.fieldCd] != null && item.model[item.fieldCd] != undefined
          ? item.model[item.fieldCd].split(',')
          : null;
      if (values != null && values != undefined)
        for (let i = 0; i < values.length; i++) {
          if (values[i] == '') {
            values.splice(i, 1);
            if (values[i] == '' && i == 0) {
              values = null;
              break;
            }
          }
        }

      if (values == null) item.model[item.fieldCd] = null;
    } else if (item.type == 'LOOKUPTEXT' || item.type == 'FCOMBO' || item.type == 'NCOMBO') {
      if (item.type == 'NCOMBO') {
        let values: string = '';
        for (let foption in item.model[item.fieldCd + '_fc']) {
          values += item.model[item.fieldCd + '_fc'][foption].value + ',';
        }
        item.model[item.fieldCd] =
          values != undefined && values != '' ? values.substring(0, values.lastIndexOf(',')) : undefined;
      } else {
        if (item.fieldCd + '_fc' in item.model) {
          // If the fieldCd_fc field has code value we set that to our fieldCd
          item.model[item.fieldCd] =
            item.model[item.fieldCd + '_fc'] != null && item.model[item.fieldCd + '_fc'].value == undefined
              ? item.model[item.fieldCd + '_fc']
              : item.model[item.fieldCd + '_fc'] != null &&
                (item.model[item.fieldCd + '_fc'].value != null ||
                  item.model[item.fieldCd + '_fc'].value != 'null')
              ? item.model[item.fieldCd + '_fc'].value
              : null;

          if (
            item.fieldMetadata.DATATYPE == 'DOUBLE' ||
            item.fieldMetadata.DATATYPE == 'SHORT' ||
            item.fieldMetadata.DATATYPE == 'INT' ||
            item.fieldMetadata.DATATYPE == 'NUMBER'
          )
            item.model[item.fieldCd] =
              item.fieldMetadata.DATATYPE == 'DOUBLE'
                ? parseFloat(item.model[item.fieldCd])
                : parseInt(item.model[item.fieldCd]);
        }
      }
      if (
        item.model[item.fieldCd + '_fc'] == null ||
        item.model[item.fieldCd + '_fc'] == undefined ||
        item.model[item.fieldCd + '_fc'] == ''
      ) {
        item.event = {};
      }
    }
    // if needed
    else if (item.type == 'LABELCOMBO' || item.type == 'COMBO') {
      if (item.model[item.fieldCd] == null || item.model[item.fieldCd] == 'null') {
        item.model[item.fieldCd] = null;
      }
    } else if (
      item.type == 'TEXT' &&
      item.fieldMetadata.MASK != undefined &&
      (item.fieldMetadata.DATATYPE == 'DOUBLE' ||
        item.fieldMetadata.DATATYPE == 'BIGDECIMAL' ||
        item.fieldMetadata.DATATYPE == 'SHORT')
    ) {
      item.model[item.fieldCd + '_mk'] = this.customFormatPipe.transform(
        item.model[item.fieldCd + '_mk'],
        item.fieldMetadata
      );
      item.model[item.fieldCd] =
        item.model[item.fieldCd + '_mk'] != undefined
          ? item.model[item.fieldCd + '_mk'].toString().replace(/[^\d.-]/g, '')
          : item.model[item.fieldCd];
    } else if (item.type == 'SWITCHBUTTON') {
      item.model[item.fieldCd] =
        item.model[item.fieldCd] != undefined && item.model[item.fieldCd] != null
          ? item.model[item.fieldCd]
          : 'NO';
    } else if (item.type == 'FILE') {
      item.model[item.fieldCd] =
        item.model[item.fieldCd] != undefined && item.model[item.fieldCd] != null
          ? item.model[item.fieldCd]
          : 'NO';
      if (event.target.files) {
        var fileLength = event.target.files.length;
        let fileContentArr = [];
        for (let i = 0; i < fileLength; i++) {
          const reader = new FileReader();
          reader.onload = (event: any) => {
            let fileContents = event.target.result;
            if (fileLength < 2 && fileLength > 0) {
              item.model[item.fieldCd] = fileContents;
            } else {
              fileContentArr.push(fileContents);
              item.model[item.fieldCd] = fileContentArr;
            }
          };
          reader.readAsDataURL(event.target.files[i]);
        }
      }
    } else if (
      (item.type == 'TEXT' || item.type == 'TEXTAREA' || item.type == 'EMAIL') &&
      item.fieldMetadata.CASEVALUE != undefined
    ) {
      item.model[item.fieldCd] = this.customFormatPipe.transform(item.model[item.fieldCd], item.fieldMetadata);
    }

    if (item.model['status'] && item.model['status'] === 'N') {
      item.model['status'] = 'I';
    } else if (item.model['status'] && item.model['status'] === 'X') {
      item.model['status'] = 'U';
    }

    item.fieldValue = item.model[item.fieldCd];
    if (
      this.isFieldUpperCaseReq &&
      (item.type == undefined || item.type == 'TEXT' || item.type == 'TEXTAREA' || item.type == 'EMAIL') &&
      item.model[item.fieldCd] !== null
    )
      item.model[item.fieldCd] = item.model[item.fieldCd].toUpperCase();
    if (
      item.type != 'TEXT' &&
      item.type != 'NUMERICSTRING' &&
      item.type != 'TEXTAREA' &&
      item.type != 'EMAIL' &&
      item.type != 'DATE' &&
      item.type != 'DATETIME'
    )
      this.settingService.selectedFieldID = item.fieldID;
    disableScroll();
    this.notifyChange.emit(item);
  }

  /**
   * @ignore
   */
  public unMaskValue(item: FieldItem, event: any) {
    item.model[item.fieldCd + '_mk'] = event;
    if (
      item.type == 'TEXT' &&
      item.fieldMetadata.MASK != undefined &&
      (item.fieldMetadata.DATATYPE == 'DOUBLE' ||
        item.fieldMetadata.DATATYPE == 'BIGDECIMAL' ||
        item.fieldMetadata.DATATYPE == 'SHORT')
    ) {
      item.model[item.fieldCd] = event.replace(/[^\d.-]/g, '');
      //event = item.model[item.fieldCd];
    }
  }

  /**
   *
   * @param item a particular field item which is update
   * @param event current event
   * triggered when a value is updated on field item.
   * it updates the data in responseIO.data for respective model.
   */
  public onInputFocus(item: FieldItem, event: any) {
    this.notifyFocus.emit(item);
  }

  /**
   * @ignore
   */
  private getNameFromPath(path: any) {
    if (path == '') {
      return;
    }
    path = path.replace(/\[(\w+)\]/g, '.$1');
    path = path.replace(/^\./, '');
    let key = path.split('.');
    if (!isNaN(key[key.length - 1])) {
      return key[key.length - 2] + '_' + key[key.length - 1];
    } else {
      return key[key.length - 1];
    }
  }

  /**
   * @ignore
   */
  private getClass(fieldCd: string) {
    if (this.inputOnly || !this.isRowRequired) {
      return '';
    }

    var classList = 'col-sm-6 col-md-6 col-xl-6';
    if (this.gridColumnsStr && this.gridColumnsStr != undefined && this.gridColumnsStr != null) {
      this.gridColumns = [];
      let widths = this.gridColumnsStr.replace('[', '').replace(']', '').trim();
      widths.split(',').forEach((width) => {
        this.gridColumns.push(parseInt(width));
      });
    }
    if (this.gridColumns && this.gridColumns != undefined && this.gridColumns.length != 0) {
      let index: number;

      index = this.fieldIDsList.indexOf(fieldCd);

      for (let i = 0; i < this.gridColumns.length; i++) {
        if (index < i) {
          break;
        }
        if (i == index) {
          classList =
            'col-sm-' +
            this.gridColumns[i] +
            ' col-md-' +
            this.gridColumns[i] +
            ' col-xl-' +
            this.gridColumns[i] +
            ' col-lg-' +
            this.gridColumns[i];
          break;
        }
      }
    } else {
      if (
        this.fields.length === 2 ||
        this.fields.length === 1 ||
        (this.fields.length >= 5 && this.fields.length <= 12)
      ) {
        classList = 'col-sm-6 col-md-6 col-xl-6';
      } else if (this.fields.length === 3) {
        classList = 'col-sm-4 col-md-4 col-xl-4';
      } else if (this.fields.length === 4) {
        classList = 'col-sm-3 col-md-3 col-xl-3';
      } else if (this.fields.length >= 10 && this.fields.length <= 11) {
        classList = 'col-sm-2 col-md-2 col-xl-2';
      } else if (this.fields.length === 12) {
        classList = 'col-sm-1 col-md-1 col-xl-1';
      }
    }

    return classList;
  }

  onSearchIconClick(field: FieldItem) {
    this.searchIconClicked.emit(field);
  }

  private setUpdated(model: any): void {
    if (model['status'] != undefined) {
      if (model['status'] == 'N') model['status'] = 'I';
      else model['status'] = 'U';
    }
  }

  // public checkMaxLength(field: FieldItem, event: any): boolean {
  //   if (
  //     field.fieldMetadata != undefined &&
  //     field.fieldMetadata.MAXLENGTH != undefined &&
  //     field.model[field.fieldCd] != undefined
  //   ) {
  //     if (field.model[field.fieldCd].length >= field.fieldMetadata.MAXLENGTH) {
  //       return false;
  //     }
  //   }
  //   return true;
  // }

  private setHideLabelList(hideLabelList): boolean[] {
    let hideLabelsList: any = [];
    hideLabelList.split(',').forEach((hideLabel) => {
      hideLabelsList.push(hideLabel === 'true');
    });
    return hideLabelsList;
  }

  public onValueClicked(field) {
    // alert(field.fieldCd);
    this.onElementClicked.emit(field.fieldCd);
  }
  /**
   * @param item a particular field item which is to emitted
   * @param event current event
   * triggered on the key down of the field item.
   */
  public onKeyDown(item: FieldItem, event: any) {
    this.notifyKeyDown.emit(item);
  }
  adjustDropdownWidth(ngSelect: any, fieldItem: FieldItem) {
    setTimeout(() => {
      const dropdownPanel = document.querySelector('.ng-dropdown-panel') as HTMLElement;
      if (!dropdownPanel) return;

      // Create canvas for measuring text width
      const canvas = document.createElement('canvas');
      const context = canvas.getContext('2d');
      if (!context) return;

      // Get computed font style of ng-select items
      const sampleOption = document.querySelector('.ng-option') as HTMLElement;
      if (!sampleOption) return;

      const style = getComputedStyle(sampleOption);
      const font = `${style.fontWeight} ${style.fontSize} ${style.fontFamily}`;
      context.font = font;
      let maxWidth = parseFloat(style.width) - 48;

      fieldItem.options.forEach((item) => {
        const width = context.measureText(item.desc).width;
        if (width > maxWidth) {
          maxWidth = width;
        }
      });

      const parentEle = dropdownPanel.parentElement;
      let parentWidth = parseFloat(getComputedStyle(parentEle).width);

      // Add some padding for icons/padding etc.
      const padding = 60; // Adjust if needed
      dropdownPanel.style.width = maxWidth > parentWidth ? `${maxWidth + padding}px` : parentWidth + 'px';
    });
  }
}
