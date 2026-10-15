import { Component, OnInit, Input, SimpleChanges, OnChanges, ChangeDetectionStrategy } from '@angular/core';
import { BaseComponent } from 'src/app/system-common/base/base.component';
import { PolicyService } from './../services/policy.service';
import { NavigationLink } from './../../models/common/navigation-link';

@Component({
  selector: '',
  template: '',
  changeDetection: ChangeDetectionStrategy.Eager,
  standalone: false,
})
export class PolicyAgentDeclarationHandlerComponent extends BaseComponent<PolicyService> implements OnChanges {
  navigationLinkList: NavigationLink[];

  /**This displays the quick navigation if its value is true
   *By default it is true.
   */
  @Input() isNavigationLinkReq: Boolean;

  constructor(policyService: PolicyService) {
    super(policyService);
    //console.log(this.service.responseIO);
    this.setNavigationLinks();
    this.isNavigationLinkReq = true;
  }
  ngOnInit() {
    super.ngOnInit();
  }

  ngOnChanges(changes: SimpleChanges) {
    super.ngOnChanges(changes);
  }
  setNavigationLinks() {
    this.navigationLinkList = [];
    this.service.responseIO.data.AgentQuestionnaireResponseList.questionSets.filter((questionSets) => {
      if (questionSets['headerText'] !== null) {
        let nav = new NavigationLink();
        nav.link = questionSets['questionSetCd'];
        nav.labelKey =
          questionSets.displayNum != undefined && questionSets.displayNum != null && questionSets.displayNum != ''
            ? questionSets.displayNum + ':' + questionSets.headerText
              ? ''
              : ''
            : questionSets.headerText;
        this.navigationLinkList.push(nav);
      }
    });
  }
}
