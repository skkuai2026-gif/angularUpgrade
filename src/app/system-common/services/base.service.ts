import { HttpClient } from '@angular/common/http';
import { Component, Inject, Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { FieldItem } from 'src/app/models/common/field-item';
import { ResponseIO } from 'src/app/models/responseIO';
import { ParentService } from './parent.service';
import { SettingService } from './setting.service';
// import { Alert } from 'src/app/system-common/model/common/alert';
import { SearchResponseIO } from 'src/app/models/search-responseIO';
import { StepItem } from 'src/app/models/common/step-item';
import { TabItem } from 'src/app/models/common/tab-items';

@Injectable({
  providedIn: 'root',
})
export abstract class BaseService extends ParentService {
  /**
   * current responseIO object.
   */
  public responseIO: ResponseIO;

  /**
   * Current  active/ selected Tab
   */
  public currentActiveTab: string;

  public currentActiveField: string;

  currentActiveStep: string;
  /**
   * contains current step object
   */
  public currentActiveStepObj: StepItem;

  /**
   * current SearchResponseIO object.
   */
  public searchResponseIO: SearchResponseIO;

  /**
   * This is used to pass the component list to load the component
   * dynamically via  XML component
   */
  public componentListToDisplay: Component[];

  /**
   * @ignore
   */
  private fieldItemSelected = new Subject<any>();
  /**
   * @ignore
   */
  fieldItemObservable = this.fieldItemSelected.asObservable();
  /**
   * @ignore
   */
  isfieldItemCalled: boolean;
  /**
   * @ignore
   */
  isXMLCodeRendered: boolean;
  /**
   * @ignore
   */
  isFormReadOnly: boolean;

  constructor(
    protected http: HttpClient,
    public settingService: SettingService,
    @Inject(String) protected serviceURL?: string
  ) {
    super(settingService, http);
    this.isfieldItemCalled = false;
    this.isFormReadOnly = false;
    this.isfieldItemCalled = false;
  }

  public abstract init(modelNameList: string[]): Observable<Object>;
  public abstract load(id: any, modelNameList: string[], isMetadataReqd?: boolean): Observable<Object>;
  public abstract process(id, modelNameList: string[]): Observable<Object>;
  public abstract find(executeSearch?: boolean, searchCriteriaData?: any): Observable<Object>;
  public findForLanding(executeSearch?: boolean, searchCriteriaData?: any): Observable<Object> {
    return null;
  }
  /**
   * Override this function if any data needs to be cleared
   */
  public clear(): void {
    this.currentActiveTab = undefined;
    this.currentActiveField = undefined;
    this.id = 0;
    this.responseIO = undefined;
  }

  public clearSubscribe(): void {
    this.isfieldItemCalled = false;
    this.fieldItemSelected.next();
  }
  /**
   * e.g: service.getModelAtPath(service.responseIO.data,modelPath + '.productLongName')
   * @param expects model from which we need to extract the data
   * @param path expects the string from where to extract. properties are deoted from '.' and arrays '[]'
   * This method returns the value or model from the given path from responseIO
   * it returns undefined if the path is incorrect.
   */

  public getModelAtPath(model: any, path: String): any {
    //let model = this.responseIO.data;
    if (path != null && path != undefined) {
      if (path.indexOf('.') >= 0 || path.indexOf('[') >= 0) {
        path = path.replace(/\[(\w+)\]/g, '.$1');
        path = path.replace(/^\./, '');
        let key = path.split('.');
        for (let i = 0, n = key.length; i < n; ++i) {
          let k = key[i];
          if (model != null && model != null && k in model) {
            model = model[k];
          } else {
            return;
          }
        }
        return model;
      } else {
        let k: any = path;
        return model[k];
      }
    } else {
      return;
    }
  }

  /**
   * e.g: service.getModel(this.modelPath)
   * @param path expects the string from where to extract. properties are denoted from '.' and arrays '[]'
   * This method returns the model object from the given path from the current responseIO
   * it returns undefined if the path is incorrect.
   */
  public getModel(path: String): any {
    let model = this.responseIO.data;
    if (model == null || model == undefined || path == undefined || path == null) return undefined;
    return this.getModelAtPath(model, path);
  }

  /**
   * It will return url from the urlList based on the urlKey
   * e.g: getURLValue('QUOTATION')
   * @param urlKey expects the string to extract from urlList e.g: 'LABEL'
   * @returns It returns a string value from the given urlKey from urlList
   */
  public getURLValue(urlKey: string): string {
    return this.settingService.getURLValue(urlKey);
  }

  /**
   *
   * It will return JSON Object of model body list from given modelNameList
   * e.g: getModelNameBodyList(modelNameListArray)
   * @param modelNameList expects the string to extract from urlList e.g:  [
                'Entity',
                'Proposer',
                'PrimaryInsured',
                'JointLife',
            ]
   * @returns It returns a JSON Object from the given modelNameList
   */
  public getModelNameBodyList(modelNameList: string[]): any[] {
    let modelNameBodyList = [];
    modelNameList.filter((name) => {
      let body = {
        ModelName: name,
      };
      modelNameBodyList.push(body);
    });
    return modelNameBodyList;
  }

  /**
   * This will set or remove field's display of read only
   *
   * @param model - The model whose field is to be set as readonly eg. PrimaryParty
   * @param fieldCd - Model's field code that has to be made readonly eg. genderCd
   * @param value - ReadOnly value = YES/NO YES - will set it as readonly. NO - will set it as enabled
   */
  public setFieldReadOnly(model: any, fieldCd: string, value: string): void {
    this.responseIO.metadata[model.guid][fieldCd]['ENABLED'] = value;
  }

  /**
   * This will set or remove field as madatory.
   * @param model- The model whose field is to be set as madatory eg. Proposer
   * @param fieldCd - Model's field code that has to be made madatory eg. title
   * @param value -  Madatory value = 0/1 1 - will set it as madatory.
   *  0 - will set it as not-madatory
   */
  public setFieldMandatory(model: any, fieldCd: string, value: string): void {
    this.responseIO.metadata[model.guid][fieldCd]['MINOCCURS'] = value;
  }

  /**
   * This will set or remove field as visibility.
   * @param model- The model whose field is to be set as visibility eg. PrimaryParty
   * @param fieldCd - Model's field code that has to be made visibility eg. genderCd
   * @param value - Visibility value = YES/NO YES - will set it as visibility.
   *  NO - will set it as not-visibility
   */
  public setFieldVisible(model: any, fieldCd: string, value: string): void {
    this.responseIO.metadata[model.guid][fieldCd]['VISIBILITY'] = value;
  }

  /**
   * This will return the lookup object of the Model.attribute that is passed.
   * e.g: service.getFieldLookupDesc(service.responseIO.data.BasePlan, 'productId')
   * @param model - The Model object whose lookup is to be returned. e.g: 'BasePlan'
   * @param attribute - The attribute in the Model whose lookup is to be returned. e.g: 'productId'
   * @returns - string description of the lookup.
   */
  getFieldLookupDesc(model: any, attribute: string): any {
    let lookupDesc = '';
    // console.log("this.responseIO.metadata[model['guid']][attribute]",model['guid']);
    if (
      model != undefined &&
      this.responseIO != undefined &&
      this.responseIO.metadata != undefined &&
      this.responseIO.metadata[model['guid']] != undefined &&
      this.responseIO.metadata[model['guid']][attribute] != undefined
    ) {
      lookupDesc = this.getValueFromLookup(
        this.responseIO.metadata[model['guid']][attribute].LOOKUPCD,
        model[attribute]
      );
    }
    // console.log("lookupdesc",lookupDesc);
    return lookupDesc;
  }

  /**
   * This will return the lookup data count of the Model.attribute that is passed.
   * e.g: service.getFieldLookupSize(this.service.responseIO.data.Entity, 'allocationPartyGuidList')
   * @param model - The Model object whose lookup data count is to be returned. e.g: 'Entity'
   * @param attribute - The attribute in the Model whose lookup is to be returned. e.g: 'allocationPartyGuidList'
   * @returns number. The count or length of the number of lookup data entries for the given model and property.
   */
  getFieldLookupSize(model: any, attribute: string): number {
    let lookupCount = undefined;
    if (
      this.responseIO.metadata[model['guid']] != undefined &&
      this.responseIO.metadata[model['guid']][attribute] != undefined
    ) {
      lookupCount = this.responseIO.lookups[this.responseIO.metadata[model['guid']][attribute].LOOKUPCD].length;
    }
    return lookupCount;
  }

  /**
   * This will return the lookup data description of the lookupkey , lookupdata code that is passed.
   * @param lookupKey - The lookup key whose lookup data desc is to be returned. eg. GENDER
   * @param lookupDataCd - The lookup data code object whose lookup data desc is to be returned. eg. MALE
   * @returns - Description of the lookup data code . Eg. Male
   */
  getValueFromLookup(lookupKey: string, lookupDataCd: string): string {
    // console.log("in getValueFromLookup",lookupKey,lookupDataCd);
    if (this.responseIO.lookups[lookupKey] != undefined && lookupDataCd != null) {
      let lookupOption = this.responseIO.lookups[lookupKey];
      let lookupOptionSel = lookupOption.find((currLookupOption) => currLookupOption.cd === lookupDataCd);
      return lookupOptionSel != undefined ? lookupOptionSel.desc : lookupDataCd;
    } else {
      return lookupDataCd;
    }
  }

  /**
   * This will return the lookup data description of the lookupkey , lookupdata code that is passed.
   * @param lookupKey - The lookup key whose lookup data desc is to be returned. eg. QUOTESTATUS
   * @param lookupDataDesc - The lookup data desc object whose lookup data code is to be returned. eg. 'Accepted'
   * @param lookupList - The lookup list from where the desc object whose lookup data code is to be returned. eg. lookups: {PLAN:[],QUOTESTATUS:[]}
   * @returns - Description of the lookup data code . Eg. Male
   */
  getCodeFromLookupDesc(lookupKey: string, lookupDataDesc: string, lookupList?: any): string {
    if (
      this.responseIO != undefined &&
      lookupKey != undefined &&
      this.responseIO.lookups != undefined &&
      this.responseIO.lookups[lookupKey] != undefined &&
      lookupDataDesc != null
    ) {
      let lookupOption = this.responseIO.lookups[lookupKey];
      let lookupOptionSel = lookupOption.find((currLookupOption) => currLookupOption.desc === lookupDataDesc);
      return lookupOptionSel != undefined ? lookupOptionSel.cd : lookupDataDesc;
    } else if (
      lookupList != undefined &&
      lookupDataDesc != null &&
      lookupList[lookupKey] != undefined &&
      lookupKey != undefined
    ) {
      let lookupOption = lookupList[lookupKey];
      let lookupOptionSel = lookupOption.find((currLookupOption) => currLookupOption.desc === lookupDataDesc);
      return lookupOptionSel != undefined ? lookupOptionSel.cd : lookupDataDesc;
    } else {
      return lookupDataDesc;
    }
  }

  /**
   * This will return the Metadata JSON object of the Model.attribute that is passed.
   * i.e. for eg. PrimaryParty.genderCd will return the metadata information
   * like INPUTTYPE, VISIBILITY, LABEL, MANDATORY etc.
   * @param model - The Model object whose metadata is to be returned. Eg. PrimaryParty
   * @param attribute - The attribute in the Model whose metadata is to be returned. Eg. genderCd
   * @returns - JSON structure of the Metadata object. undefined if not found.
   */
  getFieldMetadata(model: any, attribute: string): any {
    if (
      this.responseIO.metadata[model['guid']] != undefined &&
      this.responseIO.metadata[model['guid']][attribute] != undefined
    ) {
      return this.responseIO.metadata[model['guid']][attribute];
    } else return undefined;
  }

  getFieldMetadataPropertyValue(model: any, attribute: string, property: string): any {
    if (
      this.responseIO.metadata[model['guid']] != undefined &&
      this.responseIO.metadata[model['guid']][attribute] != undefined &&
      this.responseIO.metadata[model['guid']][attribute][property] != undefined
    ) {
      return this.responseIO.metadata[model['guid']][attribute][property];
    } else return undefined;
  }

  /**
   * This will return the Label value in selected language to display of the Model.attribute
   * that is passed.
   * i.e. for eg. Proposer.genderCd will return the label information 'Gender'
   * @param model - The Model object whose label is to be returned. Eg. Proposer
   * @param attribute - The attribute in the Model whose label is to be returned. Eg. genderCd
   * @returns - string of the label to be displayed. Eg. Gender. undefined if not found.
   */
  getLabelValue(model: any, attribute: string): string {
    if (
      this.responseIO.metadata[model['guid']] != undefined &&
      this.responseIO.metadata[model['guid']][attribute] != undefined &&
      this.responseIO.metadata[model['guid']][attribute].APPLICABLE !== 'NO'
    ) {
      if (
        this.responseIO.metadata[model['guid']] != undefined &&
        this.responseIO.metadata[model['guid']][attribute].VISIBILITY !== 'NO'
      ) {
        if (
          this.responseIO.metadata[model['guid']] != undefined &&
          ((this.responseIO.metadata[model['guid']][attribute].INPUTTYPECD != undefined &&
            this.responseIO.metadata[model['guid']][attribute].INPUTTYPECD !== 'HIDDEN') ||
            this.responseIO.metadata[model['guid']][attribute].INPUTTYPECD == undefined)
        ) {
          return this.settingService.getLabelValue(this.responseIO.metadata[model['guid']][attribute].LABELKEY);
        } else {
          return undefined;
        }
      } else {
        return undefined;
      }
    } else {
      return undefined;
    }
  }

  /**
   * This will return whether field applicable or not.
   * @param model - The Model object whose field is to be checked. Eg. Proposer
   * @param attribute - The attribute in the Model whose filed is to be checked. Eg. genderCd
   * @returns -boolean value.
   */

  isFieldApplicable(model: any, attribute: string): boolean {
    let isFieldApplicable = false;
    if (
      this.responseIO.metadata[model['guid']] != undefined &&
      this.responseIO.metadata[model['guid']][attribute] != undefined &&
      this.responseIO.metadata[model['guid']][attribute].APPLICABLE !== 'NO'
    ) {
      if (
        this.responseIO.metadata[model['guid']] != undefined &&
        this.responseIO.metadata[model['guid']][attribute].VISIBILITY !== 'NO'
      ) {
        if (
          this.responseIO.metadata[model['guid']] != undefined &&
          ((this.responseIO.metadata[model['guid']][attribute].INPUTTYPECD != undefined &&
            this.responseIO.metadata[model['guid']][attribute].INPUTTYPECD !== 'HIDDEN') ||
            this.responseIO.metadata[model['guid']][attribute].INPUTTYPECD == undefined)
        ) {
          return true;
        } else {
          return false;
        }
      } else {
        return false;
      }
    } else {
      return false;
    }
  }

  /**
   *
   * @param dateObj - the Date object to be formatted eg. PrimaryInsured['dob']
   * @returns - The formatted date string as per system date format settings.
   */
  getDateFormatted(dateObj: Date): string {
    return this.settingService.getDateFormatted(dateObj);
  }

  public getDateTimeFormatted(dateObj: Date): string {
    return this.settingService.datepipe.transform(
      dateObj,
      SettingService.getSystemDateFormat() + ' ' + SettingService.getSystemTimeFormat()
    );
  }

  fetchMetadata(): Observable<Object> {
    let body = this.getPostBody(this.getResponseModelNameList());
    let action = 'fetchMetadata';

    return this.httpPost(
      `${this.getURLValue(this.serviceURL)}`,
      body,
      {
        key: 'action',
        value: action,
      },
      false
    );
  }

  validate(): Observable<Object> {
    let body = this.getPostBody(this.getResponseModelNameList());
    let action = 'validate';

    let path =
      this.id > 0 ? `${this.getURLValue(this.serviceURL)}/${this.id}` : `${this.getURLValue(this.serviceURL)}`;
    return this.httpPost(
      path,
      body,
      {
        key: 'action',
        value: action,
      },
      false
    );
  }

  /**
   * This will update/refresh the metadata of current ResponseIO
   * @param updatedResponse - The Response object whose metadata is to be updated.
   */
  refreshMetaData(updatedResponse: ResponseIO): void {
    Object.assign(this.responseIO.metadata, updatedResponse.metadata);
    this.refreshLookups(updatedResponse);
  }
  /**
   * This will update/refresh the lookup of current ResponseIO
   * @param updatedResponse - The Response object whose metadata is to be updated.
   */
  refreshLookups(updatedResponse: any): void {
    if (updatedResponse.lookups != undefined) {
      Object.keys(updatedResponse.lookups).forEach((newkey) => {
        if (this.responseIO.lookups[newkey] == undefined) {
          this.responseIO.lookups[newkey] = updatedResponse.lookups[newkey];
        }
      });
    }
  }

  /**
   * This will set the model status to Delete.
   * @param model - The Model object whose status is to be updated.
   */
  public setDeleted(model: any): void {
    if (model['status'] != undefined) {
      model['status'] = 'D';
    }
    if (model['removed'] !== undefined) {
      model['removed'] = 'YES';
    }
  }

  /**
   * This will set the model status to Updated/Inserted based on the original status.
   * @param model - The Model object whose status is to be updated.
   */
  public setUpdated(model: any): void {
    if (model['status'] != undefined) {
      if (model['status'] == 'N') model['status'] = 'I';
      else model['status'] = 'U';
    }
  }

  /**
   * This will set options details to the fielditem provided with the lookup details based on input type
   * @param item  - The field item object whose lookup option is to be set.
   * @param lookupOptions - lookup option to set in given item based on input type
   */
  public setItemOptions(item: FieldItem, lookupOptions: any, isDefault1Selected?: boolean): boolean {
    if (item == undefined || item == null) return;
    let prevValue: any;
    if (item.model[item.fieldCd] != null) {
      prevValue = item.model[item.fieldCd];
      //Commented this since was always calling change in setmodelvalue. Need to test
      //all scenarios
      //item.model[item.fieldCd] = undefined;
    }

    let notlookupDataCodes = item.fieldMetadata.NOTLOOKUPDATACODES;
    let notlookupDataArray = [];
    if (notlookupDataCodes != undefined) notlookupDataArray = notlookupDataCodes.split(',');

    let lookupDataCodesRange = item.fieldMetadata.LOOKUPDATACODESRANGE;
    let lookupDataCodesRangeArray = [];
    let fromLookupDataCodesRange;
    let toLookupDataCodesRange;
    if (lookupDataCodesRange != undefined) {
      lookupDataCodesRangeArray = lookupDataCodesRange.split('-');
      fromLookupDataCodesRange = lookupDataCodesRangeArray[0].trim();
      toLookupDataCodesRange = lookupDataCodesRangeArray[1].trim();
    }

    if (item.type == 'COMBO' || item.type == 'CHECKBOX') {
      item.options = [];
      item.options = lookupOptions;
    } else if (item.type == 'FCOMBO' || item.type == 'LOOKUPTEXT' || item.type == 'NCOMBO') {
      let options = [];
      lookupOptions?.filter((option) => {
        options.push({ value: option.cd, label: option.desc, isDef: option.isDef });
      });
      item.foptions = [];
      item.foptions = options;
    }
    lookupOptions?.filter((option) => {
      if ((prevValue == undefined || prevValue == null) && option.isDef && option.isDef == 1) {
        if (
          notlookupDataCodes == undefined ||
          (notlookupDataCodes != undefined &&
            notlookupDataArray != undefined &&
            !notlookupDataArray.includes(option.cd)) ||
          (lookupDataCodesRange != undefined &&
            parseInt(fromLookupDataCodesRange) < parseInt(option.cd) &&
            parseInt(option.cd) < parseInt(toLookupDataCodesRange))
        )
          prevValue = option.cd;
      }
    });
    if (isDefault1Selected && lookupOptions != undefined && lookupOptions.length == 1) {
      // item.model[ item.fieldCd ] = lookupOptions[ 0 ].cd;
      this.setModelFieldValue(item.model, item.fieldCd, lookupOptions[0].cd);
      prevValue = lookupOptions[0].cd;
    }

    //it doesn't work without timeout.
    if (prevValue != undefined) {
      // item.model[ item.fieldCd ] = prevValue;
      this.setModelFieldValue(item.model, item.fieldCd, prevValue);
      item.fieldValue = item.model[item.fieldCd];
      setTimeout(() => {
        if (item.foptions && item.foptions != undefined && item.foptions != null) {
          if (item.type == 'FCOMBO' || item.type == 'LOOKUPTEXT') {
            item.foptions.filter((option) => {
              if (option.value == item.model[item.fieldCd]) {
                // item.model[ item.fieldCd + '_fc' ] = option;
                this.setModelFieldValue(item.model, item.fieldCd, option.value);
                item.model[item.fieldCd + '_fc'] = option;
                item.fieldValue = item.model[item.fieldCd];
                // this.setModelFieldValue(item.model, item.fieldCd + '_fc', option);
                return true;
              }
            });
          } else if (item.type == 'NCOMBO') {
            let values =
              prevValue != undefined
                ? prevValue.toString().split(',')
                : item.model[item.fieldCd] != undefined
                ? item.model[item.fieldCd].toString().split(',')
                : '';
            if (values != '' && values != undefined) {
              let foptions = [];
              lookupOptions.filter((option) => {
                for (let value in values) {
                  if (option.cd == values[value]) {
                    foptions.push({ value: option.cd, label: option.desc, isDef: option.isDef });
                  }
                }
              });
              // item.model[ item.fieldCd + '_fc' ] = foptions;
              this.setModelFieldValue(item.model, item.fieldCd, prevValue);
              item.model[item.fieldCd + '_fc'] = foptions;
              item.fieldValue = item.model[item.fieldCd];
              //   this.setModelFieldValue(item.model, item.fieldCd + '_fc', foptions);
            }
          }
        } else {
          // item.model[ item.fieldCd ] = prevValue;
          this.setModelFieldValue(item.model, item.fieldCd, prevValue);
          item.fieldValue = item.model[item.fieldCd];
        }
      }, 10);
    }

    if (isDefault1Selected && lookupOptions != undefined && lookupOptions.length == 1) {
      return true;
    } else {
      return false;
    }
  }

  /**
   * This will fetch the value from the given model using the fieldId
   * @param model - The Model object whose value is to be fetched.
   * @param fieldId - The fieldid whose value is to be fetched from given model.
   */
  public getModelFieldDataDesc(model: any, field: string): string {
    if (!model || !field) return '';
    let fieldMetadata = this.responseIO.metadata[model['guid']][field];
    let fieldValue = model[field];
    if (fieldValue === undefined || fieldValue === null) return '';
    if (fieldMetadata) {
      if (fieldMetadata.INPUTTYPECD === 'DATE' || fieldMetadata.INPUTTYPECD === 'DATETIME') {
        return this.getDateFormatted(fieldValue);
      } else if (fieldMetadata.LOOKUPCD !== undefined) {
        return this.getFieldLookupDesc(model, field);
      }
    }
    return fieldValue;
  }

  /**
   * This will set the value given in the fieldId in given model
   * @param model - The Model object whose value is to be set.
   * @param fieldId - The fieldid whose value is to be set in given model.
   * @param value - The value to set in given model based on fieldId.
   */
  public setModelFieldValue(model: any, fieldId: string, value: any, triggerChange?: boolean): void {
    let triggerChangeReq = triggerChange != undefined ? triggerChange : true;
    if (model == undefined) return;
    if (!(fieldId in model)) return;
    let prevValue = model[fieldId];
    model[fieldId] = value;
    if (fieldId + '_dt' in model) {
      if (value != undefined) model[fieldId + '_dt'] = this.getDateFormatted(value);
      else model[fieldId + '_dt'] = undefined;
    } else if (fieldId + '_fc' in model) {
      if (
        this.responseIO != undefined &&
        this.responseIO.metadata != undefined &&
        value != null &&
        value != undefined
      ) {
        let metadata = this.getFieldMetadata(model, fieldId);
        let lookupOption = this.responseIO.lookups[metadata.LOOKUPCD];
        let lookupValues = undefined;
        let foptions = [];
        if (
          metadata.INPUTTYPECD == 'NCOMBO' ||
          metadata.INPUTTYPECD == 'LOOKUPTEXT' ||
          metadata.INPUTTYPECD == 'FCOMBO'
        ) {
          model[fieldId] = value; //for NCOMBO you wont find exact match
          lookupValues = value.toString().split(',');
          // if(lookupValues.length>0){}
          lookupOption.filter((option) => {
            for (let value in lookupValues) {
              if (option.cd == lookupValues[value]) {
                foptions.push({ value: option.cd, label: option.desc, isDef: option.isDef });
              }
            }
          });
          model[fieldId + '_fc'] = foptions;
        }
        // let lookupOptionSel = lookupOption.find((currLookupOption) => currLookupOption.cd === value);
        // if (lookupOptionSel != undefined) {
        //   model[fieldId + '_fc'] = {
        //     value: lookupOptionSel.cd,
        //     label: lookupOptionSel.desc,
        //     isDef: lookupOptionSel.isDef,
        //   };
        // }
      } else {
        model[fieldId + '_fc'] = model[fieldId] != null ? model[fieldId] : null;
      }
    } else if (fieldId + '_mk' in model) {
      if (this.responseIO != undefined && this.responseIO.metadata != undefined) {
        model[fieldId + '_mk'] = this.settingService.customFormatPipe.transform(
          model[fieldId],
          this.responseIO.metadata[model.guid][fieldId]
        );
      } else {
        model[fieldId + '_mk'] = value;
      }
    }
    this.setUpdated(model);
    //Call context check and validation only if the previous and new values are different
    let actualValue = value?.value != undefined ? value?.value : value;
    //Added triggerChangeReq to prevent an unnecessary onChange call when the previous value is null and the actual value is 0.
    if (prevValue != actualValue && triggerChangeReq) this.fieldValidationAndContextCheck(model, fieldId);
  }

  /**
   * This will call search API based on the criteria which return searchList
   * @param name - Name of model to get search List Eg: 'SearchLifeIllustration'
   * @param executeSearch - boolean value to set executeSearch. default value is true
   * @param searchCriteriaData - JSON structure of the searchCriteriaData object.
   * @returns - JSON structure of the Search List object.
   */
  public getSearchList(name: string, executeSearch?: boolean, searchCriteriaData?: any): Observable<Object> {
    let body = {
      executeSearch: executeSearch == undefined || executeSearch == null || executeSearch ? true : executeSearch,
      searchCriteriaData,
    };
    // console.log(JSON.stringify(body));
    return this.httpPost(`${this.getURLValue('SEARCH')}?name=${name}`, body);
  }

  /**
   * This will get the JSON body for API calls based on modelNameList
   * @param modelNameList - This contain list of model name.
   * @param isMetadataReqd - This option specify if metadata is required based on boolean.
   * Default value os true.
   * @returns - JSON structure of the object.
   */
  public getFetchBody(modelNameList: any[], isMetadataReqd: boolean = true): any {
    let body = {
      FetchData: {
        isMetadataRequired: isMetadataReqd,
        language: this.settingService.getSelectedLanguage(),
        Models: modelNameList,
        currentActiveTab: this.currentActiveTab,
        currentActiveField: this.currentActiveField,
        currentActiveStep: this.currentActiveStep,
      },
    };
    return body;
  }

  /**
   * This will get the JSON body for API calls based on modelNameList
   * @param modelNameList - is contain list of model name.
   * @param isMetadataReqd - This option specify if metadata is required based on boolean
   * default value is true
   * @returns - JSON structure of the object.
   */
  public getPostBody(modelNameList: any[], isMetadataReqd: boolean = true): any {
    let body = {
      FormData: {
        Models: this.responseIO.data,
        ModelNames: this.getModelNameList(),
      },
      FetchData: {
        Models: modelNameList,
        isMetadataRequired: isMetadataReqd,
        language: this.settingService.getSelectedLanguage(),
        currentActiveTab: this.currentActiveTab,
        currentActiveField: this.currentActiveField,
        currentActiveStep: this.currentActiveStep,
      },
    };
    return body;
  }

  /**
   * This return JSON Object of fetch body for Dynamic API calls.
   * @returns JSON Object
   */
  public getFetchBodyInDynamicAPI(): any {
    let fetchData = {
      FetchData: {
        currentActiveTab: this.currentActiveTab,
        currentActiveField: this.currentActiveField,
        currentActiveStep: this.currentActiveStep,
      },
    };
    return fetchData;
  }
  /**
   *This will get the JSON Object of body for Dynamic API calls based on modelNameList
   * @param modelNameList - This contain list of model name.
   * @returns - JSON structure of the object.
   */
  public getFetchFormBodyInDynamicAPI(modelNameList: string[]): any {
    let FormData: Record<string, any> = {
      Models: {},
    };
    modelNameList.forEach((modelName) => {
      FormData.Models[modelName] = this.responseIO.data[modelName];
    });
    let body: Record<string, any> = {
      FormData: FormData,
      FetchData: {
        currentActiveTab: this.currentActiveTab,
        currentActiveField: this.currentActiveField,
        currentActiveStep: this.currentActiveStep,
      },
    };
    return body;
  }

  /**
   * This will return application property value.
   * @param property property string to retrun the value.
   * @returns string of application value for given property.
   */
  public getApplicationPropertyValue(property: string): string {
    let applicationValue = SettingService.getApplicationPropertiesValue(property);
    return applicationValue;
  }

  /**
   * This check if the app is opened in mobile or dekstop.
   * @deprecated use isMobileViewRendered instead
   * @returns boolean value. It returns true if its opened in mobile else it will return false.
   */
  public isMobileViewRendeered(): boolean {
    return this.settingService.isMobileViewRendered();
  }

  /**
   * This check if the app is opened in mobile or dekstop.
   * @returns boolean value. It returns true if its opened in mobile else it will return false.
   */
  public isMobileViewRendered(): boolean {
    return this.settingService.isMobileViewRendered();
  }

  /**
   * This check if the app is opened in mobile or dekstop.
   * @returns boolean value. It returns true if its opened in mobile and landscape view
   * else it will return false.
   */
  public isLandScapeViewRendered(): boolean {
    return this.settingService.isLandScapeViewRendered();
  }

  public validateOTP(otpType: string, entityGuid: string, currentOTP: any): Observable<Object> {
    let response: any;
    let body = {
      otpType: otpType,
      entityGuid: entityGuid,
      OTP: currentOTP,
    };
    return this.httpPost(`${this.getURLValue(this.serviceURL)}/${this.id}/validateOTP`, body);
  }

  public generateOTP(otpType: string, entityGuid: string): Observable<Object> {
    let response: any;
    let body = {
      otpType: otpType,
      entityGuid: entityGuid,
    };
    return this.httpPost(`${this.getURLValue(this.serviceURL)}/${this.id}/generateOTP`, body);
  }

  /**
   * This will set session variable based on the key.
   * @param key expects a value which will be the key to setItem in session variable.
   * @param value to be set in the said key in session storage
   */
  public setSessionStorageValue(key: string, value: any): void {
    this.settingService.setSessionStorageValue(key, value);
  }

  /**
   * This will get session variable based on the key.
   * @param key expects a value which will be the key to getItem from session variable.
   */
  getSessionStorageValue(key: string): any {
    return this.settingService.getSessionStorageValue(key);
  }

  /**
   * This refresh the page with-out reloading the page
   */
  reloadCurrentRoute(): void {
    this.settingService.reloadCurrentRoute();
  }

  /**
   * This adds the year to the given date.
   * @param date expects date to be modified
   * @param yearsToAdd expects number to be added in the given date.
   * @returns the modified date.
   */
  addYearsToGivenDate(date: Date, yearsToAdd: number): Date {
    return new Date(
      date.getFullYear() + yearsToAdd,
      date.getMonth(),
      date.getDate(),
      date.getHours(),
      date.getMinutes(),
      date.getSeconds()
    );
  }

  /**
   *
   * @returns current date
   */
  getCurrentDate(): Date {
    return new Date(Date.now());
  }

  /**
   * This sets and initialize the alert value for alert component.
   */
  // setAlertMessage(
  //   message: string,
  //   headerText?: string,
  //   iconClass?: string,
  //   isConfirmationAlert?: boolean,
  //   // hideCloseButton?: boolean,
  //   callbackMethodName?: string,
  //   cancelCallbackMethodName?: string,
  //   parameter?: any
  // ) {
  //   let alert = new Alert();

  //   alert.message = message;
  //   alert.headerText = headerText;
  //   alert.iconClass = iconClass;
  //   alert.okCallBackName = callbackMethodName;
  //   alert.cancelCallBackName = cancelCallbackMethodName;
  //   // this.alert.hideCloseButton =
  //   //   hideCloseButton != undefined ? hideCloseButton : hideCloseButton == undefined ? true : false;
  //   alert.isConfirmationAlert = isConfirmationAlert;
  //   alert.parameter = parameter;
  //   alert.id = 'alert_Confirmation_Box_' + Math.floor(Math.random() * (10000000 - 1) + 1);
  //   if (this.settingService.alert == undefined) {
  //     this.settingService.alert = [];
  //   }
  //   this.settingService.alert.push(alert);
  // }

  /**
   * This gets the current alert object
   * @returns the current alert object ID is returned
   */
  // getAlertID(): any {
  //   return this.settingService.alert[
  //     this.settingService.alert.length - 1 > 0 ? this.settingService.alert.length - 1 : 0
  //   ].id;
  // }

  /**
   * This checks if user logged in customer or not.
   * @returns true if usertype is CUSTOMER, default value is false.
   */
  isCustomerPortal(): boolean {
    return this.settingService.isCustomerPortal();
  }

  /**
   * This checks if user logged in customer or not.
   * @returns true if usertype is bank, default value is false.
   */
  isBankPortal(): boolean {
    return this.settingService.isBankPortal();
  }

  /**
   * This returns error count if found. If tab name is present will return for that tab
   * if model is present will return for that model.
   * if both are undefined will return total error count
   * @param tabname expects a string e.g: 'tab_plan'
   * @param model expects the JSON object. e.g RiderList
   * @returns numeric value. default value is 0.
   */
  getErrorCount(model: any, tabname?: string): number {
    let totalCount = 0;
    if (this.responseIO != undefined && this.responseIO['validationerrors'] != undefined)
      if (tabname != undefined) {
        if (
          this.responseIO.validationerrors[tabname] != undefined &&
          this.responseIO.validationerrors[tabname][model.guid] != undefined
        )
          Object.keys(this.responseIO.validationerrors[tabname][model.guid]).forEach((key) => {
            totalCount++;
          });
      } else {
        Object.keys(this.responseIO.validationerrors).forEach((tab) => {
          Object.keys(this.responseIO.validationerrors[tab]).forEach((key) => {
            if (model == undefined || key == model.guid) {
              Object.keys(this.responseIO.validationerrors[tab][key]).forEach((error) => {
                totalCount++;
              });
            }
          });
        });
      }

    return totalCount;
  }

  /**
   * Refresh or reloads the scroll applied.
   * @param classname expects a class name where custom scroll is applied. e.g: '.scrollDiv'
   */
  // loadScroll(classname?: string) {
  //   this.settingService.loadScroll(classname);
  // }

  /**
   * Get Model name list from response IO
   */
  getResponseModelNameList(): any[] {
    let modelNameList = [];

    Object.keys(this.responseIO.data).forEach((key) => {
      //console.log(this.responseIO.data[key])
      let modelNames = {
        ModelName: key,
      };
      modelNameList.push(modelNames);
    });
    return modelNameList;
  }

  getModelNameList(): any[] {
    let modelNameList = [];
    Object.keys(this.responseIO.data).forEach((key) => {
      modelNameList.push(key);
    });
    return modelNameList;
  }

  public trimRequest() {
    // let body = Object.assign({}, this.service.httpReq.body);
    let body = JSON.parse(JSON.stringify(this.httpReq.body));
    Object.keys(body.FormData.Models).forEach((modelName) => {
      if (body.FormData.Models[modelName] != undefined) {
        if (body.FormData.Models[modelName]['status'] == 'N') delete body.FormData.Models[modelName];
        else this.deleteFieldsFromRequest(body.FormData.Models[modelName]);
      } else {
        delete body.FormData.Models[modelName];
      }
    });
    this.httpReq.body = body;
  }

  private deleteFieldsFromRequest(modelObj: any) {
    if (modelObj.constructor === [].constructor) {
      modelObj.forEach((listObj: any, index: number) => {
        if (listObj['status'] == 'N') modelObj.splice(index, 1);
        else this.deleteFieldsFromRequest(listObj);
      });
    } else {
      Object.keys(modelObj).forEach((fieldName: string) => {
        if (modelObj[fieldName] == null) delete modelObj[fieldName];
        else if (fieldName.includes('_fc')) delete modelObj[fieldName];
        else if (fieldName.includes('_dt')) delete modelObj[fieldName];
        else if (fieldName.includes('_mk')) delete modelObj[fieldName];
        else if (modelObj[fieldName].constructor === {}.constructor) {
          this.deleteFieldsFromRequest(modelObj[fieldName]);
        } else if (modelObj[fieldName].constructor === [].constructor) {
          if (this.settingService.getApplicationMode() === 'online' && modelObj[fieldName]['status'] == 'N')
            delete modelObj[fieldName];
          else this.deleteFieldsFromRequest(modelObj[fieldName]);
        } else if (
          (modelObj['id'] == undefined || modelObj['id'] == null) &&
          (fieldName == 'id' || fieldName == 'versionID')
        ) {
          delete modelObj[fieldName];
        } else if (
          this.settingService.getApplicationMode() === 'online' &&
          fieldName != 'guid' &&
          fieldName != 'status' &&
          fieldName != 'id' &&
          fieldName != 'versionID' &&
          this.getLabelValue(modelObj, fieldName) == undefined
        )
          delete modelObj[fieldName];
      });
      if (this.settingService.getApplicationMode() === 'online') {
        //delete modelObj['guid'];
        delete modelObj['status'];
      }
    }
  }

  public async sendRequest(requestDataValue, scrollPosition): Promise<any> {
    //let responseData = null;
    let requestData = JSON.parse(requestDataValue);
    let url = requestData.url;
    let body = requestData.body;
    let method = requestData.method;
    let addtnlHeaders = null;

    if (requestData.header.action != undefined)
      addtnlHeaders = { key: 'action', value: requestData.header.action };

    if (method == 'POST') {
      console.log('sendRequest ', requestData.header.action, body);
      try {
        let response = await this.httpPost(url, body, addtnlHeaders).toPromise();
        return JSON.stringify(response, null, '\t');
      } catch (error) {
        await this.errorApiResponse(error);
      }
      // await this.httpPost(url, body, addtnlHeaders).subscribe(
      //   (body) => {
      //     return JSON.stringify(body, null, '\t');
      //   },
      //   (error) => {
      //     console.log('Error:', error);
      //   }
      // );
    } else if (method == 'PUT') {
      try {
        let response = await this.httpPut(url, body, addtnlHeaders).toPromise();
        return JSON.stringify(response, null, '\t');
      } catch (error) {
        await this.errorApiResponse(error);
      }
    } else if (method == 'GET') {
      try {
        let response = await this.httpGet(url, body, addtnlHeaders).toPromise();
        return JSON.stringify(response, null, '\t');
      } catch (error) {
        await this.errorApiResponse(error);
      }
    }

    //Added to reset response textarea scrollbar to the top when request is resent
    scrollPosition = scrollPosition == 0 ? 1 : 0;
  }

  errorApiResponse(error: any) {
    alert(error.error);
    console.log('Error:', error);
  }

  public fieldValidationAndContextCheck(model: any, fieldCd: string) {
    this.fieldMetadataContextEnabled(model, fieldCd);
    this.callValidation(model, fieldCd);
  }

  protected fieldMetadataContextEnabled(model: any, fieldCd: string) {
    if (this.responseIO == undefined) return;
    // this.clearSubscribe();
    let isMetadataHelpReqd = this.responseIO != undefined ? this.responseIO['isMetadataHelpReqd'] : false;
    let isCallCustomOnChangeFun: boolean = true;

    let fieldMetadata = this.getFieldMetadata(model, fieldCd);
    if (fieldMetadata != undefined && fieldMetadata['ISCTXENABLED']) {
      // alert('is context enabled');
      isCallCustomOnChangeFun = false;
      let respData: any;
      console.log('Calling fetchMetadata for field: ', fieldCd);
      // let modelNameListArray = this.selectedTab.modelList;
      // console.log(item.fieldCd);
      this.fetchMetadata().subscribe(
        (successResponse) => {
          respData = JSON.parse(JSON.stringify(successResponse));
          //console.log('returned from ctx fetchmetadata' + item.fieldCd);

          let responseIO = new ResponseIO();
          responseIO.data = this.responseIO.data;
          responseIO.lookupkeyFOptionList = this.responseIO.lookupkeyFOptionList;

          if (isMetadataHelpReqd != undefined) responseIO['isMetadataHelpReqd'] = isMetadataHelpReqd;
          //responseIO.callOnChange = this.responseIO.callOnChange;
          //assign instead of replace since certain objects metadata is not returned
          //const returnedTarget = Object.assign(target, source);
          responseIO.metadata = Object.assign(this.responseIO.metadata, respData.metadata);
          responseIO.lookups = Object.assign(this.responseIO.lookups, respData.lookups);
          //responseIO.lookups = respData.lookups;
          //responseIO.metadata = respData.metadata;
          responseIO.validationerrors = this.responseIO.validationerrors;
          this.responseIO = responseIO;
          //set the current items metadata as well
          // model.fieldMetadata =
          this.getFieldMetadata(model, fieldCd);
          // this.setNextFieldFocus(item.model, item.fieldCd);
          // setTimeout(() => {
          //   this.setFieldFocus(item.model, item.fieldCd);
          // }, 150);
          //Call custom on change here after the metadata is refreshed.
          // setTimeout(() => {
          //   //it is possible that due to metadata refreshed some fields may now have the valdiate property set . in that case need to call the validate function
          //   // this.callValidation(item);

          //   let item = new FieldItem();
          //   item.fieldCd = fieldCd;
          //   item.model = model;
          //   // this.fieldItemSelected.next(item);
          //   setTimeout(() => {
          //     console.log('clear servuice');
          //     this.clearSubscribe();
          //   }, 100);
          //   // this.callCustomOnChange(item, true);
          // }, 10);

          setTimeout(() => {
            this.setFieldFocusForDisabledScroll();
          }, 150);
        },
        (error) => {
          console.log('Error:', error);
        }
      );
    }
  }

  protected callValidation(model: any, fieldCd: string) {
    if (this.responseIO == undefined) return;

    //item.event is undefined when called from validate function itself.
    //this is to avoid recursive calling of the validate function on change of the functions
    //in some cases need to call recursively like populate ocr data hence setting
    //in new variable callOnChange
    let fieldMetadata = this.getFieldMetadata(model, fieldCd);
    if (
      model != undefined &&
      fieldMetadata != undefined &&
      fieldMetadata.VALIDATEFLD &&
      fieldMetadata.VALIDATEFLD == 'YES'
    ) {
      // if (true && item.event != undefined) {
      let isMetadataHelpReqd = this.responseIO['isMetadataHelpReqd'];
      this.validate().subscribe(
        (successResponse) => {
          let successRespData = JSON.parse(JSON.stringify(successResponse));
          let newResponseIO = new ResponseIO();
          newResponseIO.data = successRespData.data;
          if (isMetadataHelpReqd != undefined) newResponseIO['isMetadataHelpReqd'] = isMetadataHelpReqd;
          //assign instead of replace since certain objects metadata is not returned
          //const returnedTarget = Object.assign(target, source);
          newResponseIO.metadata = successRespData.metadata;
          newResponseIO.lookups = successRespData.lookups;
          //  console.log('error', successRespData.validationerrors);
          //Commented call to mergeValidationerrors since was raising validation errors on tab out itself which is not required
          //if (model != undefined) this.mergeValidationerrors(successRespData, newResponseIO, model.guid, fieldCd);
          this.responseIO = newResponseIO;
          //this.service.refreshLookups(newResponseIO.lookups, this.service.responseIO);
          this.setVisitedTabs(this.currentActiveTab);

          //Call custom on change here after the metadata is refreshed.
          // if (model != undefined) {
          //   setTimeout(() => {
          //     let item = new FieldItem();
          //     item.fieldCd = fieldCd;
          //     item.model = model;
          //     // this.fieldItemSelected.next(item);
          //   }, 10);
          // }
          setTimeout(() => {
            this.setFieldFocusForDisabledScroll();
          }, 5);
        },
        (error) => {
          console.log('Error:', error);
        }
      );
    } else {
      //Call custom on change here after the metadata is refreshed.
      // if (model != undefined) {
      //   setTimeout(() => {
      //     let item = new FieldItem();
      //     item.fieldCd = fieldCd;
      //     item.model = model;
      //     // this.fieldItemSelected.next(item);
      //   }, 10);
      // }
    }
  }

  private mergeValidationerrors(
    successRespData: ResponseIO,
    newResponseIO: ResponseIO,
    modelGuid: string,
    fieldCd: string
  ) {
    //copy existing validation into new response io
    newResponseIO.validationerrors = this.responseIO.validationerrors;
    //first check success response validation contain any current model,current field error
    if (
      successRespData.validationerrors != undefined &&
      successRespData.validationerrors[this.currentActiveTab] != undefined &&
      successRespData.validationerrors[this.currentActiveTab][modelGuid] != undefined &&
      successRespData.validationerrors[this.currentActiveTab][modelGuid][fieldCd] != undefined
    ) {
      //if new response doesn't have validation or current tab validation then add entire validation json body into new response io
      if (
        newResponseIO.validationerrors == undefined ||
        newResponseIO.validationerrors[this.currentActiveTab] == undefined
      ) {
        //newResponseIO.validationerrors = successRespData.validationerrors;
        let validationerrors = {
          [this.currentActiveTab]: {
            [modelGuid]: {
              [fieldCd]: successRespData.validationerrors[this.currentActiveTab][modelGuid][fieldCd],
            },
          },
        };
        //console.log('validationerrors-', validationerrors);
        newResponseIO.validationerrors = validationerrors;
      }
      //if new response doesn't have current model validation then add only model validation json body into new response io
      else if (
        newResponseIO.validationerrors[this.currentActiveTab] != undefined &&
        newResponseIO.validationerrors[this.currentActiveTab][modelGuid] == undefined
      ) {
        let validationerrors = {
          [modelGuid]: {
            [fieldCd]: successRespData.validationerrors[this.currentActiveTab][modelGuid][fieldCd],
          },
        };

        //console.log('validationerrors with currentActiveTab-', validationerrors);
        Object.assign(newResponseIO.validationerrors[this.currentActiveTab], validationerrors);
      }
      //if new response doesn't have current field validation then add only field validation json body into new response io
      else if (
        newResponseIO.validationerrors[this.currentActiveTab][modelGuid] != undefined &&
        newResponseIO.validationerrors[this.currentActiveTab][modelGuid][fieldCd] == undefined
      ) {
        let validationerrors = {
          [fieldCd]: successRespData.validationerrors[this.currentActiveTab][modelGuid][fieldCd],
        };
        //console.log('validationerrors with model guid-', validationerrors);
        Object.assign(newResponseIO.validationerrors[this.currentActiveTab][modelGuid], validationerrors);
      }
      //if new response contain current field validation then add current field validation json body into new response io
      else if (
        newResponseIO.validationerrors[this.currentActiveTab][modelGuid] != undefined &&
        newResponseIO.validationerrors[this.currentActiveTab][modelGuid][fieldCd] != undefined
      ) {
        let validationerrors = [successRespData.validationerrors[this.currentActiveTab][modelGuid][fieldCd]];

        //console.log('validationerrors with fieldCd-', validationerrors);
        newResponseIO.validationerrors[this.currentActiveTab][modelGuid][fieldCd] = validationerrors;
      }
    }
    // if successRespData doesn't contain current field validation then remove validation from
    //newResponseIO
    else if (
      newResponseIO.validationerrors != undefined &&
      newResponseIO.validationerrors[this.currentActiveTab] != undefined &&
      newResponseIO.validationerrors[this.currentActiveTab][modelGuid] != undefined &&
      newResponseIO.validationerrors[this.currentActiveTab][modelGuid][fieldCd] != undefined
    ) {
      delete newResponseIO.validationerrors[this.currentActiveTab][modelGuid][fieldCd];
    }
  }
  /**
   * Sets the visited tabs in the Entity object of the service based on the tab visited
   * @param tabId - optional tabId .. if one needs to set a fixed tabid even if not visited
   */
  private setVisitedTabs(tabId: string): void {
    // let service = this.altService != undefined ? this.altService : this.service;
    let selectedTabId: string;
    // = this.selectedStep.selectedTab == undefined ? '' : this.selectedStep.selectedTab.id;
    if (tabId != undefined) selectedTabId = tabId;
    //check if the visitedTabs already contains the current selected tab id if not then add
    //as comma separated values.

    let visitedTabs: string = '';
    if (this.responseIO.data.Entity.visitedTabs != undefined && this.responseIO.data.Entity.visitedTabs != null)
      visitedTabs = this.responseIO.data.Entity.visitedTabs;
    let visitedTabsArr = visitedTabs.split(',');
    if (!visitedTabsArr.includes(selectedTabId)) {
      visitedTabs = visitedTabs + ',' + selectedTabId;
    }
    this.responseIO.data.Entity.visitedTabs = visitedTabs;
  }

  getStepList(xmlFormat: any) {
    if (xmlFormat === undefined) {
      //  check with maam if we want to add this error
      this.settingService.alertService.error('XML format is not defined');
      return;
    }
    xmlFormat = xmlFormat.toString().replaceAll('&&', '&amp;&amp;');
    let parser = new DOMParser();
    let xml = parser.parseFromString(xmlFormat, 'text/xml');
    let root = <Element>xml.documentElement;
    const errorNode = root.querySelector('parsererror');
    if (errorNode) {
      // parsing failed
      console.error(errorNode);
      console.error(xmlFormat);
      this.settingService.alertService.error('XML configuration error: ' + errorNode['outerText']);
      return;
    }

    let steps = root.getElementsByTagName('step');
    let stepList: StepItem[];
    stepList = [];
    let k: number = 0;

    for (let i = 0; i < steps.length; i++) {
      let stepApplicable: boolean = false;
      let stepSymIfApplicable: boolean = true;
      let isFeatureApplicable: boolean = true;

      if (steps[i].getAttribute('symIf') != undefined) {
        if (this.responseIO != undefined) {
          stepSymIfApplicable = this.isApplicable(
            steps[i].getAttribute('symIf'),
            this.responseIO,
            this['productFacets'],
            this['companyFacets']
          );
        } else {
          stepSymIfApplicable = false;
        }
      }

      if (steps[i].getAttribute('feature') != undefined) {
        isFeatureApplicable = this.checkFeatureIsApplicable(steps[i].getAttribute('feature'));
      }
      if (stepSymIfApplicable && isFeatureApplicable) stepApplicable = true;

      if (stepApplicable) {
        let newStep = new StepItem();
        let step = steps[i];

        newStep.id = step.getAttribute('id');
        newStep.xmlDOM = steps[i];
        newStep.buttonList = [];
        newStep.index = k;
        if (step.getAttribute('buttonList') != undefined) {
          let buttonList: any;
          if (this.responseIO != undefined && step.getAttribute('buttonList').includes('data')) {
            buttonList = this.evaluateExpression(step.getAttribute('buttonList'), this.responseIO);
          } else {
            buttonList = step.getAttribute('buttonList');
          }
          buttonList.split(',').forEach((button) => {
            newStep.buttonList.push(button.trim());
          });
        }
        newStep.tabList = [];
        let tabs = step.getElementsByTagName('tab');
        if (tabs.length == 0) {
          this.settingService.alertService.error('"tab" element is missing!');
        }
        for (let j = 0; j < tabs.length; j++) {
          let tabApplicable: boolean = false;
          let tabSymIfApplicable: boolean = true;
          isFeatureApplicable = true;

          if (tabs[j].getAttribute('symIf') != undefined) {
            if (this.responseIO != undefined) {
              tabSymIfApplicable = this.isApplicable(
                tabs[j].getAttribute('symIf'),
                this.responseIO,
                this['productFacets'],
                this['companyFacets']
              );
            } else {
              tabSymIfApplicable = false;
            }
          }
          if (tabs[j].getAttribute('feature') != undefined) {
            isFeatureApplicable = this.checkFeatureIsApplicable(tabs[j].getAttribute('feature'));
          }
          if (tabSymIfApplicable && isFeatureApplicable) tabApplicable = true;

          let tab = tabs[j];
          let newTab = new TabItem();
          newTab.visible = tabApplicable;
          newTab.xmlIfExpression = tab.getAttribute('symIf');
          newTab.dependentFields = tab.getAttribute('dependentFields');
          newTab.id = tab.getAttribute('id');
          newTab.modelList = [];
          let modelList = tab.getAttribute('modelList');
          modelList.split(',').forEach((model) => {
            newTab.modelList.push(model.trim());
          });
          // console.log(tab);
          // console.log(tab.children);
          newTab.xmlDom = [];
          newTab.xmlDom = tab;
          if (
            step.getAttribute('isRightContentAdded') === 'false' ||
            step.getAttribute('isRightContentAdded') == undefined
          ) {
            newTab.isRightContentAdded =
              tab.getAttribute('isRightContentAdded') === 'true'
                ? true
                : tab.getAttribute('isRightContentAdded') === 'false'
                ? false
                : undefined;
          }
          newStep.tabList.push(newTab);
        }
        newStep.setVisibleTabCount();
        newStep.isRightContentAdded =
          step.getAttribute('isRightContentAdded') === 'true'
            ? true
            : step.getAttribute('isRightContentAdded') === 'false'
            ? false
            : undefined;
        // console.log(steps[i]);
        k++;
        stepList.push(newStep);
      }
    }
    return stepList;
  }

  isApplicable(expression: string, responseIO: ResponseIO, productFacets?: any, companyFacets?: any): boolean {
    return this.evaluateExpression(expression, responseIO, productFacets, companyFacets);
  }
  clone(object: any): any {
    return JSON.parse(JSON.stringify(object));
  }

  /**
   * This is used to call LookupData API to fetch the lookup cd and desc
   *  @param lookupKey this expects Lookup Key
   * @returns
   */
  getLookupList(lookupKey: string): Observable<Object> {
    let body = {
      onlineLookupKey: lookupKey,
    };
    return this.httpPost(`${this.getURLValue('LOOKUP')}/loadLookupData`, body, undefined, false);
  }

  /**
   * This is used to evaluate an expression and return the output for the same
   *  @param expression this expects the expression to be evaluated
   *  @param responseIO this expects the responseIO from which the expression has to be evaluated
   *  @param productFacets this expects the productFacets to evaluate the expression
   *  @param companyFacets this expects the companyFacets to evaluate the expression
   * @returns
   */
  evaluateExpression(
    expression: string | any | number | undefined,
    responseIO: ResponseIO,
    productFacets?: any,
    companyFacets?: any
  ): boolean | any {
    if (expression == undefined || responseIO == undefined) return;
    let exp: any = expression;
    let ret: boolean | any;
    ret = false;
    try {
      let newExp = exp.replaceAll('data.', 'responseIO.data.');
      if (productFacets) {
        newExp = newExp.replaceAll('productFacets.', 'productFacets.data.');
      }
      if (companyFacets) {
        newExp = newExp.replaceAll('companyFacets.', 'companyFacets.data.');
      }

      if (
        newExp.includes('data') ||
        newExp.includes('productFacets.data') ||
        newExp.includes('companyFacets.data')
      ) {
        ret = Function(
          'responseIO',
          'productFacets',
          'companyFacets',
          'return ' + newExp
        )(responseIO, productFacets, companyFacets);
        return ret;
      }
    } catch (e) {
      console.error('Error evaluating expression:', e);
    }
    return ret;
  }

  /**
   * Returns a boolean value by checking that the featureCd exists in the current featureList of the logged in Agent User in sessionStorage
   * @param featureCd
   */
  public checkFeatureIsApplicable(featureCd: string): boolean {
    let isFeatureApplicable = false;
    let userLoginData = JSON.parse(this.settingService.getSessionStorageValue('userLoginData'));
    let agentFeatureList = userLoginData?.agentInfo?.featureList;
    if (agentFeatureList) isFeatureApplicable = agentFeatureList.includes(featureCd);
    return isFeatureApplicable;
  }

  public getPosition(): Promise<any> {
    return new Promise((resolve, reject) => {
      navigator.geolocation.getCurrentPosition(
        (resp) => {
          resolve({ lng: resp.coords.longitude, lat: resp.coords.latitude });
        },
        (err) => {
          reject(err);
          this.settingService.alertService.error(this.getMultilingualLabel('locationMandatory'));
        }
      );
    });
  }

  validateLocationRange(position): boolean {
    let latRange = this.getApplicationPropertyValue('LATITUDEVALUE');
    let longRange = this.getApplicationPropertyValue('LONGITUDEVALUE');
    let withinLat: boolean;
    let withinLong: boolean;
    let latSplit = latRange.split(',');
    for (let i = 0; i < latSplit.length; i++) {
      let latVal = latSplit[i].split('-');
      if (position.lat >= latVal[0] && position.lat <= latVal[latVal.length - 1]) {
        withinLat = true;
        break;
      }
    }

    let longSplit = longRange.split(',');
    for (let i = 0; i < longSplit.length; i++) {
      let longVal = longSplit[i].split('-');
      if (position.lng >= longVal[0] && position.lng <= longVal[longVal.length - 1]) {
        withinLong = true;
        break;
      }
    }

    // console.log(withinLat);
    // console.log(withinLong);

    if (!withinLat && !withinLong) {
      this.settingService.alertService.error(this.getMultilingualLabel('invalidLocation'));
      return false;
    } else {
      console.log('Valid location'); // key needed
      return true;
    }
  }

  public clearModel(model: any): void {
    Object.keys(model).forEach((key: any) => {
      // console.log(key);
      if (key != 'id' && key != 'guid' && key != 'versionID' && key != 'status' && typeof model[key] != 'object') {
        this.setModelFieldValue(model, key, null);
        //set default loopk up value
        let lookupMetadata = this.getFieldMetadataPropertyValue(model, key, 'LOOKUPCD');
        if (lookupMetadata != undefined) {
          this.responseIO.lookups[lookupMetadata].filter((lookupOption) => {
            if (lookupOption?.isDef == '1') this.setModelFieldValue(model, key, lookupOption.cd);
          });
        }
      } else if (model[key] != undefined && typeof model[key] === 'object') {
        //this is required child model of party ie. party address
        this.clearModel(model[key]);
      }
    });
  }

  public getSysDate(format?: string): string {
    const now = new Date();
    try {
      const formattedDate = this.settingService.datepipe.transform(
        now,
        format ? format : SettingService.getSystemDateFormat()
      );
      if (!formattedDate) {
        throw new Error(`Invalid format: ${format}`);
      }
      return formattedDate;
    } catch (error) {
      console.log(`getSysDate error: ${error.message}`);
      return 'Error';
    }
  }

  public getDisclaimerShow(agentID) {
    let body = {
      agentID: agentID,
    };
    if (this.settingService.getApplicationMode() === 'offline') {
      return this.httpGet(`${this.settingService.getURLValue('LOGIN')}/disclaimerShow`);
    } else {
      return this.httpPost(`/api/RSloginSUNPH/disclaimerShow`, body, undefined, false);
    }
  }
  public getSearchListRereshOffline() {
    const body = {};
    return this.httpPost(`${this.settingService.getURLValue('LOGIN')}/syncNotification`, body, undefined, false);
  }
  public getSingleNotification(channel: string, agentId: string) {
    const body = {
      channel: channel,
      agentId: agentId,
    };

    return this.httpPost(
      `${this.settingService.getURLValue('LEAD')}/LoadAgentNotification`,
      body,
      undefined,
      false
    );
  }
}
