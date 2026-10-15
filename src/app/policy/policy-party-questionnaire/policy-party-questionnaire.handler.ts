import { Component, SimpleChanges, OnChanges, Input, ChangeDetectionStrategy } from '@angular/core';
import { BaseComponent } from 'src/app/system-common/base/base.component';
import { PolicyService } from './../services/policy.service';
import { TabItem } from 'src/app/models/common/tab-items';
import { NavigationLink } from './../../models/common/navigation-link';
import { PolicyServiceHandler } from '../services/policy.service.handler';
// declare const setDefaultFocus: any;

@Component({
  selector: '',
  template: '',
  changeDetection: ChangeDetectionStrategy.Eager,
  standalone: false,
})
export class PolicyPartyQuestionnaireHandlerComponent
  extends BaseComponent<PolicyServiceHandler>
  implements OnChanges
{
  partyQuestionnaireTabList: TabItem[];
  selectedPartyQuestionnaireTab: TabItem;
  navigationLinkList: NavigationLink[];

  /**This displays the quick navigation if its value is true
   *By default it is true.
   */
  @Input() isNavigationLinkReq: Boolean;
  @Input() policyService: PolicyServiceHandler;

  constructor(policyService: PolicyService) {
    super(policyService);
    this.loadPartyQuestionnaireTab();
    this.isNavigationLinkReq = true;
    // console.log(this.service.responseIO);
  }
  ngOnInit() {
    setTimeout(() => {
      this.service.setDefaultFocus();
    }, 5);
  }
  ngOnChanges(changes: SimpleChanges) {
    super.ngOnChanges(changes);
    if (this.policyService != undefined && this.policyService != null) this.service = this.policyService;
  }
  public setSelectedTab(tab: TabItem) {
    this.selectedPartyQuestionnaireTab = tab;
    this.setNavigationLinks();
  }
  protected loadPartyQuestionnaireTab() {
    if (
      this.service.responseIO.data.PartyQuestionnaireResponseList != undefined &&
      this.service.responseIO.data.PartyQuestionnaireResponseList.length != 0
    ) {
      this.partyQuestionnaireTabList = [];
      let userReferenceId =
        this.service.getUserLoginData() != undefined ? this.service.getUserLoginData()['userReferenceId'] : null;
      this.service.responseIO.data.PartyQuestionnaireResponseList.filter((questionnaire) => {
        let tab = new TabItem();
        tab.text =
          questionnaire.partyRole === undefined
            ? questionnaire.partyName
            : questionnaire.partyRole === null
            ? questionnaire.partyName
            : questionnaire.partyRole === ''
            ? questionnaire.partyName
            : questionnaire.partyRole + ': ' + questionnaire.partyName;
        tab.isSelected = false;
        tab.id = questionnaire.partyGuid;
        if (
          userReferenceId != undefined &&
          questionnaire.partyGuid != userReferenceId &&
          this.service.responseIO.data.Entity.allowModifyAllRoles != 'YES'
        )
          tab.visible = false;
        this.partyQuestionnaireTabList.push(tab);
      });
      if (this.partyQuestionnaireTabList.length > 0) {
        this.partyQuestionnaireTabList[0].isSelected = true;
        this.selectedPartyQuestionnaireTab = new TabItem();
        this.selectedPartyQuestionnaireTab = this.partyQuestionnaireTabList[0];
      }

      this.setNavigationLinks();
    }
  }
  setNavigationLinks() {
    this.navigationLinkList = [];
    this.service.responseIO.data.PartyQuestionnaireResponseList.filter((questionnaire) => {
      if (questionnaire.partyGuid == this.selectedPartyQuestionnaireTab.id) {
        if (
          questionnaire.questionSets &&
          questionnaire.questionSets.length != undefined &&
          questionnaire.questionSets.length != null
        ) {
          for (let i = 0; i < questionnaire.questionSets.length; i++) {
            const element = questionnaire[i];
            if (questionnaire.questionSets[i]['headerText'] !== null) {
              if (
                questionnaire.questionSets[i]['questionSets'] != undefined &&
                questionnaire.questionSets[i]['questionSets'].length == 0 &&
                questionnaire.questionSets[i]['questions'].length == 0
              ) {
                continue;
              }
              let nav = new NavigationLink();
              nav.link = questionnaire.questionSets[i]['questionSetCd'];
              nav.labelKey =
                questionnaire.questionSets[i].displayNum != undefined &&
                questionnaire.questionSets[i].displayNum != null &&
                questionnaire.questionSets[i].displayNum != ''
                  ? questionnaire.questionSets[i].displayNum + ':' + questionnaire.questionSets[i].headerText
                    ? ''
                    : ''
                  : questionnaire.questionSets[i].headerText;
              this.navigationLinkList.push(nav);
            }
          }
        }
      }
    });
  }
}
