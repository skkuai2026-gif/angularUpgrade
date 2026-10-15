import { Component, OnChanges, OnInit, SimpleChanges, ChangeDetectionStrategy } from '@angular/core';
import { BaseComponent } from 'src/app/system-common/base/base.component';
import { SettingService } from 'src/app/system-common/services/setting.service';
import { PolicyService } from '../services/policy.service';

@Component({
  selector: 'sym-policy-aca-payment-gateway',
  templateUrl: './policy-aca-payment-gateway.component.html',
  styleUrls: ['./policy-aca-payment-gateway.component.scss'],
  changeDetection: ChangeDetectionStrategy.Eager,
  standalone: false,
})
export class PolicyACAPaymentGatewayComponent extends BaseComponent<PolicyService> implements OnChanges {
  constructor(policyService: PolicyService, public settingService: SettingService) {
    super(policyService);
    console.log('in PolicyACAPaymentGatewayComponent constructor called..... ');
  }

  ngOnChanges(changes: SimpleChanges) {
    super.ngOnChanges(changes);
  }
}
