import { Component, OnInit, OnChanges, ChangeDetectionStrategy } from '@angular/core';
import { BaseComponent } from '../../system-common/base/base.component';
import { PolicyService } from '../services/policy.service';
import { SettingService } from 'src/app/system-common/services/setting.service';

@Component({
  selector: 'sym-policy-uw-result',
  templateUrl: './policy-uw-result.component.html',
  styleUrls: ['./policy-uw-result.component.scss'],
  changeDetection: ChangeDetectionStrategy.Eager,
  standalone: false,
})
export class PolicyUwResultComponent extends BaseComponent<PolicyService> implements OnInit, OnChanges {
  validationMessages: string[] = [];
  showValidation: boolean = false;
  isSubmissionSuccessful: boolean = false;
  responseReceived: boolean = false; // Flag to check if service response is ready

  public company: any;
  submissionMessage: string = '';
  submissionADAMessage: string = '';
  constructor(policyService: PolicyService, public settingService: SettingService) {
    super(policyService);
  }

  ngOnInit() {
    this.service.displayLoader(true);
    console.log('ngOnInit call');
    console.log('uwresult init this.service.isPolicySubmitSuccess---------' + this.service.isPolicySubmitSuccess);
    // Fetch company color from settings
    this.company = SettingService.getApplicationPropertiesValue('COMPANYCOLOUR');

    if (this.service.responseIO?.data?.Entity?.applicationRefNum) {
      this.service.isPolicySubmitSuccess = undefined;
    }

    // Wait for service response
    if (!this.service.responseIO) {
      this.responseReceived = false;
      return;
    }
    this.processResponse();
  }
  ngAfterViewInit() {
    setTimeout(() => {
      this.service.hideLoader(true);
    }, 2000);
  }
  private processResponse() {
    const validationErrors = this.service.responseIO?.validationerrors;
    const hasValidationErrors = validationErrors && Object.keys(validationErrors).length > 0;

    if (hasValidationErrors) {
      this.showValidation = true;
      this.isSubmissionSuccessful = false;
      this.validationMessages = validationErrors;
      console.log('Validation Errors:', this.validationMessages);
    } else {
      const applicationRefNum = this.service.responseIO?.data?.Entity?.applicationRefNum;
      if (applicationRefNum) {
        this.showValidation = true;
        this.isSubmissionSuccessful = true;

        if (this.company === 'SLGFI') {
          this.submissionMessage = `Application number ${applicationRefNum} is successfully submitted. Kindly wait for the Confirmation receipt in SMS and email to be received for payment of initial premium.`;

          // ADA related
          if (this.service.responseIO.data.PolicyAdditionalFields?.field18 === 'BDOSELECTED') {
            this.submissionADAMessage = this.settingService.getLabelValue('submissionADAMessageVersion2');
          }
        } else if (this.company === 'SLOCPI') {
          const partyType = this.service.responseIO.data?.Proposer?.partyTypeCd;

          if (partyType === 'INDIVIDUAL') {
            this.submissionMessage = `
              Your application with serial number <b>${applicationRefNum}</b> has been successfully submitted. <br>
              For updates on your application, please contact your Sun Life advisor.<br>
              Once approved, your policy contract will be delivered digitally via email and through My Sun Life Client Portal.
            `;
          } else if (partyType === 'ORGANIZATION') {
            this.submissionMessage = `Application number ${applicationRefNum} is successfully submitted. Kindly wait for the Confirmation receipt in SMS and email to be received for payment of initial premium.`;
          }
        }
      } else {
        this.showValidation = false;
        this.isSubmissionSuccessful = false;
      }
    }

    // Mark that response has been processed
    this.responseReceived = true;
  }
}
