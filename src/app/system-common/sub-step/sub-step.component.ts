import {
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
  SimpleChanges,
  ChangeDetectionStrategy,
} from '@angular/core';
import { StepItem } from 'src/app/models/common/step-item';
import { SettingService } from '../services/setting.service';
import { PageContainerComponent } from '../page-container/page-container.component';
import { ResponseIO } from 'src/app/models/responseIO';
import { TabItem } from 'src/app/models/common/tab-items';
import { BaseService } from '../services/base.service';

declare const openModal: any;
declare const closeModal: any;
declare const scrollToTop: any;

@Component({
  selector: 'sym-sub-step',
  templateUrl: './sub-step.component.html',
  styleUrls: ['../tab-container/tab-container.component.scss', './sub-step.component.scss'],
  changeDetection: ChangeDetectionStrategy.Eager,
  standalone: false,
})
export class SubStepComponent implements OnInit {
  /**
   * Indiviaual step JSON object is expected
   * e.g: your details
   */
  @Input() subStepList: StepItem[];

  /**
   * This input is to separate the '&' in error pop-up
   */
  @Input() breakErrorListInPopUp: boolean;

  /**
   * It is of type ResposeIO.
   *
   * It contains the value to be displayed inside the table.
   * @ResponseIO contains JSON Object of { data; metadata; lookups; validationerrors; }
   */
  @Input() responseIO: ResponseIO;

  /**
   * It expects current selected step item
   */
  @Input() selectedStep: StepItem;

  /**
   * It expects boolean value to set vertical align. By default it is false.
   */
  @Input() verticalAlignment: boolean;

  /**
   * It expects the current service
   */
  @Input() service: BaseService;

  /**
   * It expects sub step is readonly or not
   */
  @Input() isSubStepReadOnly: boolean;

  /**
   * This is triggered when next/previous step is selected.
   * @StepItem It emitts selected step with Json Object of StepItem.
   */
  @Output() selectedSubStep = new EventEmitter<StepItem>();

  /**
   * @ignore
   */
  public currStepItem: StepItem;
  public pageContainerErrorList: any;
  public currentSubStepSelected: StepItem;

  public errorOccuredAtStep: StepItem;
  // previousTab: TabItem;
  // nextTab: TabItem;

  /**
   * @ignore
   */
  isPreviousRequired: boolean;
  /**
   * @ignore
   */
  isNextRequired: boolean;

  constructor(public settingService: SettingService) {
    // super(settingService);
    this.isPreviousRequired = false;
    this.isNextRequired = false;
  }

  ngOnInit() {
    let index = 0;
    for (let i = 0; i < this.subStepList.length; i++) {
      if (this.subStepList[i].isSelected) {
        index = i;
        break;
      }
    }

    for (let i = 0; i < index; i++) {
      this.subStepList[i].status = 'completed';
    }
    this.currentSubStepSelected = this.subStepList[index];
    this.selectedSubStep.emit(this.currentSubStepSelected);
    this.setStepStatus();
    /*If it is previous sub step then dont want show error of the next step
       Show error of the current sub step*/
    if (this.responseIO.data['previousSubStepClicked']) this.errorOccuredAtStep = undefined;
    else if (
      this.responseIO.validationerrors[this.selectedStep.selectedTab.id] != undefined &&
      this.errorOccuredAtStep == undefined
    ) {
      this.errorOccuredAtStep = this.currentSubStepSelected;
    }
  }

  ngOnChanges(changes: SimpleChanges) {
    if (
      (changes['responseIO'] && changes['responseIO'].currentValue) ||
      (changes['selectedStep'] && changes['selectedStep'].currentValue)
    ) {
      /*If it is previous sub step then dont want show error of the next step
       Show error of the current sub step*/
      if (this.responseIO.data['previousSubStepClicked']) this.errorOccuredAtStep = undefined;
      else if (
        this.responseIO.validationerrors != undefined &&
        this.service.responseIO.validationerrors[this.selectedStep.selectedTab.id] != undefined &&
        this.errorOccuredAtStep == undefined
      ) {
        this.errorOccuredAtStep = this.currentSubStepSelected;
        /* Display errors on both main-step and sub-step during save */
        this.setValidationError(undefined, this.selectedStep, undefined);
        this.showErrorToast();
      } else if (
        this.service.responseIO.validationerrors &&
        this.service.responseIO.validationerrors[this.selectedStep.selectedTab.id] == undefined &&
        this.errorOccuredAtStep != undefined
      ) {
        /* If no errors exist, clear sub-step errors*/
        this.selectedStep.selectedTab.errorCount = 0;
      }
    }
  }

  onSubStepClick(stepItem: StepItem) {
    if (
      stepItem.status === 'completed' ||
      stepItem.status == 'active' ||
      stepItem.status == 'pending' ||
      stepItem.errorCount > 0 ||
      stepItem.status == 'error'
    ) {
      this.selectedSubStep.emit(stepItem);
      this.currentSubStepSelected = stepItem;
      this.setStepStatus();
    }
    this.responseIO.data['previousSubStepClicked'] = true;
  }

  /**
   * This open the Error modal
   */
  openErrorModal() {
    openModal('subStepErrorModal');
  }

  /**
   * This close the Error modal
   */
  closeErrorModal() {
    closeModal('subStepErrorModal');
  }

  /**
   * @ignore
   */
  setValidationError(event: any, stepItem: StepItem, isErrorToast?: boolean) {
    this.pageContainerErrorList = [];
    this.currStepItem = stepItem;

    let validationerrors = this.service.responseIO.validationerrors;
    let stepErrorCount: number = 0;
    let stepValidationErrors = [];
    let errorList = [];

    let tabErrorCount = 0;
    if (validationerrors[this.selectedStep.selectedTab.id] != undefined) {
      for (let modelGuid in validationerrors[this.selectedStep.selectedTab.id]) {
        for (let fieldCd in validationerrors[this.selectedStep.selectedTab.id][modelGuid]) {
          errorList.push(validationerrors[this.selectedStep.selectedTab.id][modelGuid][fieldCd]);
          stepErrorCount++;
          tabErrorCount++;
        }
      }

      if (tabErrorCount > 0) this.selectedStep.selectedTab.errorCount = tabErrorCount;

      let errorName: string =
        this.selectedStep.selectedTab.text != undefined
          ? this.settingService.getLabelValue(this.selectedStep.selectedTab.text)
          : this.settingService.getLabelValue(this.selectedStep.selectedTab.id);
      if (errorList.length > 0)
        stepValidationErrors.push({
          name: errorName,
          errors: errorList,
        });
      errorList = [];
    }
    /* Ensure main-step  and sub-step errors are shown if the next button is not clicked. */
    if (!this.responseIO.data['nextSubStepClicked'] || this.responseIO.data['nextSubStepClicked'] == undefined)
      if (stepErrorCount > 0) stepItem.errorCount = stepErrorCount;
    if (stepValidationErrors.length > 0) {
      stepItem.validationErrors = stepValidationErrors;
    }

    if (this.breakErrorListInPopUp) {
      for (let i = 0; i < stepItem.validationErrors.length; i++) {
        for (let j = 0; j < stepItem.validationErrors[i].errors.length; j++) {
          if (stepItem.validationErrors[i].errors[j].includes(';')) {
            let splitErrorMessage = stepItem.validationErrors[i].errors[j].split(';');
            stepItem.validationErrors[i].errors.splice(j, 1);
            for (let x = 0; x < splitErrorMessage.length; x++) {
              stepItem.validationErrors[i].errors.push(splitErrorMessage[x]);
            }
          }
        }
      }
    }
    if (stepItem.validationErrors != undefined && stepItem.validationErrors.length > 0) {
      for (let i = 0; i < stepItem.validationErrors.length; i++) {
        this.pageContainerErrorList.push(stepItem.validationErrors[i]);
      }
    }
  }

  setPreviousSubStep() {
    if (this.currentSubStepSelected.index == 0) {
      this.isPreviousRequired = false;
    } else {
      this.isPreviousRequired = true;
    }
    let step =
      this.currentSubStepSelected.index - 1 == -1
        ? this.subStepList[0]
        : this.subStepList[this.currentSubStepSelected.index - 1];
    this.selectedSubStep.emit(step);
    //Adding this temporary variable because dont want to throw error on previous sub step.
    this.responseIO.data['previousSubStepClicked'] = true;
    this.currentSubStepSelected = step;
    this.setStepStatus();
  }

  setNextSubStep() {
    let modelNameBodyList = this.service.getModelNameBodyList(this.selectedStep.selectedTab.modelList);
    this.service.process(this.service.id, modelNameBodyList).subscribe(
      (body) => {
        this.service.responseIO = new ResponseIO();
        this.service.responseIO = JSON.parse(JSON.stringify(body));
        this.responseIO.data['nextSubStepClicked'] = true;
        if (
          this.service.responseIO.validationerrors &&
          this.service.responseIO.validationerrors[this.selectedStep.selectedTab.id] != undefined &&
          this.errorOccuredAtStep == undefined
        ) {
          this.setValidationError(undefined, this.selectedStep, undefined);
          this.errorOccuredAtStep = this.currentSubStepSelected;
        }

        if (
          ((this.service.responseIO.validationerrors &&
            this.service.responseIO.validationerrors[this.selectedStep.selectedTab.id] == undefined) ||
            this.service.responseIO.validationerrors == undefined) &&
          this.errorOccuredAtStep != undefined
        ) {
          this.errorOccuredAtStep = undefined;
          this.selectedStep.errorCount = 0;
        }

        if (
          this.service.responseIO.validationerrors == undefined ||
          (this.service.responseIO.validationerrors &&
            this.service.responseIO.validationerrors[this.selectedStep.selectedTab.id] != undefined &&
            this.currentSubStepSelected.id != this.errorOccuredAtStep.id) ||
          (this.service.responseIO.validationerrors &&
            this.service.responseIO.validationerrors[this.selectedStep.selectedTab.id] == undefined &&
            this.errorOccuredAtStep == undefined)
        ) {
          if (this.currentSubStepSelected.index + 1 > this.subStepList.length) {
            this.isNextRequired = false;
          } else {
            this.isNextRequired = true;
          }
          let step =
            this.currentSubStepSelected.index + 1 <= this.subStepList.length - 1
              ? this.subStepList[this.currentSubStepSelected.index + 1]
              : this.subStepList[this.subStepList.length - 1];
          if (this.currentSubStepSelected?.index == this.subStepList.length - 1) step.isLastStep = true;
          this.selectedSubStep.emit(step);
          this.currentSubStepSelected = step;
          this.setStepStatus();
          if (
            this.service.responseIO.validationerrors &&
            this.service.responseIO.validationerrors[this.selectedStep.selectedTab.id] == undefined &&
            this.errorOccuredAtStep != undefined
          ) {
            this.errorOccuredAtStep = undefined;
          }
        } else {
          this.showErrorToast();
        }
      },
      (error) => {
        console.log('Data load failed.');
        console.log('Error:', error);
      }
    );
  }

  private showErrorToast(): void {
    if (this.currentSubStepSelected != undefined) {
      this.currentSubStepSelected.displayErrorToast = true;
      setTimeout(() => {
        this.currentSubStepSelected.displayErrorToast = false;
      }, 6000);
    }
  }
  private setStepStatus() {
    this.isSubStepReadOnly = this.isSubStepReadOnly != undefined ? this.isSubStepReadOnly : false;
    for (let i = 0; i < this.subStepList.length; i++) {
      if (this.currentSubStepSelected.index > i) {
        this.subStepList[i].status = 'completed';
      } else if (this.currentSubStepSelected.index < i) {
        if (!this.isSubStepReadOnly) this.subStepList[i].status = undefined;
        if (this.isSubStepReadOnly) this.subStepList[i].status = 'completed';
      }

      if (this.currentSubStepSelected.index == i) {
        this.subStepList[i].status = 'active';
      }
    }
  }
}
