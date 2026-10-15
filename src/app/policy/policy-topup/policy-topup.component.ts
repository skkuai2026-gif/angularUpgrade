import { Component, OnChanges, OnInit, SimpleChanges, ChangeDetectionStrategy } from '@angular/core';
import { FieldItem } from 'src/app/models/common/field-item';
import { BaseComponent } from 'src/app/system-common/base/base.component';
import { PolicyService } from '../services/policy.service';

@Component({
  selector: 'sym-policy-topup',
  templateUrl: './policy-topup.component.html',
  styleUrls: ['./policy-topup.component.scss'],
  changeDetection: ChangeDetectionStrategy.Eager,
  standalone: false,
})
export class PolicyTopupComponent extends BaseComponent<PolicyService> implements OnChanges {
  public topupOptionCd: string = this.service.responseIO.data['Entity'].topupOptionCd;
  constructor(policyService: PolicyService) {
    super(policyService);
    // console.log(this.service.responseIO.data['AdHocTopupList']);
    // console.log(this.service.responseIO.data['TransferTopupList']);
    // console.log(this.)
  }
  ngOnChanges(changes: SimpleChanges) {
    super.ngOnChanges(changes);
  }
  onTransferTopupChanged(item) {}
  onTransferTopupRowAdded(item) {}
  onAdHocTopupRowAdded(item) {}
  onAdHocTopupChanged(item) {}
}
