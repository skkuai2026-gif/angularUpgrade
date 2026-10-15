import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { BaseComponent } from 'src/app/system-common/base/base.component';
import { PolicyService } from '../services/policy.service';

@Component({
  selector: 'sym-policy-transfer-history',
  templateUrl: './policy-transfer-history.component.html',
  styleUrls: ['./policy-transfer-history.component.scss'],
  changeDetection: ChangeDetectionStrategy.Eager,
  standalone: false,
})
export class PolicyTransferHistoryComponent extends BaseComponent<PolicyService> implements OnInit {
  public policyTransferHistoryList: any;
  constructor(policyService: PolicyService) {
    super(policyService);
  }

  ngOnInit() {
    this.getPolicyTransferHistory();
  }

  protected getPolicyTransferHistory() {
    this.service.getPolicyTransferHistory().subscribe(
      (body) => {
        let responseJson = JSON.parse(JSON.stringify(body));
        if (responseJson.success) {
          this.policyTransferHistoryList = responseJson.data.PolicyTransferHistoryList;
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
