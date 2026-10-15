import { Component, SimpleChanges, OnChanges, ChangeDetectionStrategy } from '@angular/core';
import { BaseComponent } from 'src/app/system-common/base/base.component';
import { PolicyService } from '../services/policy.service';
import { PolicyProposerHandlerComponent } from './policy-proposer.handler';

@Component({
  selector: 'sym-policy-proposer',
  templateUrl: './policy-proposer.component.html',
  styleUrls: ['./policy-proposer.component.css'],
  changeDetection: ChangeDetectionStrategy.Eager,
  standalone: false,
})
export class PolicyProposerComponent extends PolicyProposerHandlerComponent {
  constructor(policyService: PolicyService) {
    super(policyService);
  }
  ngOnChanges(changes: SimpleChanges) {
    super.ngOnChanges(changes);
  }
}
