import { Component, OnInit, Input, SimpleChanges, OnChanges, ChangeDetectionStrategy } from '@angular/core';
import { PolicyService } from './../services/policy.service';
import { PolicyPartyEmploymentHandlerComponent } from './policy-party-employment.handler';
import { FieldItem } from 'src/app/models/common/field-item';

@Component({
  selector: 'sym-policy-party-employment',
  templateUrl: './policy-party-employment.component.html',
  styleUrls: ['./policy-party-employment.component.scss'],
  changeDetection: ChangeDetectionStrategy.Eager,
  standalone: false,
})
export class PolicyPartyEmploymentComponent extends PolicyPartyEmploymentHandlerComponent implements OnChanges {
  @Input() model: any;
  @Input() partyModel: any;

  constructor(policyService: PolicyService) {
    super(policyService);
    this.industrySelectedOption = undefined;
  }
  ngOnChanges(changes: SimpleChanges) {
    super.ngOnChanges(changes);
  }
  protected natureOfDuty_focus(item: FieldItem) {
    // this.getNatureOfDuty(item);
  }
}
