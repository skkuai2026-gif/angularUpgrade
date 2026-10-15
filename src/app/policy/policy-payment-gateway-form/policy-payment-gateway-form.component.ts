import { Component, OnChanges, SimpleChanges, ChangeDetectionStrategy } from '@angular/core';
import { PolicyPaymentGatewayFormHandler } from './policy-payment-gateway-form.handler';
import { PolicyService } from '../services/policy.service';
import { SettingService } from 'src/app/system-common/services/setting.service';

@Component({
  selector: 'sym-policy-payment-gateway-form',
  templateUrl: './policy-payment-gateway-form.component.html',
  styleUrls: ['./policy-payment-gateway-form.component.scss'],
  changeDetection: ChangeDetectionStrategy.Eager,
  standalone: false,
})
export class PolicyPaymentGatewayFormComponent extends PolicyPaymentGatewayFormHandler implements OnChanges {
  constructor(policyService: PolicyService, public settingService: SettingService) {
    super(policyService, settingService);
  }

  ngOnChanges(changes: SimpleChanges) {
    super.ngOnChanges(changes);
  }
}
