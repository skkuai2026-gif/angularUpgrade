import { TabItem } from './../../models/common/tab-items';
import { StepItem } from './../../models/common/step-item';
import { ResponseIO } from './../../models/responseIO';
import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { PageHeader } from 'src/app/models/common/page-header';
import { BaseStepFormComponent } from 'src/app/system-common/base-step-form/base-step-form.component';
import { HeaderService } from 'src/app/system-common/services/header.service';
import { SettingService } from 'src/app/system-common/services/setting.service';
import { PolicyService } from '../services/policy.service';
import { BreadCrumb } from 'src/app/models/common/bread-crumb';
import { Location } from '@angular/common';
import { PolicyDynamicComponentList } from '../services/policy-dynamic-component-list';

@Component({
  selector: '',
  template: '',
  changeDetection: ChangeDetectionStrategy.Eager,
  standalone: false,
})
export class PolicyStepFormHandlerComponent extends BaseStepFormComponent<PolicyService> implements OnInit {
  public isInvalidMessage: boolean;
  private policyId = '';
  private userEmail = '';
  private hostEmailId = '';
  private hostFirstName = '';
  private hostLastName = '';
  private userFirstName = '';
  private userLastName = '';
  public static copyPolicyPopup: boolean;
  public static transferToCustomerPopup: boolean;
  public copyProposalDataDisplay: boolean;
  message: any;

  constructor(
    service: PolicyService,
    route: ActivatedRoute,
    router: Router,
    location: Location,
    settingService: SettingService,
    headerService: HeaderService
  ) {
    super(service, route, router, location, settingService, headerService);
    this.isInvalidMessage = false;
    PolicyStepFormHandlerComponent.copyPolicyPopup = false;
    PolicyStepFormHandlerComponent.transferToCustomerPopup = false;
    this.copyProposalDataDisplay = false;
  }

  ngOnInit(): void {
    super.ngOnInit();
  }

  protected getStepList(): StepItem[] {
    let stepList = [
      new StepItem(
        0,
        'step_completeDataEntry',
        [
          {
            id: 'tab_basic',
            isSelected: true,
            modelList: [
              'Entity',
              'BasePlan',
              'RiderList',
              'InitialInvestment',
              'RegularTopup',
              'AdHocTopupList',
              'TransferTopupList',
              'WithdrawalList',
              'AdditionalFieldsList',
            ],
          },
          {
            id: 'tab_owner',
            isSelected: false,
            modelList: ['Proposer'],
          },
          {
            id: 'tab_primary',
            isSelected: false,
            modelList: ['PrimaryInsured'],
          },
          {
            id: 'tab_joint',
            isSelected: false,
            modelList: ['JointLife'],
          },
          {
            id: 'tab_supplementary',
            isSelected: false,
            modelList: ['SupplementaryList'],
          },
          {
            id: 'tab_nominee',
            isSelected: false,
            modelList: ['NomineeList', 'Appointee'],
          },
          {
            id: 'tab_payment',
            isSelected: false,
            modelList: [
              'InitialOtherPayerParty',
              'InitialPayment',
              'RenewalOtherPayerParty',
              'RenewalPayment',
              'RefundPayment',
            ],
          },
          {
            id: 'tab_questionnaire',
            isSelected: false,
            modelList: ['PartyQuestionnaireResponseList'],
          },
        ],
        ['but_DraftSave', 'but_Continue']
      ),
      new StepItem(
        1,
        'step_requirement',
        [
          {
            id: 'tab_requirement',
            modelList: ['PartyDocumentList'],
          },
        ],
        ['but_Back', 'but_DraftSave', 'but_Continue']
      ),
      new StepItem(
        2,
        'step_previewEApp',
        [
          {
            id: 'tab_illustration',
            text: 'eappPreview',
            modelList: ['ServiceSignatureList', 'OutputPreferences'],
          },
        ],
        ['but_Back', 'but_DraftSave', 'but_Accept']
      ),
      new StepItem(
        3,
        'step_payment',
        [
          {
            id: 'tab_paymentsummary',
            modelList: ['InitialOtherPayerParty', 'InitialPayment'],
          },
        ],
        ['but_Back', 'but_PaymentDone']
      ),
    ];
    let tabList = [];
    let tab;

    if (this.settingService.getApplicationMode() === 'online') {
      tab = {
        id: 'tab_agentSharing',
        isSelected: false,
        modelList: ['AgentList'],
      };
      tabList.push(tab);
    }
    tabList.push({
      id: 'tab_agentDeclaration',
      modelList: ['AgentQuestionnaireResponseList'],
    });
    let step = new StepItem(4, 'step_agentDeclaration', tabList, ['but_DraftSave', 'but_Submit']);
    stepList.push(step);

    let step5 = new StepItem(
      5,
      'step_submitStatus',
      [
        {
          id: 'tab_uwCustomerInput',
          modelList: [
            'Entity',
            'PartyDocumentList',
            'BasePlan',
            'RiderList',
            'ServiceSignatureList',
            'MultiLifeList',
          ],
        },
      ],
      ['but_Back', 'but_DraftSave', 'but_submitStatus']
    );
    stepList.push(step5);

    return stepList;
  }

  protected getPageHeader(): PageHeader {
    let header = new PageHeader();
    header.additionalInfo = this.service.responseIO.data.Entity.productId;
    if (this.service.responseIO.data.Entity.policyNum != null) {
      header.refNumber = this.service.responseIO.data.Entity.policyNum;
      header.title = 'Policy';
    } else if (this.service.responseIO.data.Entity.proposalNum != null) {
      header.refNumber = this.service.responseIO.data.Entity.proposalNum;
      header.title = 'Proposal';
    }
    header.moreOptionList = this.getMoreOptionList();
    return header;
  }
  protected getMoreOptionList(): any[] {
    let optionList: any[];
    optionList = [];
    if (
      this.service.companyFacets != undefined &&
      this.service.companyFacets.data != undefined &&
      this.service.companyFacets.data.NONFACETOFACE === 'YES' &&
      this.settingService.getSessionStorageValue('userType') === 'AGENT' &&
      this.service.responseIO != undefined &&
      this.service.responseIO.data.Entity.allocatedToRole !== undefined &&
      this.service.responseIO.data.Entity.allocatedToRole !== null &&
      (this.service.responseIO.data.Entity.statusCd === 'PENDING' ||
        this.service.responseIO.data.Entity.statusCd === 'PAYMENTPENDING')
    ) {
      // if (this.service.responseIO.data.Entity.allocatedToRole === 'AGENT') {
      //   optionList.push({
      //     id: 'transferToCustomer',
      //   });
      // } else if (this.service.responseIO.data.Entity.allocatedToRole !== 'AGENT') {
      //   optionList.push({
      //     id: 'revoke',
      //   });
      // }
      optionList.push({
        id: 'transferToCustomerFlow',
      });
      optionList.push({
        id: 'viewQuotation',
      });
    }
    optionList.push({
      id: 'zoomConference',
    });
    //If policy is LOCKED (isInvalid = true) , when policy is submitted(isCompleted= true), show edit quotation and copy proposal data options
    let showEditQuotation: boolean =
      this.service.responseIO != undefined &&
      (this.service.responseIO.data.Entity.isCompleted || this.service.responseIO.data.Entity.isInvalid)
        ? false
        : true;

    if (showEditQuotation) {
      optionList.push({
        id: 'editQuotation',
      });
      if (
        this.service.companyFacets != undefined &&
        this.service.companyFacets.data != undefined &&
        this.service.companyFacets.data.COPYPROPOSALREQD === 'YES'
      )
        optionList.push({
          id: 'copyProposalData',
        });
    }

    return optionList;
  }
  protected getBreadCrumbList(): BreadCrumb[] {
    return [
      {
        id: 'home',
        link: '/home',
      },
      {
        id: 'E-Application',
        link: '/policy-insurance-type',
      },
      {
        id: 'search',
        link: '/policy-search',
      },
      {
        id: 'Policy',
      },
    ];
  }

  protected viewQuotation_click(buttonClicked: { id: string; link: string }) {
    //this.router.navigate(['quotation/' + this.service.responseIO.data.Entity.quotationSeq]);
    let url = 'quotation/' + this.service.responseIO.data.Entity.quotationSeq + '?view=popup';
    super.showWindow(url, 100, 300);
  }

  protected editQuotation_click(buttonClicked: { id: string; link: string }) {
    this.service.editQuotation().subscribe(
      (successResponse) => {
        this.service.responseIO = JSON.parse(JSON.stringify(successResponse));
        this.router.navigate(['quotation/' + this.service.responseIO.data.Entity.quotationSeq]);
        console.log('Edit Quotation successful.');
      },
      (error) => {
        console.log('Edit Quotation failed.');
        console.log('Error:', error);
      }
    );
  }
  /**
   *
   * @param buttonClicked
   * If a single party is available then pop-up wont be opend. It will directly transfer to customer.
   * If multiple party is available pop-up will be displayed.
   */
  protected transferToCustomer_click(buttonClicked: { id: string; link: string }) {
    if (this.service.getFieldLookupSize(this.service.responseIO.data.Entity, 'allocationPartyGuidList') > 1) {
      PolicyStepFormHandlerComponent.transferToCustomerPopup = true;
      this.openModal('policytransferToCustomer');
    } else {
      this.service.changeAllocation().subscribe(
        (responseIO) => {
          // alert( responseIO[ 'message' ] );
          this.service.responseIO = new ResponseIO();
          this.service.responseIO = JSON.parse(JSON.stringify(responseIO));
          // alert(responseIO['message']);
          if (responseIO['success']) {
            this.success(responseIO['message'], undefined, true);
            this.onSuccessChangeAllocation(responseIO['success']);
          } else {
            this.error(responseIO['message'], undefined, true);
          }
        },
        (error) => {
          console.log('Transfer to customer failed.');
          console.log('Error:', error);
        }
      );
    }
  }

  /**
   *
   * @param buttonClicked
   * If a single party is available then pop-up wont be opend. It will directly transfer to customer.
   * If multiple party is available pop-up will be displayed.
   */
  protected zoomConference_click(buttonClicked: { id: string; link: string }) {
    if (this.service.responseIO.data.Entity != undefined && this.service.responseIO.data.Entity.id != undefined) {
      this.policyId = this.service.responseIO.data.Entity.id;
      //console.log('this.policyId : ' + this.policyId);
    }
    this.service.findByPolicyId(this.policyId).subscribe(
      (body) => {
        var response = JSON.parse(JSON.stringify(body));
        if (
          response.data != undefined &&
          response.data.Entity != undefined &&
          response.data.Entity.id != undefined
        ) {
          //console.log('response.data.Entity.id : ' + response.data.Entity.id);
          this.policyId = response.data.Entity.id;
          console.log('this.policyId > ' + this.policyId);
        }
        //if(response.data.Entity.allocatedToRole !== 'AGENT'){
        if (
          response.data != undefined &&
          response.data.Proposer != undefined &&
          response.data.Proposer.PersonalEmail != undefined &&
          response.data.Proposer.PersonalEmail.emailAddress != undefined
        ) {
          //console.log('response.data.Proposer.PersonalEmail.emailAddress : ' + response.data.Proposer.PersonalEmail.emailAddress);
          if (
            response.data.Proposer.PersonalEmail.emailAddress != null &&
            response.data.Proposer.PersonalEmail.emailAddress.length > 0 &&
            String(response.data.Proposer.PersonalEmail.emailAddress).includes('@') &&
            String(response.data.Proposer.PersonalEmail.emailAddress).includes('.')
          ) {
            this.userEmail = response.data.Proposer.PersonalEmail.emailAddress;
            this.userFirstName = response.data.Proposer.firstName1;
            this.userLastName = response.data.Proposer.lastName1;
            //console.log('this.userEmail > ' + this.userEmail );
          } else {
            console.log('Invalid Policy Data missing or invalid: Invalid User Info');
          }
        }
        //} else if(response.data.Entity.allocatedToRole !== 'AGENT'){
        if (
          response.data != undefined &&
          response.data.AgentList != undefined &&
          response.data.AgentList.length > 0 &&
          response.data.AgentList[0].primaryAgentFl == 'YES'
        ) {
          //console.log('response.data.AgentList[0].emailId : ' + response.data.AgentList[0].emailId);
          if (
            response.data.AgentList[0].emailId != null &&
            response.data.AgentList[0].emailId.length > 0 &&
            String(response.data.AgentList[0].emailId).includes('@') &&
            String(response.data.AgentList[0].emailId).includes('.')
          ) {
            this.hostEmailId = response.data.AgentList[0].emailId;
            this.hostFirstName = response.data.AgentList[0].agentName;
            //this.hostLastName = response.data.AgentList[0].lastName1;
            //console.log('this.userEmail > ' + this.userEmail );
          } else {
            console.log('Invalid Policy Data missing or invalid: Invalid Host Info');
          }
        }
        //}

        if (
          this.policyId != null &&
          this.policyId != undefined &&
          parseInt(this.policyId) > 0 &&
          this.userEmail != null &&
          this.userEmail != undefined &&
          this.userEmail.length > 0 &&
          String(this.userEmail).includes('@') &&
          String(this.userEmail).includes('.')
        ) {
          console.log('launching zoom session with ' + this.userEmail);
          var baseURL = location.origin;
          var baseAPI = '/api/';
          var baseAPIURL = baseURL + baseAPI;
          window.open(
            location.protocol +
              '//' +
              location.host +
              '/assets/modal/index.html' +
              '?hostEmailId=' +
              encodeURIComponent(this.hostEmailId) +
              '&hostFirstName=' +
              this.hostFirstName +
              '&hostLastName=' +
              this.hostLastName +
              '&userEmail=' +
              encodeURIComponent(this.userEmail) +
              '&userFirstName=' +
              this.userFirstName +
              '&userLastName=' +
              this.userLastName +
              '&recordingPrefix=' +
              this.policyId + //+ '&baseAPIURL=' + encodeURIComponent(this.settingService.baseURL)
              '&baseAPIURL=' +
              encodeURIComponent(baseAPIURL) +
              '&Token=' +
              encodeURIComponent(sessionStorage.getItem('Token')),
            //+ '&baseAPIURL=' + encodeURIComponent('http://localhost:4300/api/')
            //+ '&baseAPI=' + encodeURIComponent('http://localhost:4300/api/')

            '_blank'
          );
        } else {
          console.log('this.policyId : ' + this.policyId);
          console.log('this.userEmail : ' + this.userEmail);
          console.log('Unable to initiate Zoom call. Policy Data missing or invalid.');
        }
      },
      (error) => {
        console.log('Unable to initiate Zoom call. Policy Data load failed.');
        console.log('Error:', error);
      }
    );
  }

  protected revoke_click(buttonClicked: { id: string; link: string }) {
    this.service.changeAllocation().subscribe(
      (responseIO) => {
        // alert( responseIO[ 'message' ] );
        this.service.responseIO = new ResponseIO();
        this.service.responseIO = JSON.parse(JSON.stringify(responseIO));
        this.service.reloadCurrentRoute();
      },
      (error) => {
        console.log('Transfer to customer failed.');
        console.log('Error:', error);
      }
    );
  }

  protected preProcess(): boolean {
    let shouldSave: boolean = true;
    //As summary tab is readonly there is no need to save but just load the next tab while moving
    //out of this tab

    if (this.service.responseIO.data.Entity.isCompleted || this.service.responseIO.data.Entity.isInvalid) {
      //submitted cases should not be edited and saved just viewed hence return false
      shouldSave = false;
    } else if (
      (this.service.responseIO.data.Entity.statusCd == 'ACCEPTED' ||
        this.service.responseIO.data.Entity.statusCd == 'PAYMENTPENDING' ||
        this.service.responseIO.data.Entity.statusCd == 'PAYMENTFAILED' ||
        this.service.responseIO.data.Entity.statusCd == 'PAYMENTDONE' ||
        this.service.responseIO.data.Entity.statusCd == 'PAYMENTSUCCESS' ||
        this.service.responseIO.data.Entity.statusCd == 'SUBMITTED_UWCUSTOMERINPUT') &&
      (this.selectedStep.id == 'step_completeDataEntry' ||
        this.selectedStep.id == 'step_requirement' ||
        this.selectedStep.id == 'step_previewEApp')
    ) {
      shouldSave = false;
    } else if (
      this.service.responseIO.data.Entity.statusCd == 'SUBMITTED_UWCUSTOMERINPUT' &&
      (this.selectedStep.id == 'step_payment' || this.selectedStep.id == 'step_agentDeclaration')
    ) {
      shouldSave = false;
    } else if (
      this.service.responseIO.data.Entity.statusCd == 'PAYMENTDONE' &&
      this.selectedStep.id == 'step_payment'
    ) {
      // shouldSave = false;
    }

    return shouldSave;
  }

  protected postLoad() {
    this.loadProductFacets();
    if (
      !this.isInvalidMessage &&
      this.service.responseIO.data.Entity.isInvalid &&
      this.service.responseIO.data.Entity.invalidReason != null
    ) {
      this.error(this.service.responseIO.data.Entity.invalidReason);
      this.isInvalidMessage = true;
    }
  }

  protected preLoad() {
    this.loadCompanyFacets();
  }

  protected postProcess() {
    //  this.loadProductFacets();
  }

  protected loadProductFacets(): void {
    if (this.service.responseIO && this.service.responseIO.data && this.service.productFacets == undefined) {
      let productSeq = null;
      if (this.service.responseIO.data['BasePlan'] && this.service.responseIO.data['BasePlan'].productSeq != null)
        productSeq = this.service.responseIO.data['BasePlan'].productSeq;
      else if (
        this.service.responseIO.data['Entity'] &&
        this.service.responseIO.data['Entity'].baseProductSeq != null
      )
        productSeq = this.service.responseIO.data['Entity'].baseProductSeq;
      if (productSeq != null) {
        this.service.getProductUIFacets(productSeq).subscribe(
          (facets) => {
            this.service.productFacets = [];
            this.service.productFacets = JSON.parse(JSON.stringify(facets));
            //console.log("selectedStep: "+this.selectedStep.id);
            //check rider tab need need to check here since prestepslection call first then get productFacets api result
            //this check is not required here since rider is loaded based on if rider list is present in data
            if (this.selectedStep != undefined && this.selectedStep.id == 'step_completeDataEntry') {
              this.checkForNomineeTab(this.selectedStep);
              this.checkForInsuredTab(this.selectedStep);
            }
            // console.log(facets);
            console.log('Product facets loaded successful.');
            //console.log('this.service.responseIO.data.Entity.id : ' + this.service.responseIO.data.Entity.id);
            if (
              this.service.responseIO.data.Entity.id != null &&
              this.service.responseIO.data.Entity.id != undefined &&
              this.service.responseIO.data.Entity.id.length > 0
            ) {
              this.policyId = this.service.responseIO.data.Entity.id;
            }
          },
          (error) => {
            console.log('Product facets load failed.');
            console.log('Error:', error);
          }
        );
      }
    }
  }

  protected loadCompanyFacets(): void {
    //TODO in product selection component clear out the productfacets on change of product.
    let productSeq = null;
    if (this.service.companyFacets == undefined) {
      this.service.getProductUIFacets(productSeq).subscribe(
        (facets) => {
          this.service.companyFacets = [];
          this.service.companyFacets = JSON.parse(JSON.stringify(facets));
          // console.log(facets);
          this.postLoadCompanyFacets();
          console.log('Company facets loaded successful.');
        },
        (error) => {
          console.log('Company facets load failed.');
          console.log('Error:', error);
        }
      );
    }
  }

  protected preStepSelection(nextStepObj: StepItem): void {
    //for all steps if status is Accepted then remove the buttons
    if (this.service.responseIO.data.Entity.statusCd == 'SUBMITTED' && nextStepObj.id != 'step_submitStatus') {
      if (nextStepObj.id == 'step_agentDeclaration') nextStepObj.buttonList = ['but_Continue'];
      else nextStepObj.buttonList = [];
    } else if (this.service.responseIO.data.Entity.isCompleted || this.service.responseIO.data.Entity.isInvalid)
      nextStepObj.buttonList = [];
    else if (
      (this.service.responseIO.data.Entity.statusCd == 'ACCEPTED' ||
        this.service.responseIO.data.Entity.statusCd == 'PAYMENTPENDING' ||
        this.service.responseIO.data.Entity.statusCd == 'PAYMENTDONE' ||
        this.service.responseIO.data.Entity.statusCd == 'PAYMENTSUCCESS') &&
      (nextStepObj.id == 'step_completeDataEntry' || nextStepObj.id == 'step_requirement')
    )
      nextStepObj.buttonList = [];
    else if (
      (this.service.responseIO.data.Entity.statusCd == 'ACCEPTED' ||
        this.service.responseIO.data.Entity.statusCd == 'PAYMENTPENDING' ||
        this.service.responseIO.data.Entity.statusCd == 'PAYMENTDONE' ||
        this.service.responseIO.data.Entity.statusCd == 'PAYMENTSUCCESS') &&
      nextStepObj.id == 'step_previewEApp'
    )
      nextStepObj.buttonList = ['but_Continue'];
    else if (
      (this.service.responseIO.data.Entity.statusCd == 'PAYMENTPENDING' ||
        this.service.responseIO.data.Entity.statusCd == 'PAYMENTFAILED') &&
      nextStepObj.id == 'step_payment'
    )
      nextStepObj.buttonList = ['but_Back'];
    else if (
      this.service.responseIO.data.Entity.statusCd == 'SUBMITTED_UWCUSTOMERINPUT' &&
      nextStepObj.id != 'step_submitStatus'
    ) {
      if (nextStepObj.id == 'step_agentDeclaration') nextStepObj.buttonList = ['but_Continue'];
      else nextStepObj.buttonList = [];
    }

    //for step coverage details only if supplementary is selected on the Entity then have that tab
    if (nextStepObj.id == 'step_completeDataEntry') {
      this.checkForJointLifeTab(nextStepObj);
      this.checkForSupplementaryTab(nextStepObj);
      this.checkForRiderTab(nextStepObj);
      this.checkForNomineeTab(nextStepObj);
      this.checkForInsuredTab(nextStepObj);
    }
  }

  protected checkForSupplementaryTab(nextStepObj: StepItem): void {
    for (var i = 0; i < nextStepObj.tabList.length; i++) {
      var tabItem = nextStepObj.tabList[i];
      if (tabItem.id == 'tab_supplementary') {
        // nextStepObj.tabList.splice(i, 1);

        if (
          this.service.responseIO.data.Entity.supplementaryLives == null ||
          this.service.responseIO.data.Entity.supplementaryLives == 'NO'
        ) {
          tabItem.visible = false;
          break;
        } else if (this.service.responseIO.data.Entity.supplementaryLives == 'YES') {
          tabItem.visible = true;
          if (this.service.productFacets != undefined) {
            if (
              this.service.productFacets.data['FAMILYINSUREDDETAILS'] != undefined &&
              this.service.productFacets.data['FAMILYINSUREDDETAILS'] == 'YES'
            )
              tabItem.text = 'familyFloater';
            else if (
              this.service.productFacets.data['MULTILIFEAPPLICABLE'] != undefined &&
              this.service.productFacets.data['MULTILIFEAPPLICABLE'] == 'YES'
            )
              tabItem.text = 'multLives';
          }
          break;
        }
      }
    }
  }

  protected checkForJointLifeTab(nextStepObj: StepItem): void {
    if (
      this.service.responseIO.data.Entity.jointLife == null ||
      this.service.responseIO.data.Entity.jointLife == 'NO'
    ) {
      for (var i = 0; i < nextStepObj.tabList.length; i++) {
        var tabItem = nextStepObj.tabList[i];
        if (tabItem.id == 'tab_joint') {
          nextStepObj.tabList.splice(i, 1);
          break;
        }
      }
    }
  }

  protected checkForRiderTab(nextStepObj: StepItem): void {
    //if RiderList is 0 then do not display the Tab
    if (this.service.responseIO.data.RiderList == null || this.service.responseIO.data.RiderList.length == 0) {
      for (var i = 0; i < nextStepObj.tabList.length; i++) {
        var tabItem = nextStepObj.tabList[i];
        if (tabItem.id == 'tab_rider') {
          nextStepObj.tabList.splice(i, 1);
          break;
        }
      }
    }
  }

  protected checkForNomineeTab(nextStepObj: StepItem): void {
    //if RiderList is 0 then do not display the Tab
    if (
      this.service.productFacets != undefined &&
      this.service.productFacets.data['EXCLUDENOMINEECAPTURE'] != undefined &&
      this.service.productFacets.data['EXCLUDENOMINEECAPTURE'] == 'YES'
    ) {
      for (var i = 0; i < nextStepObj.tabList.length; i++) {
        var tabItem = nextStepObj.tabList[i];
        if (tabItem.id == 'tab_nominee') {
          nextStepObj.tabList.splice(i, 1);
          break;
        }
      }
    }
  }

  protected checkForInsuredTab(nextStepObj: StepItem): void {
    //if RiderList is 0 then do not display the Tab
    if (this.service.responseIO.data.Entity.insuredSameAsProposer == true) {
      for (var i = 0; i < nextStepObj.tabList.length; i++) {
        var tabItem = nextStepObj.tabList[i];
        if (tabItem.id == 'tab_primary') {
          nextStepObj.tabList.splice(i, 1);
          break;
        }
      }
    }
  }

  protected but_DraftSave_click() {
    //on accept counter offer,need to save si signature..for that copy si signture records into policy
    if (this.selectedStep.id == 'step_submitStatus') {
      this.copyQuotationSignIntoPolicySign();
      this.setSignatureDateOnCounterOffer();
    }
    super.but_DraftSave_click();
  }

  protected but_Accept_click() {
    let nextStepObj = this.stepList[this.selectedStep.index + 1];
    this.saveUpdatedModels(this.selectedStep, nextStepObj, undefined, 'but_Accept');
  }

  protected but_Complete_click() {
    this.service.changeAllocation().subscribe(
      (responseIO) => {
        // alert( responseIO[ 'message' ] );
        this.service.responseIO = new ResponseIO();
        this.service.responseIO = JSON.parse(JSON.stringify(responseIO));
        //this.service.reloadCurrentRoute();
        this.selectedStep.buttonList = [];
        this.headerService.pageHeader = this.getPageHeader();
        this.success('Proposal submitted sucessfully.', undefined, true);
      },
      (error) => {
        console.log('Transfer to customer failed.');
        console.log('Error:', error);
      }
    );
  }

  protected but_submitStatus_click() {
    //on accept counter offer,need to save si signature..for that copy si signture records into policy
    this.copyQuotationSignIntoPolicySign();
    this.setSignatureDateOnCounterOffer();
    //setting the current step itself as the next step since is the last step
    this.saveUpdatedModels(this.selectedStep, this.selectedStep, undefined, 'but_submitStatus');
  }

  protected copyQuotationSignIntoPolicySign() {
    if (
      this.service.quotationService != undefined &&
      this.service.quotationService.responseIO != undefined &&
      this.service.responseIO.data.Entity.counterOfferDecisionCd == 'ACCEPT'
    ) {
      let newServiceSignList = [];
      Array.prototype.push.apply(newServiceSignList, this.service.responseIO.data.ServiceSignatureList);
      this.service.quotationService.responseIO.data.ServiceSignatureList.forEach((serviceSignature) => {
        newServiceSignList.push(serviceSignature);
      });

      //need to change the entire array instance in order to reflect in the dom
      this.service.responseIO.data.ServiceSignatureList = [];
      this.service.responseIO.data.ServiceSignatureList = newServiceSignList;
    }
  }

  protected setSignatureDateOnCounterOffer() {
    //on save of accept counter offer, signature date need to set counterOfferAcceptDt
    if (this.service.responseIO.data.Entity.counterOfferDecisionCd == 'ACCEPT') {
      this.service.responseIO.data.ServiceSignatureList.forEach((serviceSignature) => {
        if (serviceSignature != undefined && serviceSignature.constructor === [].constructor) {
          if (serviceSignature.length > 0) {
            serviceSignature.forEach((serSignature) => {
              if (serSignature != undefined && (serSignature.status == 'U' || serSignature.status == 'I'))
                serSignature.signatureDt = this.service.responseIO.data.Entity.counterOfferAcceptDt;
            });
          }
        } else {
          if (serviceSignature != undefined && (serviceSignature.status == 'U' || serviceSignature.status == 'I'))
            serviceSignature.signatureDt = this.service.responseIO.data.Entity.counterOfferAcceptDt;
        }
      });
    }
  }

  protected but_Submit_click() {
    //setting the current step itself as the next step since is the last step
    let nextStepObj = this.stepList[this.selectedStep.index + 1];
    this.saveUpdatedModels(this.selectedStep, nextStepObj, undefined, 'but_Submit');
  }

  protected but_PaymentDone_click() {
    this.service.responseIO.data.Entity.statusCd = 'PAYMENTDONE';
    this.service.responseIO.data.Entity.status = 'U';
    super.but_Continue_click();
  }

  //Override the on save method and write custom logic  for accept only
  protected onSaveUpdatedModels(
    body: any,
    currentStepObj: StepItem,
    nextStepObj?: StepItem,
    nextTabObj?: TabItem,
    buttonId?: string,
    continueNextStep?: boolean
  ) {
    let tempNextStepObj = nextStepObj;
    let tempNextTabObj = nextTabObj;
    if (buttonId == 'but_Submit') {
      this.setValidationErrors(true);
      tempNextStepObj = nextStepObj;
      tempNextTabObj = nextTabObj;
      if (this.selectedStep.errorCount == 0 || this.selectedStep.errorCount == undefined) {
        nextStepObj = null;
        nextTabObj = null;
      }
    }
    if (continueNextStep == undefined) continueNextStep = true;
    //in the below scenarios we do not want to continue to next step until
    //further processing is done..for solving row was updated issue.
    if (
      this.selectedStep.id == 'step_previewEApp' &&
      buttonId == 'but_Accept' &&
      (this.selectedStep.errorCount == 0 ||
        this.selectedStep.errorCount == undefined ||
        this.continueWithWarning())
    ) {
      continueNextStep = false;
    } else if (
      buttonId == 'but_Submit' &&
      (this.selectedStep.errorCount == 0 || this.selectedStep.errorCount == undefined)
    ) {
      continueNextStep = false;
    } else if (
      this.selectedStep.id == 'step_submitStatus' &&
      buttonId == 'but_submitStatus' &&
      (this.selectedStep.errorCount == 0 || this.selectedStep.errorCount == undefined)
    ) {
      continueNextStep = false;
    }
    super.onSaveUpdatedModels(body, currentStepObj, nextStepObj, nextTabObj, buttonId, continueNextStep);
    if (
      this.selectedStep.id == 'step_previewEApp' &&
      buttonId == 'but_Accept' &&
      (this.selectedStep.errorCount == 0 || this.selectedStep.errorCount == undefined)
    ) {
      //in case of non face to face ,even if current step is not having any error but previous steps having error then don't call accept policy api
      if (
        this.service.companyFacets != undefined &&
        this.service.companyFacets.data.NONFACETOFACE === 'YES' &&
        !this.continueWithWarning()
      ) {
        this.showErrorToast();
        return;
      }

      setTimeout(() => {
        this.service.responseIO.data.Entity.stepActionTabs = undefined;
        this.service.displayLoader(true, buttonId);
        //Instead of fetching all models, fetch only the next-step model list.solve performnace releated issue in online and offline
        let modelNameBodyList = this.service.getModelNameBodyList(nextStepObj?.tabList[0]?.modelList);
        if (this.settingService.getApplicationMode() === 'offline') {
          this.service.acceptPolicy(modelNameBodyList).subscribe(
            (successResponse) => {
              if (successResponse['success'] == true) {
                this.service.responseIO = new ResponseIO();
                this.service.responseIO = JSON.parse(JSON.stringify(successResponse));
                nextStepObj = tempNextStepObj;
                nextTabObj = tempNextTabObj;
                this.setSelectedStep(nextStepObj, nextTabObj);
                this.headerService.pageHeader = this.getPageHeader();
                // if (successResponse['success'] == true) {
                //openAcceptPolicyModal();
                //console.log(this.selectedStep);
                this.postAcceptPolicy();
                // this.setSelectedStep(nextStepObj);
                this.onStepChanged(nextStepObj);
                console.log('Policy Accept successful.');
              } else {
                if (this.settingService.getApplicationMode() === 'offline') {
                  this.confirm(
                    this.message,
                    () => {},
                    () => {}
                  );
                  console.log('policy accept error sucess false ');
                  this.selectedStep.buttonList = [];
                }
                this.error(successResponse['message'], undefined, true);
              }
              console.log(successResponse['message']);
              // this.service.hideLoader(true);
            },
            (error) => {
              console.log('Policy Accept failed.');
              console.log('Error:', error);
            }
          );
        } else if (this.settingService.getApplicationMode() === 'online') {
          this.service.acceptPolicy().subscribe(
            (successResponse) => {
              if (successResponse['success'] == true) {
                this.service.responseIO = new ResponseIO();
                this.service.responseIO = JSON.parse(JSON.stringify(successResponse));
                nextStepObj = tempNextStepObj;
                nextTabObj = tempNextTabObj;
                this.setSelectedStep(nextStepObj, nextTabObj);
                this.headerService.pageHeader = this.getPageHeader();
                // if (successResponse['success'] == true) {
                //openAcceptPolicyModal();
                //console.log(this.selectedStep);
                this.postAcceptPolicy();
                // this.setSelectedStep(nextStepObj);
                this.onStepChanged(nextStepObj);
                console.log('Policy Accept successful.');
              } else {
                if (this.settingService.getApplicationMode() === 'offline') {
                  this.confirm(
                    this.message,
                    () => {},
                    () => {}
                  );
                  console.log('policy accept error sucess false ');
                  this.selectedStep.buttonList = [];
                }
                this.error(successResponse['message'], undefined, true);
              }
              console.log(successResponse['message']);
              // this.service.hideLoader(true);
            },
            (error) => {
              console.log('Policy Accept failed.');
              console.log('Error:', error);
            }
          );
        }
      }, 1);
    } else if (
      buttonId == 'but_Submit' &&
      (this.selectedStep.errorCount == 0 || this.selectedStep.errorCount == undefined)
    ) {
      this.service.responseIO.data.Entity.stepActionTabs = undefined;
      this.service.displayLoader(false, buttonId);
      this.service.submitPolicy().subscribe(
        (successResponse) => {
          this.postSubmitPolicy(successResponse);
          this.service.hideLoader(true, buttonId);
          nextStepObj = tempNextStepObj;
          nextTabObj = tempNextTabObj;
          this.setSelectedStep(nextStepObj, nextTabObj);
          if (successResponse['success'] == true) {
            this.service.responseIO = new ResponseIO();
            this.service.responseIO = JSON.parse(JSON.stringify(successResponse));
            //this.openModal('submitPolicyModal');
            // console.log(this.selectedStep);
            if (this.service.responseIO.data.Entity.statusCd == 'SUBMITTED') this.selectedStep.buttonList = [];
            this.setSelectedStep(nextStepObj);
            this.headerService.pageHeader = this.getPageHeader();
            // console.log('submit api response ' + successResponse);
            console.log('Policy submit successful.');
          } else {
            this.error(successResponse['message'], undefined, true);
            if (this.settingService.getApplicationMode() === 'offline') {
              let respData: any;
              respData = JSON.parse(JSON.stringify(successResponse));
              console.log('this.service.responseIOsucces sresponse', respData);
              this.service.responseIO.validationerrors = respData.validationerrors;
              console.log(
                ' this.service.responseIO.validationerrors:::',
                this.service.responseIO.validationerrors
              );
              this.error(successResponse['message'], undefined, true);
            }
          }
          console.log(successResponse['message']);
        },
        (error) => {
          this.postSubmitPolicyError(error);
          console.log('Policy submit failed.');
          console.log('Error:', error);
        }
      );
    } else if (
      this.selectedStep.id == 'step_submitStatus' &&
      buttonId == 'but_submitStatus' &&
      (this.selectedStep.errorCount == 0 || this.selectedStep.errorCount == undefined)
    ) {
      this.service.responseIO.data.Entity.stepActionTabs = undefined;
      this.service.responseIO.data.Entity.statusCd = 'SUBMITTED_UWCOMPLETE';
      this.service.responseIO.data.Entity.status = 'U';

      this.service.process(this.service.id, this.service.getResponseModelNameList()).subscribe(
        (successResponse) => {
          if (successResponse['success'] == true) {
            this.service.responseIO = new ResponseIO();
            this.service.responseIO = JSON.parse(JSON.stringify(successResponse));
            this.openModal('submitPolicyModal');
            // console.log(this.selectedStep);
            this.selectedStep.buttonList = [];
            this.setSelectedStep(nextStepObj);
            this.headerService.pageHeader = this.getPageHeader();
            // alert(this.service.getMultilingualLabel('policySubmitMesg'));
            // console.log('submit api response ' + successResponse);
            console.log('Update Policy Status successful.');
          } else {
            this.error(successResponse['message'], undefined, true);
          }
          console.log(successResponse['message']);
        },
        (error) => {
          console.log('Policy submit failed.');
          console.log('Error:', error);
        }
      );
    }
  }

  postSubmitPolicy(successResponse: Object) {}
  postSubmitPolicyError(error: any) {}

  protected postAcceptPolicy() {
    if (!(this.service.responseIO.data.Entity.statusCd == 'ACCEPTED' && this.selectedStep.id == 'step_payment')) {
      this.selectedStep.buttonList = [];
    }
  }

  setCustomStepStatus(stepItem: StepItem): void {
    if (
      this.service.responseIO.data.Entity.statusCd == 'ACCEPTED' ||
      this.service.responseIO.data.Entity.statusCd == 'PAYMENTPENDING' ||
      this.service.responseIO.data.Entity.statusCd == 'PAYMENTFAILED' ||
      this.service.responseIO.data.Entity.statusCd == 'PAYMENTSUCCESS'
    ) {
      let stepItemIndexArr = [0, 1, 2];
      if (stepItemIndexArr.includes(stepItem.index)) stepItem.status = 'completed';
      else if (stepItem.index > this.selectedStep.index) stepItem.status = 'pending';
    } else if (this.service.responseIO.data.Entity.statusCd == 'PAYMENTDONE') {
      let stepItemIndexArr = [0, 1, 2, 3];
      if (stepItemIndexArr.includes(stepItem.index)) stepItem.status = 'completed';
      else if (stepItem.index > this.selectedStep.index) stepItem.status = 'pending';
    } else if (
      this.service.responseIO.data.Entity.statusCd == 'SUBMITTED_UWCUSTOMERINPUT' ||
      this.service.responseIO.data.Entity.statusCd == 'SUBMITTED'
    ) {
      let stepItemIndexArr = [0, 1, 2, 3, 4];
      if (stepItemIndexArr.includes(stepItem.index)) stepItem.status = 'completed';
      else if (stepItem.index > this.selectedStep.index) stepItem.status = 'pending';
    } else {
      super.setCustomStepStatus(stepItem);
    }
  }

  closeSubmitPolicyModal() {
    this.closeModal('submitPolicyModal');
  }

  protected continueWithWarning(): boolean {
    let isContinueWithWarning = false;
    if (this.service.companyFacets != undefined && this.service.companyFacets.data.NONFACETOFACE === 'YES') {
      //Agent should not be able to Accept without clearing all warnings of step 0,1,2.
      //for that check in validation error having error or not
      if (this.selectedStep.id == 'step_previewEApp') {
        let validationerrors = this.service.responseIO.validationerrors;
        let isErrorExists = false;
        let stepItemIndexArr = [0, 1, 2];
        for (var e = 0; e < stepItemIndexArr.length; e++) {
          let stepItem: StepItem = this.getStepList()[e];
          for (let tabItem of stepItem.tabList) {
            if (validationerrors[tabItem.id] != undefined) {
              isErrorExists = true;
              break;
            }
          }
          if (isErrorExists) break;
        }
        if (!isErrorExists) isContinueWithWarning = true;
      } else {
        //in case of non face to face,agent and customer both can be continue with warning only ////step 0 and 1.
        let stepItemIndexArr = [0, 1];
        if (
          stepItemIndexArr.includes(this.selectedStep.index) &&
          this.service.responseIO.data.Entity.allocatedToPartyGuid != undefined
        )
          isContinueWithWarning = true;
      }
    }
    return isContinueWithWarning;
  }

  ngOnDestroy() {
    super.ngOnDestroy();
    this.isInvalidMessage = false;
    //To clear the quotation service used to display SI Illustration in Preview step in E-APP
    if (this.service?.quotationService != undefined) this.service.quotationService.clear();
  }

  onSuccessChangeAllocation(isChangeAllocationSuccess: boolean) {
    if (isChangeAllocationSuccess) {
      this.selectedStep.buttonList = [];
      this.headerService.pageHeader = this.getPageHeader();
    }
  }

  /**
   *
   * @param buttonClicked
   * If any number of party is available pop-up will be displayed. Along with transfer history if present
   */
  protected transferToCustomerFlow_click(buttonClicked: { id: string; link: string }) {
    if (this.service.getFieldLookupSize(this.service.responseIO.data.Entity, 'allocationPartyGuidList') > 0) {
      setTimeout(() => {
        PolicyStepFormHandlerComponent.transferToCustomerPopup = true;
        this.openModal('policytransferToCustomer');
      }, 100);
    } else {
      this.error('No clients are available for transfer', undefined, true);
    }
  }

  protected setStepActionTab(currentStepObj: StepItem) {
    super.setStepActionTab(currentStepObj);
    let service = this.altService != undefined ? this.altService : this.service;
    if (
      this.service.companyFacets != undefined &&
      this.service.companyFacets.data.NONFACETOFACE === 'YES' &&
      this.service.responseIO.data.Entity.allocatedToPartyGuid != undefined &&
      currentStepObj.id == 'step_previewEApp'
    ) {
      let stepActionTabs: string = service.responseIO.data.Entity.stepActionTabs;
      let stepItemIndexArr = [0, 1];

      for (var stepCount = 0; stepCount < stepItemIndexArr.length; stepCount++) {
        for (var tabCount = 0; tabCount < this.stepList[stepCount].tabList.length; tabCount++) {
          stepActionTabs = stepActionTabs + this.stepList[stepCount].tabList[tabCount].id + ',';
        }
      }
      service.responseIO.data.Entity.stepActionTabs = stepActionTabs;
    }
  }

  protected postLoadCompanyFacets() {}

  protected getComponentListToDisplay() {
    return PolicyDynamicComponentList.componentMap;
  }

  protected copyProposalData_click(buttonClicked: { id: string; link: string }) {
    PolicyStepFormHandlerComponent.copyPolicyPopup = true;
    this.openModal('copyPolicyModal');
  }

  public getCopyPolicyPopup() {
    return PolicyStepFormHandlerComponent.copyPolicyPopup;
  }
  public setCopyPolicyPopup() {
    PolicyStepFormHandlerComponent.copyPolicyPopup = !PolicyStepFormHandlerComponent.copyPolicyPopup;
  }

  copyPolicyDataArray(copiedData: { copyFromPolicySeq: number; proposalDataToBeCopied: any }) {
    this.service.copyPolicyData(copiedData.copyFromPolicySeq, copiedData.proposalDataToBeCopied).subscribe(
      (successResponse) => {
        this.closeModal('copyPolicyModal');
        this.setCopyPolicyPopup();
        this.service.reloadCurrentRoute();
      },
      (error) => {
        console.log('Error:', error);
      }
    );
  }

  public getTransferToCustomerPopup() {
    return PolicyStepFormHandlerComponent.transferToCustomerPopup;
  }
  public setTransferToCustomerPopup() {
    PolicyStepFormHandlerComponent.transferToCustomerPopup =
      !PolicyStepFormHandlerComponent.transferToCustomerPopup;
  }
}
