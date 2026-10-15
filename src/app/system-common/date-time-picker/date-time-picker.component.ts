import { DatePipe } from '@angular/common';
import {
  Component,
  ElementRef,
  EventEmitter,
  Input,
  Output,
  SimpleChanges,
  ViewChild,
  ChangeDetectionStrategy,
} from '@angular/core';
import { FieldItem } from 'src/app/models/common/field-item';
import { SettingService } from 'src/app/system-common/services/setting.service';
import { BaseService } from '../services/base.service';

import '@ui5/webcomponents/dist/DatePicker.js';
import '@ui5/webcomponents/dist/DateTimePicker.js';
import '@ui5/webcomponents-localization/dist/features/calendar/Buddhist.js';
import '@ui5/webcomponents-localization/dist/features/calendar/Islamic.js';
import '@ui5/webcomponents-localization/dist/features/calendar/Japanese.js';
import '@ui5/webcomponents-localization/dist/features/calendar/Persian.js';
import { setLanguage } from '@ui5/webcomponents-base/dist/config/Language.js';
import '@ui5/webcomponents/dist/Assets.js';
// import { setLanguage } from '@ui5/webcomponents-base/dist/config/Language.js';

function getSystemDateFormat() {
  return SettingService.getSystemDateFormat();
}

function getSystemTimeFormat() {
  return SettingService.getSystemTimeFormat();
}

@Component({
  selector: 'sym-date-time-picker',
  templateUrl: './date-time-picker.component.html',
  styleUrls: ['./date-time-picker.component.css'],
  changeDetection: ChangeDetectionStrategy.Eager,
  standalone: false,
})
export class DateTimePickerComponent {
  @ViewChild('datePicker', { static: false }) datePicker!: ElementRef;
  @ViewChild('datePicker') datePickerRef!: ElementRef;
  @ViewChild('dateTimePicker') dateTimePickerRef!: ElementRef;
  /**
   * this is used to set ID attribute for the datepicker. e.g: '17ee4a492cbe1cb466abe27b0001e568_dob' i.e: field.guid + '_' + field.fieldCd.
   */
  @Input() fieldID: string;

  /**
   * field code for date / date-time picker. e.g: 'dob'
   */
  @Input() fieldCd: string;

  /**
   * model from where the details need to be displayed. e.g: responseIO.data.Proposer
   *
   */
  @Input() model: any;

  @Input() fieldUnName: string;

  /**
   * if the field is disabled. Default value is false.
   */
  @Input() isDisabled: boolean;

  /**
   * minimum date value to be set to the date / date-time picker.
   */
  @Input() min: any;

  /**
   * maximum date value to be set to the date / date-time picker.
   */
  @Input() max: any;

  /**
   * Text to be displayed in the placeholder of  date / date-time picker.
   */
  @Input() placeholder: string;

  /**
   * it determine if it is date / date-time picker.
   */
  @Input() fieldType: string;

  /**
   * Displayed calendar format. Default is 'Gregorian'
   * other values can be 'Japanese','Islamic','Buddhist','Persian'
   */
  @Input() calendarType: string;

  /**
   * This consists of the entire FieldItem model for a particualr field
   */
  @Input() fieldItem: FieldItem;

  /**
   * When the value is changed this emitter is emitted from the given model.
   */
  @Output() notifyChange = new EventEmitter<any>();

  /**
   * @ignore
   */
  public symDateFormat: string;
  /**
   * @ignore
   */
  public symTimeFormat: string;
  /**
   * @ignore
   */
  public minDateValue: string;
  /**
   * @ignore
   */
  public maxDateValue: string;

  displayUI: boolean;
  constructor(public settingService: SettingService, public baseService: BaseService, public datepipe: DatePipe) {
    this.symDateFormat = getSystemDateFormat();
    this.symTimeFormat = getSystemTimeFormat();
    let language: string;
    /**
     * Added for v16 date time picker
     */
    language = SettingService.applicationProperties['CALENDARLANG'];
    if (language != undefined && language != 'en') {
      setLanguage(language);
      // Removed in v17. Testing is pending for all calendar types
      // if (this.settingService.getSessionStorageValue('firstReloadURL') === 'false') {
      //   this.settingService.setSessionStorageValue('firstReloadURL', true);
      //   window.location.reload();
      // }
    }
  }

  ngOnInit() {}
  ngOnChanges(changes: SimpleChanges): void {
    //Called before any other lifecycle hook. Use it to inject dependencies, but avoid any serious work here.
    //Add '${implements OnChanges}' to the class.

    if (changes['min'] && changes['min'].currentValue) {
      this.minDateValue =
        this.fieldType == 'DATE'
          ? this.formatDate(this.baseService.getDate(this.min))
          : this.fieldType == 'DATETIME'
          ? this.formatDate(this.baseService.getDate(this.min), this.symDateFormat + ' ' + this.symTimeFormat)
          : null;
    }
    if (changes['max'] && changes['max'].currentValue) {
      this.maxDateValue =
        this.fieldType == 'DATE'
          ? this.formatDate(this.baseService.getDate(this.max))
          : this.fieldType == 'DATETIME'
          ? this.formatDate(this.baseService.getDate(this.max), this.symDateFormat + ' ' + this.symTimeFormat)
          : null;
    }
    if (changes['model'] && changes['model'].currentValue) {
      this.model[this.fieldCd + '_dt'] =
        this.model[this.fieldCd] != null
          ? this.fieldType == 'DATE'
            ? this.formatDate(this.baseService.getDate(this.model[this.fieldCd]))
            : this.fieldType == 'DATETIME'
            ? this.formatDate(
                this.baseService.getDateTime(this.model[this.fieldCd]),
                this.symDateFormat + ' ' + this.symTimeFormat
              )
            : null
          : null;
      // console.log(this.model);
      /**commented for committing v16 */
      // this.calendarType = 'Buddhist';
      this.calendarType != undefined
        ? this.calendarType
        : SettingService.getApplicationPropertiesValue('CALENDARTYPE') != undefined
        ? SettingService.getApplicationPropertiesValue('CALENDARTYPE')
        : 'Gregorian';
      // console.log(this.calendarType);
      // console.log(SettingService.getApplicationPropertiesValue('CALENDARTYPE'));
    }
    if (changes['calendarType'] && changes['calendarType'].currentValue) {
      this.calendarType =
        this.calendarType != undefined
          ? this.calendarType
          : SettingService.getApplicationPropertiesValue('CALENDARTYPE') != undefined
          ? SettingService.getApplicationPropertiesValue('CALENDARTYPE')
          : 'Gregorian';
      // console.log(this.calendarType);
      // console.log(SettingService.getApplicationPropertiesValue('CALENDARTYPE'));
    }

    if (changes['fieldItem'] && changes['fieldItem'].currentValue) {
      this.setDateRange();
    }
  }

  private formatDate(value: Date | string | number, format?: string) {
    return this.datepipe.transform(value, format != undefined ? format : this.symDateFormat);
  }

  private setDateRange() {
    const today = new Date();
    // Set minDateValue if MINVALUE is not already set
    if (this.min == undefined) {
      if (this.fieldItem.fieldMetadata.GREATER) {
        const greaterDate = new Date(
          this.fieldItem.fieldMetadata.GREATER === 'TODAY' ? today : this.fieldItem.fieldMetadata.GREATER
        );
        greaterDate.setDate(greaterDate.getDate() + 1); // Add 1 day
        this.minDateValue = this.formatDate(greaterDate);
      } else if (this.fieldItem.fieldMetadata.GREATEREQUALS) {
        const greaterDate = new Date(
          this.fieldItem.fieldMetadata.GREATEREQUALS === 'TODAY'
            ? today
            : this.fieldItem.fieldMetadata.GREATEREQUALS
        );
        this.minDateValue = this.formatDate(greaterDate);
      }
    }

    // Set maxDateValue if MAXVALUE is not already set
    if (this.max == undefined) {
      if (this.fieldItem.fieldMetadata.LESSER) {
        const lesserDate = new Date(
          this.fieldItem.fieldMetadata.LESSER === 'TODAY' ? today : this.fieldItem.fieldMetadata.LESSER
        );
        lesserDate.setDate(lesserDate.getDate() - 1); // Subtract 1 day
        this.maxDateValue = this.formatDate(lesserDate);
      } else if (this.fieldItem.fieldMetadata.LESSEREQUALS) {
        const lesserDate = new Date(
          this.fieldItem.fieldMetadata.LESSEREQUALS === 'TODAY' ? today : this.fieldItem.fieldMetadata.LESSEREQUALS
        );
        this.maxDateValue = this.formatDate(lesserDate);
      }
    }
  }

  /**
   *
   * @param item a particular field item which is update
   * @param event current event
   * triggered when a value is updated on field item.
   * it updates the data in responseIO.data for respective model.
   */
  public onInputChange(model: any, event: any) {
    if (
      (event.currentTarget === null && event.currentTarget === undefined) ||
      (event.detail === 0 && (!event.detail.valid || event.detail.valid === undefined))
    ) {
      return;
    }
    if (!event.detail.valid) {
      event.detail.value = null;
      event.currentTarget.liveValue = null;
      this.model[this.fieldCd + '_dt'] = undefined;
      this.model[this.fieldCd] = null;
      this.notifyChange.emit(this.model);
      return;
    }
    if (event.currentTarget.liveValue == '' && event.detail == 0 && !event.detail.valid) {
      this.model[this.fieldCd + '_dt'] = undefined;
      if (event.detail != 0) event.detail.value = undefined;
      setTimeout(() => {
        this.model[this.fieldCd + '_dt'] = undefined;
        if (event.detail != 0) event.detail.value = undefined;
        return;
      }, 100);
    } else {
      // console.log(event);
      this.model[this.fieldCd + '_dt'] =
        event.currentTarget.liveValue != '' && event.detail == 0
          ? event.currentTarget.liveValue
          : event.detail.value;
      if (
        this.min != undefined &&
        this.minDateValue != undefined &&
        new Date(this.model[this.fieldCd + '_dt']) < this.baseService.getDate(this.minDateValue)
      ) {
        this.model[this.fieldCd + '_dt'] = this.formatDate(this.baseService.getDate(this.minDateValue));
      }
      if (
        this.maxDateValue != undefined &&
        this.maxDateValue != undefined &&
        this.model[this.fieldCd + '_dt'] > this.baseService.getDate(this.maxDateValue)
      ) {
        this.model[this.fieldCd + '_dt'] = this.formatDate(this.baseService.getDate(this.maxDateValue));
      }
    }
    this.model[this.fieldCd] =
      this.model[this.fieldCd + '_dt'] != '' && this.model[this.fieldCd + '_dt'] != null
        ? this.fieldType == 'DATE'
          ? this.baseService.getUtcDateTime(this.model[this.fieldCd + '_dt'])
          : this.fieldType == 'DATETIME'
          ? this.baseService.getDateTime(this.model[this.fieldCd + '_dt']).getTime()
          : this.model[this.fieldCd + '_dt']
        : this.model[this.fieldCd + '_dt'];
    console.log(this.model[this.fieldCd]);
    this.notifyChange.emit(this.model);
  }

  ngAfterViewInit(): void {
    const datePicker = this.datePickerRef?.nativeElement;
    const dateTimePicker = this.dateTimePickerRef?.nativeElement;

    const fieldName = this.fieldItem?.fieldUnName ?? this.fieldUnName ?? '';

    const findInput = (root: ShadowRoot | HTMLElement): HTMLInputElement | null => {
      // Check for input directly under current root
      const input = root.querySelector('input');

      if (input) {
        return input as HTMLInputElement;
      }

      // Search nested Shadow DOMs
      const elements = root.querySelectorAll('*');

      for (const element of Array.from(elements) as HTMLElement[]) {
        if (element.shadowRoot) {
          const nestedInput = findInput(element.shadowRoot);

          if (nestedInput) {
            return nestedInput;
          }
        }
      }

      return null;
    };

    const setInputName = (picker: HTMLElement | undefined): void => {
      if (!picker) {
        return;
      }

      const shadowRoot = picker.shadowRoot;

      if (!shadowRoot) {
        requestAnimationFrame(() => setInputName(picker));
        return;
      }

      const input = findInput(shadowRoot);

      if (input) {
        input.setAttribute('name', fieldName);

        console.log('Name assigned:', fieldName, input);

        return;
      }

      // UI5 may render the internal input slightly later
      requestAnimationFrame(() => setInputName(picker));
    };

    setTimeout(() => {
      // DATE PICKER
      const shadowRoot = datePicker?.shadowRoot;
      const uiinput = shadowRoot?.querySelector('ui5-input');

      if (uiinput) {
        uiinput.style.setProperty('--_ui5-input-border', '1px solid #e4e9f2');

        uiinput.style.setProperty('--_ui5_input_focus_outline_color', 'none');

        uiinput.style.minWidth = '100%';

        const input = findInput(shadowRoot!);

        if (input) {
          input.setAttribute('name', fieldName);
        }
      }

      // DATETIME PICKER
      if (dateTimePicker) {
        const dateTimeShadowRoot = dateTimePicker.shadowRoot;

        const dateTimeInput = dateTimeShadowRoot?.querySelector('ui5-input');

        if (dateTimeInput) {
          dateTimeInput.style.fontSize = '0.85rem';
        }

        setInputName(dateTimePicker);
      }

      // CUSTOMER PORTAL STYLING
      if (this.settingService.isCustomerPortal()) {
        if (uiinput && datePicker) {
          uiinput.style.background = 'var(--fg-field)';
          uiinput.style.fontSize = '0.95rem';
          uiinput.style.fontWeight = 'normal';
          uiinput.style.color = 'var(--fg-ink)';
          uiinput.style.boxShadow = 'none';
          uiinput.style.borderRadius = 'var(--fg-radius)';
          uiinput.style.minHeight = '35px';

          datePicker.style.setProperty('padding', '0', 'important');

          datePicker.style.setProperty('margin', '0', 'important');
        }
      }
    }, 1);
  }
}
