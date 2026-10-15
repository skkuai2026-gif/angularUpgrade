import { SettingService } from 'src/app/system-common/services/setting.service';
import { ResponseIO } from 'src/app/models/responseIO';
import { StepItem } from 'src/app/models/common/step-item';
import { BreadCrumb } from 'src/app/models/common/bread-crumb';
import {
  Component,
  Input,
  OnInit,
  Output,
  EventEmitter,
  SimpleChanges,
  ChangeDetectionStrategy,
} from '@angular/core';

declare const responsiveBehaviour: any;
// declare const setDefaultFocus: any;

declare const openModal: any;
declare const closeModal: any;

@Component({
  selector: 'sym-page-container',
  templateUrl: './page-container.component.html',
  styleUrls: ['./page-container.component.css'],
  changeDetection: ChangeDetectionStrategy.Eager,
  standalone: false,
})
export class PageContainerComponent implements OnInit {
  /**
   * It expects JSON Object of BreadCrumb Which is rendered on the top of the page
   * which helps in navigating the page
   */
  @Input() breadCrumbList: BreadCrumb[];

  /**
   * It expects JSON Object of StepItem list that renders individual steps based on the module selected
   * which helps in navigating the page based on their selected step
   */
  @Input() stepList: StepItem[];

  /**
   *
   */
  // @Input() moreOptionsList: string[];

  /**
   * It is of type ResposeIO.
   *
   * It contains the value to be displayed inside the table.
   * @ResponseIO contains JSON Object of { data; metadata; lookups; validationerrors; }
   */
  @Input() responseIO: ResponseIO;

  /**
   * It displays a toast in the screen if the user try to click continue even if it has error.
   * Default value is false.
   */
  @Input() currentStepSelected: StepItem;
  /**
   * This input is to separate the '&' in error pop-up
   */
  @Input() breakErrorListInPopUp: boolean;

  /**
   * This is triggered when next/previous step is selected.
   * @StepItem It emitts selected step with Json Object of StepItem.
   */
  @Output() selectedStep = new EventEmitter<StepItem>();

  //to display error message required current stepitem
  /**
   * @ignore
   */
  public currStepItem: StepItem;
  /**
   * @ignore
   */
  public showDropdownForMobileView: boolean;
  public isCustomerPortal: boolean;
  public pageContainerErrorList: any;
  constructor(public settingService: SettingService) {
    this.showDropdownForMobileView = false;
    this.isCustomerPortal = this.settingService.isCustomerPortal();
  }

  ngOnInit() {
    // console.log(this.stepList);
  }
  ngOnChanges(changes: SimpleChanges) {
    if (changes['responseIO'] && changes['responseIO'].previousValue == undefined) {
      // setTimeout(() => {
      //   this.settingService.setDefaultFocus();
      // }, 250);
    }

    if (changes['stepList'] && changes['stepList'].currentValue) {
      this.stepList[this.stepList.length > 0 ? this.stepList.length - 1 : 0].isLastStep = true;
    }

    setTimeout(() => {
      responsiveBehaviour();
      this.settingService.setWindowWidth(window);
      // setDefaultFocus();
    }, 15);
    this.showDropdownForMobileView = false;
  }

  /**
   * @ignore
   */
  view(stepItem: StepItem) {
    //  console.log("step view",parameters);
    //  console.log(StepItem);
    this.selectedStep.emit(stepItem);
    this.showDropdownForMobileView = false;
  }

  /**
   * @ignore
   */
  onViewErrorClick(event: any, stepItem: StepItem, isErrorToast?: boolean) {
    this.pageContainerErrorList = [];
    this.currStepItem = stepItem;
    let currentStepIndex = this.currStepItem.index;
    let startIndex = currentStepIndex;
    if (isErrorToast) startIndex = 0;
    for (let e = startIndex; e <= currentStepIndex; e++) {
      let stepItem: StepItem = this.stepList[e];
      if (this.breakErrorListInPopUp) {
        for (let i = 0; i < stepItem.validationErrors.length; i++) {
          for (let j = 0; j < stepItem.validationErrors[i].errors.length; j++) {
            if (stepItem.validationErrors[i].errors[j].includes(this.settingService.getSymErrorSeperator())) {
              let splitErrorMessage = stepItem.validationErrors[i].errors[j].split(
                this.settingService.getSymErrorSeperator()
              );
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
    console.log(this.currStepItem);
    setTimeout(() => {
      // $('#errorButton').trigger('click');
      this.openErrorModal();
    }, 5);
  }

  /**
   * @ignore
   */
  openDropdown() {
    this.showDropdownForMobileView = !this.showDropdownForMobileView;
  }

  /**
   * This open the Error modal
   */
  openErrorModal() {
    openModal('errorModal');
  }
  /**
   * This close the Error modal
   */
  closeErrorModal() {
    closeModal('errorModal');
  }

  // used in prod build.
  return() {
    return;
  }
}
