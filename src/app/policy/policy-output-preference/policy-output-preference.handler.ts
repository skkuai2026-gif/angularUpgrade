import { Component, OnInit, Input, OnChanges, SimpleChanges, ChangeDetectionStrategy } from '@angular/core';
import { BaseComponent } from 'src/app/system-common/base/base.component';
import { PolicyService } from '../services/policy.service';
@Component({
  selector: '',
  template: '',
  changeDetection: ChangeDetectionStrategy.Eager,
  standalone: false,
})
export class PolicyOutputPreferencesHandlerComponent extends BaseComponent<PolicyService> implements OnChanges {
  constructor(policyService: PolicyService) {
    super(policyService);
  }
  ngOnInit() {}
  ngOnChanges(changes: SimpleChanges) {
    super.ngOnChanges(changes);
    console.log(this.service);
  }
}
