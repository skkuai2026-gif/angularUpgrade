import { PolicyService } from './../services/policy.service';
import { Component, OnInit, SimpleChanges, ChangeDetectionStrategy } from '@angular/core';
import { BaseComponent } from 'src/app/system-common/base/base.component';
@Component({
  selector: '',
  template: '',
  changeDetection: ChangeDetectionStrategy.Eager,
  standalone: false,
})
export class PolicyRiderExtraListHandlerComponent extends BaseComponent<PolicyService> implements OnInit {
  constructor(policyService: PolicyService) {
    super(policyService);
  }

  ngOnInit() {}
  ngOnChanges(changes: SimpleChanges) {
    super.ngOnChanges(changes);
  }
}
