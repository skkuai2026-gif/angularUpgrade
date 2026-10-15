import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { BaseComponent } from 'src/app/system-common/base/base.component';
import { PolicyService } from '../services/policy.service';

@Component({
  selector: 'sym-policy-customer-transfer-history',
  templateUrl: './policy-customer-transfer-history.component.html',
  styleUrls: ['./policy-customer-transfer-history.component.scss'],
  changeDetection: ChangeDetectionStrategy.Eager,
  standalone: false,
})
export class PolicyCustomerTransferHistoryComponent extends BaseComponent<PolicyService> implements OnInit {
  public policyCustomerTransferHistoryList: any;
  constructor(policyService: PolicyService) {
    super(policyService);
  }

  ngOnInit() {
    this.getPolicyTransferDetails();
  }

  protected getPolicyTransferDetails() {
    this.service.getPolicyTransferDetails().subscribe(
      (body) => {
        let responseJson = JSON.parse(JSON.stringify(body));
        if (responseJson.success) {
          this.policyCustomerTransferHistoryList = responseJson.data.PolicyTransferHistoryList;
        } else {
          console.log('Data load failed.');
        }
      },
      (error) => {
        console.log('Data load failed.');
        console.log('Error:', error);
      }
    );
  }
}
