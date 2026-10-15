import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { PolicyService } from '../services/policy.service';
import { PolicyAgentSharingHandlerComponent } from './policy-agent-sharing.handler';
@Component({
  selector: 'sym-policy-agent-sharing',
  templateUrl: './policy-agent-sharing.component.html',
  styleUrls: ['./policy-agent-sharing.component.scss'],
  changeDetection: ChangeDetectionStrategy.Eager,
  standalone: false,
})
export class PolicyAgentSharingComponent extends PolicyAgentSharingHandlerComponent implements OnInit {
  constructor(policyService: PolicyService) {
    super(policyService);
  }

  ngOnInit() {
    super.ngOnInit();
  }
}
