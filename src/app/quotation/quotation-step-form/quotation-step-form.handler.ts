import { ResponseIO } from 'src/app/models/responseIO';
import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { PageHeader } from 'src/app/models/common/page-header';
import { StepItem } from 'src/app/models/common/step-item';
import { BaseStepFormComponent } from 'src/app/system-common/base-step-form/base-step-form.component';
import { HeaderService } from 'src/app/system-common/services/header.service';
import { SettingService } from 'src/app/system-common/services/setting.service';
import { QuotationService } from '../services/quotation.service';
import { BreadCrumb } from 'src/app/models/common/bread-crumb';
import { TabItem } from 'src/app/models/common/tab-items';
import { Location } from '@angular/common';
import { QuotationModule } from '../quotation.module';
import { DynamicComponentList } from '../services/dynamic-component-list';

@Component({
  selector: '',
  template: '',
  changeDetection: ChangeDetectionStrategy.Eager,
  standalone: false,
})
export class QuotationStepFormHandlerComponent extends BaseStepFormComponent<QuotationService> {
  isProposerCopiedFromLA: boolean = false;
  private isInvalidMessage: boolean = false;
  public childComboMap = new Map<number, QuotationService>();

  constructor(
    service: QuotationService,
    route: ActivatedRoute,
    router: Router,
    location: Location,
    settingService: SettingService,
    headerService: HeaderService
  ) {
    super(service, route, router, location, settingService, headerService);
  }

  ngOnInit(): void {
    super.ngOnInit();
    // console.log('QuotationStepFormHandlerComponent init stepList :-', this.stepList);
    // console.log('step form SelectedStep :-', this.selectedStep);
  }

  //Sample getCustomStepList coded here for reference
  //to return steps based on entity data
  //Call getCustomStepList itself from getStepList as well.

  /*  protected getCustomStepList(): StepItem[] {
    //1st step
    let customStepList: StepItem[] = new Array();
    let stepIndex = 0;
    let stepObj = new StepItem();
    stepObj.index = stepIndex;
    stepObj.id = 'step_yourDetails';
    stepObj.tabList = [
      {
        id: 'tab_basic',
        modelList: ['Entity', 'Proposer', 'PrimaryInsured', 'JointLife'],
      },
    ];
    if (this.service.responseIO.data != null && this.service.responseIO.data.Entity.quoteStatusCd != 'ACCEPTED')
      stepObj.buttonList = ['but_DraftSave', 'but_Continue'];
    customStepList.push(stepObj);
    //2nd step
    stepObj = new StepItem();
    stepObj.index = ++stepIndex;
    stepObj.id = 'step_selectProduct';
    stepObj.tabList = [{ id: 'tab_selProduct', modelList: ['Entity', 'BasePlan'] }];
    if (this.service.responseIO.data != null && this.service.responseIO.data.Entity.quoteStatusCd != 'ACCEPTED')
      stepObj.buttonList = ['but_DraftSave', 'but_Continue'];
    customStepList.push(stepObj);
    return customStepList;

    //return this.getStepList();
  }
*/

  protected getComponentListToDisplay() {
    return DynamicComponentList.componentMap;
  }

  protected getStepList(): StepItem[] {
    let stepList: StepItem[] = [
      new StepItem(
        0,
        'step_yourDetails',
        [
          {
            id: 'tab_basic',
            modelList: ['Entity', 'Proposer', 'PrimaryInsured', 'JointLife', 'AdditionalFieldsList'],
          },
        ],
        ['but_DraftSave', 'but_Continue']
      ),
      new StepItem(
        1,
        'step_selectProduct',
        [{ id: 'tab_selProduct', modelList: ['Entity', 'BasePlan'] }],
        ['but_Back', 'but_DraftSave', 'but_Continue']
      ),
      new StepItem(
        2,
        'step_coverageDet',
        [
          {
            id: 'tab_plan',
            modelList: [
              'BasePlan',
              'PrimaryInsured',
              'InitialInvestment',
              'RegularTopup',
              'AdHocTopupList',
              'TransferTopupList',
              'WithdrawalList',
              'RiderList',
              'RegularWithdrawal',
              'AdditionalFieldsList',
            ],
          },
          { id: 'tab_supplementary', modelList: ['SupplementaryList', 'BasePlan'] },
          { id: 'tab_rider', modelList: ['RiderList', 'BasePlan'] },
        ],
        ['but_Back', 'but_DraftSave', 'but_Continue']
      ),
      new StepItem(
        3,
        'step_quoteSummary',
        [
          {
            id: 'tab_premiumSummary',
            modelList: [
              'Entity',
              'BasePlan',
              'RiderList',
              'Proposer',
              'PrimaryInsured',
              'JointLife',
              'SupplementaryList',
              'InitialInvestment',
            ],
          },
        ],
        ['but_Back', 'but_Continue']
      ),
      new StepItem(
        4,
        'step_acceptIllustration',
        [
          {
            id: 'tab_illustration',
            modelList: [
              'BasePlan',
              'OutputPreferences',
              'EmailRequest',
              'ServiceSignatureList',
              'Proposer',
              'PrimaryInsured',
            ],
          },
        ],
        ['but_Back', 'but_DraftSave', 'but_Accept']
      ),
    ];

    /*   let step1 = new StepItem();
    step1.index = 0;
    step1.id = 'step_yourDetails';
    step1.tabList = [
      {
            id: 'tab_basic',
            modelList: [
                'Entity',
                'Proposer',
                'PrimaryInsured',
                'JointLife',
            ]
        }
    ];
    if(this.service.responseIO.data != null &&
      this.service.responseIO.data.Entity.quoteStatusCd != 'ACCEPTED')
    step1.buttonList = ['but_DraftSave','but_Continue'];

    stepList.push(step1);
    */
    return stepList;
  }

  protected getPageHeader(): PageHeader {
    let header = new PageHeader();
    // console.log(this.service.responseIO.data);
    //TODO commented product id for now since base plan was not available at all places
    // header.additionalInfo =
    //     this.service.responseIO &&
    //     this.service.responseIO.data &&
    //     this.service.responseIO.data.BasePlan &&
    //     this.service.responseIO.data.BasePlan.productLongName !=
    //         undefined &&
    //     this.service.responseIO.data.BasePlan.productLongName != null
    //         ? this.service.responseIO.data.BasePlan.productLongName
    //         : this.service.responseIO.data.Entity.productId;

    header.refNumber = this.service.responseIO.data.Entity.quotationRefNum;
    header.title = 'quotation';
    header.moreOptionList = this.getMoreOptionList();
    return header;
  }

  protected getMoreOptionList(): any[] {
    let optionList: any[];
    optionList = [];
    if (this.service.responseIO != undefined && this.service.responseIO.data.Entity.leadId != undefined) {
      optionList.push({
        id: 'viewLead',
      });
    }
    if (this.service.responseIO != undefined && this.service.responseIO.data.Entity.policySeq != undefined) {
      optionList.push({
        id: 'viewEApp',
        text:
          this.service.getMultilingualLabel('viewEApp') +
          ' (' +
          this.service.responseIO.data.Entity.proposalNum +
          ')',
      });
    }
    return optionList;
  }

  protected getBreadCrumbList(): BreadCrumb[] {
    if (this.queryParams != undefined && this.queryParams['view'] == 'popup') {
      return [];
    } else if (
      this.service.responseIO != undefined &&
      this.service.responseIO.data != undefined &&
      this.service.responseIO.data.Entity.quoteStatusCd == 'INFORCE'
    ) {
      return [
        {
          id: 'home',
          link: '/home',
        },
        {
          id: 'search',
          link: '/inforce-illustration-search',
        },
        {
          id: 'quote',
        },
      ];
    } else {
      return [
        {
          id: 'home',
          link: '/home',
        },
        {
          id: 'SalesIllustration',
          link: '/quote-insurance-type',
        },
        {
          id: 'search',
          link: '/quotation-search',
        },
        {
          id: 'quote',
        },
      ];
    }
  }

  protected preProcess(): boolean {
    let shouldSave: boolean = true;
    //As summary tab is readonly there is no need to save but just load the next tab while moving
    //out of this tab
    if (this.service.responseIO.data.Entity.isCompleted || this.service.responseIO.data.Entity.isInvalid) {
      //Accepted, Inforce cases should not be edited and saved just viewed hence return false
      shouldSave = false;
    }
    return shouldSave;
  }

  protected postInit() {
    this.loadProductFacets();
    this.loadCompanyFacets();
    this.setProposerCopiedFromLAFlag();
  }

  protected preLoad() {
    this.loadCompanyFacets();
    this.setProposerCopiedFromLAFlag();
  }

  protected postLoadCompanyFacets() {}

  protected postLoad() {
    let brdcl = this.getBreadCrumbList();
    if (brdcl != undefined) this.breadCrumbList = brdcl;
    this.loadProductFacets();
    //isInvalidMessage flag check added since postLoad gets called on every tab.. but this message
    //should be displayed only once the first time the form is openened for this case.
    if (
      !this.isInvalidMessage &&
      this.service.responseIO.data.Entity.isInvalid &&
      this.service.responseIO.data.Entity.invalidReason != null
    ) {
      //Warning alerts to be displayed
      this.warn(this.service.responseIO.data.Entity.invalidReason, () => {
        //here write callback code if any. You can access the parameters here itself
        //this.isInvalidMessage = true;
        // this.exitApplication();
      });
      this.isInvalidMessage = true;
      // //info example with auto close feature and no callback functions.
      // this.info('FYI', undefined, false);
      // //Success messages with HTML content
      // this.success('<b> Hurray!! </b>. Task successfully completed', () => {
      //   alert('success callback called');
      // });
      // //Error message
      // this.error('Error :(', () => {
      //   alert('err callback called');
      // });
      // //Confirmation example.
      // this.confirm(
      //   'Are you sure you want to continue? ',
      //   () => {
      //     alert('ok called');
      //   },
      //   () => {
      //     alert('cancel called');
      //   }
      // );
    }
  }

  protected postProcess() {
    this.loadProductFacets();
    this.isDataSaved = false;
  }

  protected loadProductFacets(): void {
    //TODO in product selection component clear out the productfacets on change of product.
    if (
      this.service.responseIO &&
      this.service.responseIO.data &&
      this.service.productFacets == undefined &&
      this.service.responseIO.data['BasePlan'] &&
      this.service.responseIO.data['BasePlan'].productSeq != null
    ) {
      this.service.getProductUIFacets(this.service.responseIO.data['BasePlan'].productSeq).subscribe(
        (facets) => {
          this.service.productFacets = [];
          this.service.productFacets = JSON.parse(JSON.stringify(facets));
          //check rider tab need need to check here since prestepslection call first then get productFacets api result
          if (this.selectedStep != undefined && this.selectedStep.index == 2) {
            this.checkForRiderTab(this.selectedStep);
            this.checkForSupplementaryTab(this.selectedStep);
          }
          this.postLoadProductFacets();
          // console.log(facets);
          console.log('Product facets loaded successful.');
        },
        (error) => {
          console.log('Product facets load failed.');
          console.log('Error:', error);
        }
      );
    }
  }

  protected postLoadProductFacets() {}

  protected setProposerCopiedFromLAFlag() {
    if (
      this.service.companyFacets != undefined &&
      this.service.companyFacets.data['PROPOSERCOPIEDFROMLA_AGENT'] &&
      this.service.companyFacets.data['PROPOSERCOPIEDFROMLA_AGENT'] == 'YES'
    )
      this.isProposerCopiedFromLA = true;
  }

  protected loadCompanyFacets(): void {
    //TODO in product selection component clear out the productfacets on change of product.
    let productSeq = null;
    if (this.service.companyFacets == undefined) {
      this.service.getProductUIFacets(productSeq).subscribe(
        (facets) => {
          this.service.companyFacets = [];
          this.service.companyFacets = JSON.parse(JSON.stringify(facets));
          // this.service.companyFacets.data.QUOTEPARTY_UIFORMAT =
          //   '<UIConfig><panel><row><col field="title"  width="3"/><col field="firstname"  width="3"/><col field="middlename"  width="3"/><col field="lastname"  width="3"/></row><row><col field="dob"  width="3"/><col field="age"  width="3"/><col field="genderCd"  width="3"/><col field="smoker"  width="3"/></row></panel></UIConfig>';
          // console.log(facets);
          this.setProposerCopiedFromLAFlag();
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
    if (this.service.responseIO.data.Entity.isCompleted || this.service.responseIO.data.Entity.isInvalid)
      nextStepObj.buttonList = [];
    //for step coverage details only if supplementary is selected on the Entity then have that tab
    if (nextStepObj.index == 2) {
      this.checkForSupplementaryTab(nextStepObj);
      this.checkForRiderTab(nextStepObj);
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

  protected checkForRiderTab(nextStepObj: StepItem): void {
    //if RIDERASSOCIATION facet not set then do not display the Tab
    for (var i = 0; i < nextStepObj.tabList.length; i++) {
      var tabItem = nextStepObj.tabList[i];
      if (tabItem.id == 'tab_rider') {
        // nextStepObj.tabList.splice(i, 1);
        if (
          this.service.responseIO.data.BasePlan != undefined &&
          this.service.responseIO.data.BasePlan.productTypeCd == 'COMBO'
        )
          tabItem.visible = false;
        else if (
          this.service.productFacets != undefined &&
          this.service.productFacets.data['RIDERASSOCIATION'] == undefined
        ) {
          tabItem.visible = false;
          break;
        } else if (
          this.service.responseIO.data.RiderList == null ||
          this.service.responseIO.data.RiderList == undefined ||
          (this.service.responseIO.data.RiderList != undefined &&
            this.service.responseIO.data.RiderList.length == 0)
        ) {
          tabItem.visible = false;
          break;
        } else if (
          this.service.productFacets != undefined &&
          this.service.productFacets.data['RIDERASSOCIATION'] != undefined
        ) {
          tabItem.visible = true;
          break;
        }
      }
    }
  }

  protected but_Accept_click() {
    //on acceptance first save the quotation and check if all errors are cleared if so
    //then go ahead and accept
    //this.saveUpdatedModels(this.selectedStep, this.selectedStep, undefined, 'but_Accept');
    this.confirm(
      this.service.getMultilingualLabel('acceptConfirmation'),
      () => {
        this.saveUpdatedModels(this.selectedStep, undefined, undefined, 'but_Accept');
      },
      () => {
        this.service.hideLoader(true);
      }
    );
  }

  //Override the on save method and write custom logic  for accept only
  protected onSaveUpdatedModels(
    body: any,
    currentStepObj: StepItem,
    nextStepObj?: StepItem,
    nextTabObj?: TabItem,
    buttonId?: string
  ) {
    super.onSaveUpdatedModels(body, currentStepObj, nextStepObj, nextTabObj, buttonId);
    //this.preStepSelection(currentStepObj);
    if (
      buttonId == 'but_Accept' &&
      (this.selectedStep.errorCount == 0 || this.selectedStep.errorCount == undefined)
    ) {
      //update the step index to the next step
      //this.service.responseIO.data.Entity.step =
      //    this.selectedStep.index + 1;
      //this.service.responseIO.data.Entity.stepActionTabs = undefined;
      this.setStepActionTab(currentStepObj);
      //this.service.responseIO.data.ServiceSignatureList=undefined;
      // this.service.acceptIllustration();
      let modelNameList = this.selectedStep.selectedTab.modelList;
      let modelNameBodyList = this.getModelNameBodyList(modelNameList);
      setTimeout(() => {
        this.service.displayLoader(false, buttonId);
        this.service.acceptIllustration(modelNameBodyList).subscribe(
          (successResponse) => {
            this.postAcceptIllustration(successResponse);
            // console.log(successResponse);
            this.service.hideLoader(false, buttonId);
            this.service.responseIO = new ResponseIO();
            this.service.responseIO = JSON.parse(JSON.stringify(successResponse));
            if (successResponse['success'] == true) {
              // openAcceptIllustrationModal();
              this.openModal('acceptIllustrationModal');

              // console.log(this.selectedStep);
              this.selectedStep.buttonList = [];
              console.log('Accept Illustration  successful.');
            } else {
              this.error(successResponse['message']), undefined, true;
            }
            console.log(successResponse['message']);
          },
          (error) => {
            this.postAcceptIllustrationError(error);
            this.service.hideLoader(false, buttonId);
            console.log('Accept Illustration failed.');
            console.log('Error:', error);
          }
        );
        this.setSelectedStep(this.selectedStep);
      }, 1);
    } else if (
      this.service.responseIO.data.BasePlan != undefined &&
      this.service.responseIO.data.BasePlan.productTypeCd == 'COMBO' &&
      this.selectedStep.id == 'step_coverageDet' &&
      this.childComboMap.size > 0
    ) {
      this.childComboMap.forEach((childComboService: QuotationService) => {
        childComboService.process(childComboService.id, childComboService.getResponseModelNameList()).subscribe(
          (successResponse) => {
            if (successResponse['success'] == true) {
              console.log('Child combo record save successful.');
            } else {
              this.error(successResponse['message'], undefined, true);
            }
            console.log(successResponse['message']);
          },
          (error) => {
            console.log('Child combo record save failed.');
            console.log('Error:', error);
          }
        );
      });
    }
  }
  closeAcceptIllustrationModal() {
    this.closeModal('acceptIllustrationModal');
  }

  ngOnDestroy() {
    super.ngOnDestroy();
    this.isInvalidMessage = false;
  }

  postAcceptIllustration(successResponse: Object) {}
  postAcceptIllustrationError(error: any) {}

  onChildComboChange(childQuotationService) {
    this.childComboMap.set(childQuotationService.responseIO.data.Entity.id, childQuotationService);
    console.log('childComboMap -', this.childComboMap);
  }

  protected viewLead_click(buttonClicked: { id: string; link: string }) {
    this.service.getLeadSeq(this.service.responseIO.data.Entity.leadId).subscribe(
      (successResponse) => {
        let responseIO: any = JSON.parse(JSON.stringify(successResponse));
        if (responseIO.data?.leadSeq != undefined) {
          let url = 'lead/' + responseIO.data.leadSeq;
          this.showWindow(url, 100, 300);
        }
      },
      (error) => {
        console.log('Error:', error);
      }
    );
  }
  protected viewEApp_click(buttonClicked: { id: string; link: string }) {
    let url = 'policy/' + this.service.responseIO.data.Entity?.policySeq;
    this.showWindow(url, 100, 300);
  }
}
