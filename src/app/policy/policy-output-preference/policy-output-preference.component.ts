import { Component, Input, OnInit, SimpleChanges, ChangeDetectionStrategy } from '@angular/core';
import { PolicyOutputPreferencesHandlerComponent } from './policy-output-preference.handler';
import { PolicyService } from '../services/policy.service';

@Component({
  selector: 'sym-policy-output-preference',
  templateUrl: './policy-output-preference.component.html',
  styleUrls: ['./policy-output-preference.component.scss'],
  changeDetection: ChangeDetectionStrategy.Eager,
  standalone: false,
})
export class PolicyOutputPreferenceComponent extends PolicyOutputPreferencesHandlerComponent {
  @Input() displayLeft: boolean;
  //New
  @Input() prefix: string;
  constructor(policyService: PolicyService) {
    super(policyService);
    this.displayLeft = false;
    this.prefix = undefined;
  }
  ngOnChanges(changes: SimpleChanges) {
    super.ngOnChanges(changes);
  }
}
