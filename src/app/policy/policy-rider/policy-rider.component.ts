import { Component, Input, ChangeDetectionStrategy } from '@angular/core';
import { PolicyService } from '../services/policy.service';
import { PolicyRiderHandlerComponent } from './policy-rider.handler';
@Component({
  selector: 'sym-policy-rider',
  templateUrl: './policy-rider.component.html',
  styleUrls: ['./policy-rider.component.scss'],
  changeDetection: ChangeDetectionStrategy.Eager,
  standalone: false,
})
export class PolicyRiderComponent extends PolicyRiderHandlerComponent {
  @Input() responseUpdated: boolean;
  constructor(policyService: PolicyService) {
    super(policyService);
  }
  ngOnInit() {
    super.ngOnInit();
    this.service.responseIO.data.RiderList.forEach((riderList: any) => {
      riderList['objName'] = this.service.responseIO.data.RiderList[0].objName;
    });
  }
}
