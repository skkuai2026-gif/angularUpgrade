import { Component, Input, OnChanges, OnInit, SimpleChanges, ChangeDetectionStrategy } from '@angular/core';
import { PolicyService } from '../services/policy.service';
import { PolicyInitialPaymentHandlerComponent } from './policy-initial-payment.handler';

@Component({
  selector: 'sym-policy-initial-payment',
  templateUrl: './policy-initial-payment.component.html',
  styleUrls: ['./policy-initial-payment.component.scss'],
  changeDetection: ChangeDetectionStrategy.Eager,
  standalone: false,
})
export class PolicyInitialPaymentComponent extends PolicyInitialPaymentHandlerComponent implements OnChanges {
  @Input() responseUpdated: boolean;
  constructor(policyService: PolicyService) {
    super(policyService);
    // console.log(this.service.responseIO);
  }

  ngOnChanges(changes: SimpleChanges) {
    super.ngOnChanges(changes);
  }
}
