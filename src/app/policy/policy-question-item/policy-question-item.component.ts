import {
  Component,
  OnInit,
  Input,
  SimpleChanges,
  OnChanges,
  Output,
  EventEmitter,
  ChangeDetectionStrategy,
} from '@angular/core';
import { BaseComponent } from 'src/app/system-common/base/base.component';
import { SettingService } from 'src/app/system-common/services/setting.service';
import { PolicyService } from '../services/policy.service';
import { DatePipe } from '@angular/common';
import { CustomFormatPipe } from 'src/app/system-common/pipe/custom-format.pipe';
import { PolicyServiceHandler } from '../services/policy.service.handler';

declare const initTooltip: any;

@Component({
  selector: 'sym-policy-question-item',
  templateUrl: './policy-question-item.component.html',
  styleUrls: ['./policy-question-item.component.scss'],
  changeDetection: ChangeDetectionStrategy.Eager,
  standalone: false,
})
export class PolicyQuestionItemComponent extends BaseComponent<PolicyServiceHandler> implements OnChanges {
  @Input() question;
  @Input() partyGuid;
  @Input() questionSetCd;
  @Input() parentReferencePath: String;
  @Input() isUpperCaseReq;
  @Input() displayLabelOnly: boolean | string;
  @Input() displayItemOnly: boolean | string;
  @Input() policyService: PolicyServiceHandler;

  @Output() notifyChange = new EventEmitter<any>();
  @Output() notifyFocus = new EventEmitter<any>();

  public isCustomerPortal: boolean;
  public metadataKeyList: string[];
  public isXMLRendered: boolean;
  isFieldUpperCaseReq: boolean;
  constructor(
    policyService: PolicyService,
    public settingService: SettingService,
    public datepipe: DatePipe,
    private customFormatPipe: CustomFormatPipe
  ) {
    super(policyService);
    this.isCustomerPortal = this.service.isCustomerPortal();
    this.metadataKeyList = [];
    this.isFieldUpperCaseReq = SettingService.getApplicationPropertiesValue('CONVERTTOUPPERCASE') === 'YES';
  }
  ngOnInit() {
    initTooltip();
  }
  ngOnDestroy() {
    this.service.isXMLCodeRendered = true;
  }
  ngOnChanges(changes: SimpleChanges) {
    super.ngOnChanges(changes);
    if (this.policyService != undefined && this.policyService != null) this.service = this.policyService;

    if (changes['question'] && changes['question'].currentValue) {
      this.question.previousValue = this.question?.responseValue;
      //TODO need to add the partyRole
      this.question['fieldUnName'] =
        this.parentReferencePath + '_' + this.questionSetCd + '_' + this.question.dataElementCd;
      if (this.question.dataTypeCd != undefined) {
        this.question['DATATYPE'] = this.question.dataTypeCd;
      }
      let datatype = this.question.DATATYPE;
      if (datatype != undefined && datatype != null) {
        if (
          (datatype == 'DOUBLE' ||
            datatype == 'SHORT' ||
            datatype == 'INT' ||
            datatype == 'NUMBER' ||
            datatype == 'BIGDECIMAL') &&
          this.question.inputTypeCd === 'COMBO'
        ) {
          this.question.inputTypeCd = 'FCOMBO';
        }
      }
      if (
        this.question.inputTypeCd == 'COMBO' ||
        this.question.inputTypeCd == 'FCOMBO' ||
        this.question.inputTypeCd == 'CHECKBOX' ||
        this.question.inputTypeCd == 'LABELCOMBO' ||
        this.question.inputTypeCd == 'SWITCHBUTTON' ||
        this.question.inputTypeCd == 'RADIO' ||
        this.question.inputTypeCd == 'RADIOIMAGE'
      ) {
        this.setDefaultOption();
      }
      //For improving performance in form while XML configuration
      //if (this.selectedStep.selectedTab.xmlDom && this.question.inputTypeCd == 'COMBO') {
      if (this.selectedStep.selectedTab.xmlDom) {
        this.isXMLRendered = true;
        // this.question.inputTypeCd = 'FCOMBO';
      }
      // console.log(this.question);
      if (this.question.inputTypeCd == 'COMBO') {
        this.question.responseValue =
          this.question.responseValue != undefined &&
          this.question.responseValue != 'undefined' &&
          this.question.responseValue != null &&
          this.question.responseValue != 'null' &&
          this.question.responseValue != ''
            ? typeof this.question.responseValue == 'number'
              ? String(this.question.responseValue)
              : this.question.responseValue
            : null;
        // console.log(this.question.responseValue);
      }

      if (this.question.inputTypeCd == 'TEXT' && this.question.MASK != undefined) {
        this.question['responseValue_mk'] = this.customFormatPipe.transform(
          this.question.responseValue,
          this.question
        );
      }

      if (
        this.question.inputTypeCd == 'LOOKUPTEXT' ||
        this.question.inputTypeCd == 'FCOMBO' ||
        this.question.inputTypeCd == 'NCOMBO'
      ) {
        this.question['responseValue_fc'] =
          this.question['responseValue'] != null ? this.question['responseValue'] : null;
        //  this.baseService.setItemOptions(item, this.responseIO.lookups[item.fieldMetadata.LOOKUPCD]);
        let respVal: string[];
        if (
          this.question.inputTypeCd == 'NCOMBO' &&
          this.question.responseValue != undefined &&
          this.question.responseValue != null
        ) {
          respVal = this.question.responseValue.split(',');
        }
        let options = [];
        this.question['responseValue_fc'] = [];
        this.service.responseIO.lookups[this.question.lookupKey].filter((option) => {
          let opt = { value: option.cd, label: option.desc, isDef: option.isDef };
          options.push(opt);

          if (
            this.question['responseValue'] != null &&
            respVal != undefined &&
            respVal != null &&
            respVal.includes(option.cd)
          ) {
            if (this.question.inputTypeCd == 'NCOMBO') {
              this.question['responseValue_fc'].push(opt);
            } else {
              this.question['responseValue_fc'] = opt;
            }
          }
        });
        if (this.service.responseIO.lookupkeyFOptionList == undefined)
          this.service.responseIO.lookupkeyFOptionList = {};
        this.service.responseIO.lookupkeyFOptionList[this.question.lookupKey] = options;

        let value = this.service.responseIO.lookupkeyFOptionList[this.question.lookupKey].find(
          (opt: any) =>
            opt.value == this.question['responseValue'] ||
            (this.question['responseValue_fc'] != undefined && respVal?.includes(opt.value))
        );
        if (this.question.inputTypeCd != 'NCOMBO') {
          if (value == undefined) {
            this.question['responseValue_fc'] = undefined;
            this.question['responseValue'] = undefined;
          } else {
            this.question['responseValue_fc'] = value;
          }
        }
      }
      if (this.question['isXMLCodeRendered'] || this.service.isXMLCodeRendered) {
        this.question['className'] = 'col-sm-12 col-md-12 col-xl-12';
      }
      if (this.question['COLSWIDTH'] != undefined) {
        this.question['className'] = this.getColClass(this.question['COLSWIDTH']);
      }
      if (this.question.inputTypeCd == 'SWITCHBUTTON') {
        this.question['responseValue'] =
          this.question['responseValue'] != undefined && this.question['responseValue'] != null
            ? this.question['responseValue']
            : 'NO';
      }

      let visitedTabs: string = '';
      if (
        this.service.responseIO.data.Entity != undefined &&
        this.service.responseIO.data.Entity.visitedTabs != undefined &&
        this.service.responseIO.data.Entity.visitedTabs != null
      )
        visitedTabs = this.service.responseIO.data.Entity.visitedTabs;
      let visitedTabsArr = visitedTabs.split(',');

      for (let tabname in this.service.responseIO.validationerrors) {
        //display only those errors if the tab is visited
        if (!visitedTabsArr.includes(tabname)) {
          continue;
        }
        if (
          this.service.responseIO.validationerrors[tabname] != undefined &&
          this.service.responseIO.validationerrors[tabname][this.question.guid] != undefined
        ) {
          this.question['error'] =
            this.service.responseIO.validationerrors[tabname][this.question.guid].responseValue;
          this.question['error'] = this.question['error'].replaceAll(
            this.settingService.getSymErrorSeperator(),
            ' & '
          );
        }
      }
      // for (let tabname in this.service.responseIO.validationerrors) {
      //   if (
      //     this.service.responseIO.validationerrors[tabname] != undefined &&
      //     this.service.responseIO.validationerrors[tabname][this.question.guid] != undefined
      //   ) {
      //     this.question['error'] =
      //       this.service.responseIO.validationerrors[tabname][this.question.guid].responseValue;
      //   }
      // }
      // console.log(this.question);
      if (this.service.responseIO['isMetadataHelpReqd'] === true) {
        if (this.metadataKeyList == undefined || this.metadataKeyList.length == 0) {
          Object.keys(this.question).forEach((key) => {
            if (
              key != 'responseValue' &&
              key != 'guid' &&
              key != 'metadataKeyList' &&
              key != 'questionText' &&
              key != 'questionLabelKey'
            )
              // console.log(key);
              this.metadataKeyList.push(key);
          });
        } else {
          Object.keys(this.question).forEach((key) => {
            if (
              key != 'responseValue' &&
              key != 'guid' &&
              key != 'metadataKeyList' &&
              key != 'questionText' &&
              key != 'questionLabelKey' &&
              this.metadataKeyList[key] == undefined
            )
              // console.log(key);
              this.metadataKeyList.push(key);
          });
        }
      }
      // console.log(this.question);
    }
    if (changes['isUpperCaseReq'] && changes['isUpperCaseReq'].currentValue) {
      if (this.question.dataTypeCd == 'STRING' && this.isUpperCaseReq) {
        this.question['CASEVALUE'] = 'UPPER';
        this.question['responseValue'] = this.customFormatPipe.transform(
          this.question.responseValue,
          this.question
        );
      }
    }
    setTimeout(() => {
      initTooltip();
    }, 5);
  }

  private setDefaultOption() {
    if (
      this.question.lookupKey != undefined &&
      this.service.responseIO.lookups[this.question.lookupKey] != undefined
    )
      for (let i = 0; i < this.service.responseIO.lookups[this.question.lookupKey].length; i++) {
        if (
          (this.question.responseValue == undefined || this.question.responseValue == '') &&
          this.service.responseIO.lookups[this.question.lookupKey][i].isDef &&
          this.service.responseIO.lookups[this.question.lookupKey][i].isDef == 1
        ) {
          this.question.responseValue = this.service.responseIO.lookups[this.question.lookupKey][i].cd;
          break;
        }
      }
  }

  public numberOnly(event, question?): boolean {
    //let key = event.keyCode || event.which;
    let key = event.key;
    let allowKeys = ['Backspace', 'Delete', 'ArrowLeft', 'ArrowRight', 'Tab', 'Enter', 'Alt', 'Control', ' '];
    const inputElement = event.target as HTMLInputElement;
    let type = question?.DATATYPE;
    /**This done to check the copied value is proper or not for masked field. If it is then paste it else not */
    if (question.MASK != undefined && event instanceof ClipboardEvent) {
      let pastedValue = event.clipboardData?.getData('text');
      let unmaskedValue = typeof pastedValue == 'number' ? pastedValue : pastedValue.replace(/[^\d.-]/g, '');
      if (
        typeof unmaskedValue === 'number' ||
        (!isNaN(parseFloat(unmaskedValue)) && isFinite(parseInt(unmaskedValue)))
      ) {
        let maskedValue = this.customFormatPipe.transform(unmaskedValue, question);
        if (pastedValue == maskedValue) return true;
        else if (pastedValue != maskedValue) {
          const inputElement = event.target as HTMLInputElement;
          inputElement.value = '';
        }
      }
    }
    if (type != undefined && type != null) {
      //  const charCode = event.which ? event.which : event.keyCode;
      // key = String.fromCharCode(key);
      let allowDecimal: boolean = type == 'SHORT' || type == 'INT' ? false : true;
      if (this.question.MASK != undefined && this.question.MASK.endsWith('.0-0')) allowDecimal = false;
      if (
        allowKeys.includes(event.key) ||
        (event.ctrlKey && ['c', 'v', 'x', 'a'].includes(event.key.toLowerCase()))
      )
        return;
      if (type == 'DOUBLE') {
        if (!/^[0-9]$/.test(key) && (allowDecimal ? key != '.' : true)) {
          /*It replaces all the alphabets irrespective of any language*/
          if (inputElement != undefined) {
            const unCleanPattern = allowDecimal ? /[^\d.]/g : /[^\d]/g;
            if (question.MASK != undefined) {
              let maskedValue = this.customFormatPipe.transform(inputElement.value, question);
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
          question['responseValue'] = inputElement?.value;
          if (question['responseValue_mk']) question['responseValue_mk'] = inputElement?.value;
          event.returnValue = false;
          if (event.preventDefault) event.preventDefault();
          return false;
        }
        return true;
      } else if (type == 'INTEGER' || type == 'SHORT') {
        if (!/^[0-9]\d*$/.test(key)) {
          /*It replaces all the alphabets irrespective of any language*/
          if (inputElement != undefined) inputElement.value = inputElement.value.replace(/[^\d]/g, '');
          question['responseValue'] = inputElement.value;
          if (question['responseValue_mk']) question['responseValue_mk'] = inputElement.value;
          event.returnValue = false;
          if (event.preventDefault) event.preventDefault();
          return false;
        }
      }
    } else if (type == undefined || type == null) {
      return true;
    } else {
      const charCode = event.which ? event.which : event.keyCode;
      if (isNaN(key)) {
        return false;
      }
      return true;
    }
  }
  /**
   *
   * @param item a particular field item which is update
   * @param event current event
   * triggered when a value is updated on field item.
   * it updates the data in responseIO.data for respective model.
   */
  public onInputChange(event, opt?) {
    this.service.setFormDirty(true);
    if (SettingService.getApplicationPropertiesValue('VALIDATEDATAFORMATONUI') != 'NO') {
      if (event != undefined && event.target != undefined) {
        let isClearRequired = true;
        if (event.target.validity != undefined && event.target.validity.patternMismatch) {
          let formatTxt =
            this.question['FORMATTEXT'] != undefined
              ? this.question['FORMATTEXT']
              : event.target.pattern != null
              ? event.target.pattern
              : null;
          let msg = this.service.getMultilingualMessage('ERR_FORMAT', [
            this.question['questionLabelKey'],
            formatTxt,
          ]);
          event.target.setCustomValidity(msg);
        }
        // Blacklist character validation-starts
        if (this.question['BLACKLISTCHARS'] != undefined) {
          const blacklistArray = this.question['BLACKLISTCHARS'].split(',').map((char) => char.trim());
          let blackListCharFound;

          for (let blackListChar of blacklistArray) {
            if (this.question['responseValue'] != null && this.question['responseValue'] != undefined) {
              if (this.question['responseValue'].includes(blackListChar)) {
                blackListCharFound = blackListChar;
                break;
              }
            }
          }
          if (blackListCharFound != undefined) {
            let msg = this.service.getMultilingualMessage('ERR_BLACKLISTCHAR', [
              this.question['questionLabelKey'],
              blackListCharFound,
              this.question['BLACKLISTCHARS'],
            ]);
            event.target.setCustomValidity(msg);
          }
        }
        // Blacklist character validation-ends

        if (
          (event?.target?.type === 'text' || event?.target?.type === 'number') &&
          (this.question.inputTypeCd == 'TEXT' ||
            this.question.inputTypeCd == 'NUMBER' ||
            this.question.inputTypeCd == undefined)
        ) {
          let enteredValue =
            this.question['responseValue'] != undefined ? this.question['responseValue'] : undefined;

          if (enteredValue != undefined) {
            let maxValue = this.question['maxValue'] != undefined ? Number(this.question['maxValue']) : undefined;
            if (maxValue != undefined && enteredValue > maxValue) {
              let msg = this.service.getMultilingualMessage('ERR_MAXVALUE', [
                this.question['questionLabelKey'],
                maxValue,
                enteredValue,
              ]);
              event.target.setCustomValidity(msg);
            } else {
              let maxValueWarn =
                this.question['MAXVALUEWARN'] != undefined ? Number(this.question['MAXVALUEWARN']) : undefined;
              if (maxValueWarn != undefined && enteredValue > maxValueWarn) {
                isClearRequired = false;
                let msg = this.service.getMultilingualMessage('ERR_MAXVALUEWARN', [
                  this.question['questionLabelKey'],
                  maxValueWarn,
                  enteredValue,
                  maxValue,
                ]);
                event.target.setCustomValidity(msg);
              }
            }
            let minValue = this.question['minValue'] != undefined ? Number(this.question['minValue']) : undefined;
            if (minValue != undefined && enteredValue < minValue) {
              let msg = this.service.getMultilingualMessage('ERR_MINVALUE', [
                this.question['questionLabelKey'],
                minValue,
                enteredValue,
              ]);
              event.target.setCustomValidity(msg);
            } else {
              let minValueWarn =
                this.question['MINVALUEWARN'] != undefined ? Number(this.question['MINVALUEWARN']) : undefined;

              if (minValueWarn != undefined && enteredValue < minValueWarn) {
                isClearRequired = false;
                let msg = this.service.getMultilingualMessage('ERR_MINVALUEWARN', [
                  this.question['questionLabelKey'],
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
          if (!event.target.reportValidity()) {
            //if invalid then clear the value after showing the validity error
            //added timeout since the validity error would disappear
            this.setTimeoutPromise(() => {
              if (isClearRequired) {
                this.question['responseValue'] = undefined;
                this.question['responseValue_mk'] = undefined;
              }
              event.target.setCustomValidity('');
            }, 5000);
            return;
          }
        }
      }
    }

    if (this.question['inputTypeCd'] === 'CHECKBOX') {
      if (event['target']['checked'] == true && this.question['lookupKey'] == 'BOOLEAN') {
        this.question['responseValue'] = event['target']['checked'] == true ? 'YES' : null;
      } else {
        this.question['responseValue'] = event['target']['checked'] == true ? opt.cd : null;
      }
    }
    if (
      this.question.inputTypeCd == 'TEXT' &&
      this.question.MASK != undefined &&
      (this.question.dataTypeCd == 'DOUBLE' ||
        this.question.dataTypeCd == 'BIGDECIMAL' ||
        this.question.dataTypeCd == 'SHORT')
    ) {
      this.question['responseValue_mk'] = this.customFormatPipe.transform(
        this.question['responseValue_mk'],
        this.question
      );
      this.question['responseValue'] =
        this.question['responseValue_mk'] != undefined
          ? this.question['responseValue_mk'].toString().replace(/[^\d.-]/g, '')
          : this.question['responseValue'];
    }

    if (
      this.question.inputTypeCd == 'LOOKUPTEXT' ||
      this.question.inputTypeCd == 'FCOMBO' ||
      this.question.inputTypeCd == 'NCOMBO'
    ) {
      if (this.question.inputTypeCd == 'NCOMBO') {
        let values: string = '';
        for (let foption in this.question['responseValue_fc']) {
          values += this.question['responseValue_fc'][foption].value + ',';
        }
        this.question['responseValue'] =
          values != undefined && values != '' ? values.substring(0, values.lastIndexOf(',')) : undefined;
      } else {
        this.question['responseValue'] =
          this.question['responseValue_fc'] != null && this.question['responseValue_fc'].value == undefined
            ? this.question['responseValue_fc']
            : this.question['responseValue_fc'] != null &&
              (this.question['responseValue_fc'].value != null ||
                this.question['responseValue_fc'].value != 'null')
            ? this.question['responseValue_fc'].value
            : null;
      }
    }
    if (this.question.inputTypeCd == 'SWITCHBUTTON') {
      this.question['responseValue'] =
        this.question['responseValue'] != undefined && this.question['responseValue'] != null
          ? this.question['responseValue']
          : 'NO';
    }

    if (this.question.dataTypeCd == 'STRING' && this.isUpperCaseReq) {
      this.question['CASEVALUE'] = 'UPPER';
      this.question['responseValue'] = this.customFormatPipe.transform(this.question.responseValue, this.question);
    }
    if (
      this.isFieldUpperCaseReq &&
      (this.question.inputTypeCd == undefined ||
        this.question.inputTypeCd == 'TEXT' ||
        this.question.inputTypeCd == 'TEXTAREA')
    )
      this.question['responseValue'] = this.question['responseValue'].toUpperCase();
    if (this.question.inputTypeCd == 'COMBO')
      this.question.responseValue =
        this.question.responseValue == null || this.question.responseValue == 'null'
          ? null
          : this.question.responseValue;
    if (this.question.isReflexiveFl) {
      let partyQuestionSetQuestion = {
        event: event,
        partyGuid: this.partyGuid,
        questionSetCd: this.questionSetCd,
        parentReferencePath: this.parentReferencePath,
        question: this.question,
      };
      this.notifyChange.emit(partyQuestionSetQuestion);
    }
  }

  /**
   * @ignore
   */
  public unMaskValue(question: any, event: any) {
    question['responseValue_mk'] = event;
    if (
      question.inputTypeCd == 'TEXT' &&
      question.MASK != undefined &&
      (question.dataTypeCd == 'DOUBLE' || question.dataTypeCd == 'BIGDECIMAL' || question.dataTypeCd == 'SHORT')
    ) {
      question.responseValue = event.replace(/[^\d.-]/g, '');
    }
  }
  /**
   * @ignore
   */
  private getColClass(totalLength: number): string {
    let maxCols: number;
    let width: number;
    if (totalLength > 4) {
      maxCols = 4;
    } else {
      maxCols = totalLength;
    }
    width = 12 / maxCols;
    return 'col-sm-' + width + ' col-md-' + width + ' col-xl-' + width;
  }

  /**
   *
   * @param event current event
   * triggered when a value is updated in question.
   */
  public onInputFocus(event) {
    this.notifyFocus.emit(this.question);
  }
}
