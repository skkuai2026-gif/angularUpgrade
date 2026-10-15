import { Component, EventEmitter, Output, ChangeDetectionStrategy } from '@angular/core';
import { PolicyService } from '../services/policy.service';
import { BaseComponent } from 'src/app/system-common/base/base.component';
import { BusinessCommonService } from '../../business-common/service/business-common.service';
import { SettingService } from 'src/app/system-common/services/setting.service';
import { FieldItem } from 'src/app/models/common/field-item';

@Component({
  selector: 'sym-policy-eapp-feedback',
  templateUrl: './policy-eapp-feedback.component.html',
  styleUrls: ['./policy-eapp-feedback.component.scss'],
  changeDetection: ChangeDetectionStrategy.Eager,
  standalone: false,
})
export class PolicyEappFeedbackComponent extends BaseComponent<PolicyService> {
  //  Star Rating
  stars: number[] = [1, 2, 3, 4, 5];
  selectedValue = 0;
  // Comment
  commentText = '';
  isCommentMandatory = false;
  //  Star labels
  starLabels: { [key: number]: string } = {
    1: this.settingService.getLabelValue('StartRating1'),
    2: this.settingService.getLabelValue('StartRating2'),
    3: this.settingService.getLabelValue('StartRating3'),
    4: this.settingService.getLabelValue('StartRating4'),
    5: this.settingService.getLabelValue('StartRating5'),
  };

  constructor(
    public policyService: PolicyService,
    public businessCommonService: BusinessCommonService,
    public settingService: SettingService
  ) {
    super(policyService);
  }

  ngOnInit(): void {
    const additionalFields = this.service.responseIO.data.PolicyAdditionalFields;
    if (additionalFields) {
      // Load rating
      this.selectedValue = Number(additionalFields.field22) || 0;
      // Load comment
      this.commentText = additionalFields.field19 || '';
    }
  }
  //  Star selection
  countStar(star: number): void {
    this.selectedValue = star;
    console.log('Star value', star);
    // Save star rating
    this.service.setModelFieldValue(
      this.service.responseIO.data.PolicyAdditionalFields,
      'field22',
      this.selectedValue
    );
    console.log('Star Store value', this.service.responseIO.data.PolicyAdditionalFields.field22);
    this.validateComment();
    console.log('validation step :', this.validateComment());
  }
  //  Comment change
  onCommentChange(): void {
    // Save comment
    this.service.setModelFieldValue(
      this.service.responseIO.data.PolicyAdditionalFields,
      'field19',
      this.commentText
    );
    this.validateComment();
  }

  /* VALIDATION LOGIC */
  private validateComment(): void {
    const comment = (this.commentText || '').trim();

    if (this.selectedValue > 0 && this.selectedValue <= 3 && !comment) {
      this.isCommentMandatory = true;
      this.showPopup();
    } else {
      this.isCommentMandatory = false;
    }
  }
  getLabelForStar(star: number): string {
    return this.starLabels[star];
  }
  showPopup() {
    this.openModal('mandatoryPopup');
  }
  getStarStyle(star: number): string {
    if (star <= this.selectedValue) {
      return '0 0 3px #ff9c00, 0 0 5px #ff9c00';
    }
    return '0 0 1px #000, 0 0 2px #000';
  }

  protected field19_change(item: FieldItem) {
    this.commentText = item.fieldValue;
    if (this.selectedValue > 0) {
      this.validateComment();
    } else {
      this.isCommentMandatory = false;
    }

    const textarea = document.querySelector('textarea[id*="field19"]') as HTMLTextAreaElement;

    if (textarea) {
      if (this.isCommentMandatory && !this.commentText) {
        textarea.style.border = '1px solid red';
      } else {
        textarea.style.border = '';
      }
    }
  }
}
