import { Component, OnInit, Input, SimpleChanges, OnChanges, ChangeDetectionStrategy } from '@angular/core';
import { PolicyService } from './../services/policy.service';
import { NavigationLink } from './../../models/common/navigation-link';
import { PolicyAgentDeclarationHandlerComponent } from './policy-agent-declaration.handler';
@Component({
  selector: 'sym-policy-agent-declaration',
  templateUrl: './policy-agent-declaration.component.html',
  styleUrls: ['./policy-agent-declaration.component.scss'],
  changeDetection: ChangeDetectionStrategy.Eager,
  standalone: false,
})
export class PolicyAgentDeclarationComponent extends PolicyAgentDeclarationHandlerComponent implements OnChanges {
  navigationLinkList: NavigationLink[];
  constructor(policyService: PolicyService) {
    super(policyService);
    //console.log(this.service.responseIO);
  }

  ngOnInit() {
    super.ngOnInit();
  }

  ngOnChanges(changes: SimpleChanges) {
    super.ngOnChanges(changes);
  }
}
