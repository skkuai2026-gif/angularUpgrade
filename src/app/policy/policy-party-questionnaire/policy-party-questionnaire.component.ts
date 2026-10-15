import { Component, SimpleChanges, OnChanges, ChangeDetectionStrategy } from '@angular/core';
import { PolicyService } from './../services/policy.service';
import { TabItem } from 'src/app/models/common/tab-items';
import { NavigationLink } from './../../models/common/navigation-link';
import { PolicyPartyQuestionnaireHandlerComponent } from './policy-party-questionnaire.handler';

@Component({
  selector: 'sym-policy-party-questionnaire',
  templateUrl: './policy-party-questionnaire.component.html',
  styleUrls: ['./policy-party-questionnaire.component.scss'],
  changeDetection: ChangeDetectionStrategy.Eager,
  standalone: false,
})
export class PolicyPartyQuestionnaireComponent
  extends PolicyPartyQuestionnaireHandlerComponent
  implements OnChanges
{
  constructor(policyService: PolicyService) {
    super(policyService);
    // console.log(this.service.responseIO);
  }
  ngOnInit() {
    super.ngOnInit();
  }
  ngOnChanges(changes: SimpleChanges) {
    super.ngOnChanges(changes);
  }
}
