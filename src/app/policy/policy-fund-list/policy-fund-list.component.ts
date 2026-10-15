import { Component, OnChanges, OnInit, SimpleChanges, ChangeDetectionStrategy } from '@angular/core';
import { FieldItem } from 'src/app/models/common/field-item';
import { BaseComponent } from 'src/app/system-common/base/base.component';
import { PolicyService } from '../services/policy.service';

@Component({
  selector: 'sym-policy-fund-list',
  templateUrl: './policy-fund-list.component.html',
  styleUrls: ['./policy-fund-list.component.scss'],
  changeDetection: ChangeDetectionStrategy.Eager,
  standalone: false,
})
export class PolicyFundListComponent extends BaseComponent<PolicyService> implements OnChanges {
  constructor(policyService: PolicyService) {
    super(policyService);
  }
  ngOnChanges(changes: SimpleChanges) {
    super.ngOnChanges(changes);
  }
  ngOnInit(): void {
    this.service.responseIO.data.BasePlan.FundList.forEach((fundList: any) => {
      fundList['objName'] = this.service.responseIO.data.BasePlan.FundList[0].objName;
    });
  }
}
