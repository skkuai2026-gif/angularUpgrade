import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  Output,
  SimpleChanges,
  ChangeDetectionStrategy,
} from '@angular/core';
import { Router } from '@angular/router';
import { BaseSearchComponent } from 'src/app/system-common/base-search/base-search.component';
import { PolicyService } from '../services/policy.service';

interface ProposalData {
  typeCdOfData: string;
  typeDescOfData: string;
  isSelected: boolean | 'indeterminate';
  roleCd?: string;
  partyGuid?: string;
  childDataList?: ProposalData[];
}

@Component({
  selector: '',
  template: '',
  changeDetection: ChangeDetectionStrategy.Eager,
  standalone: false,
})
export class CopyPolicyHandlerComponent extends BaseSearchComponent<PolicyService> implements OnChanges {
  @Input() showDataDesc: boolean;
  @Input() currentProposalService: any;

  @Output() copyPolicyDataArray = new EventEmitter<{ copyFromPolicySeq: number; proposalDataToBeCopied: any }>();

  public proposalDataToBeCopied: ProposalData[];
  public searchCriteriaData: any;
  public copyFromPolicySeq: number;
  public showSearchScreen: boolean;
  public isMobileViewRendered: boolean;
  public showProposalLink: boolean;

  public lookupProposalDataTypeList: any;
  constructor(public service: PolicyService, public router: Router) {
    super(service, router);
    this.proposalDataToBeCopied = [];
    this.copyFromPolicySeq = null;
    // this.showDataDesc = !this.service.isMobileViewRendered();
    this.isMobileViewRendered = this.service.isMobileViewRendered();
  }

  ngOnInit() {
    if (
      this.currentProposalService.companyFacets != undefined &&
      this.currentProposalService.companyFacets.data != undefined &&
      this.currentProposalService.companyFacets.data.COPYPOLICYDESC_UIFORMAT != undefined
    )
      this.showProposalLink = true;
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (
      changes['currentProposalService'] &&
      changes['currentProposalService'].currentValue &&
      (this.showSearchScreen === undefined || this.showSearchScreen == true)
    ) {
      let currentPolicySeq = this.currentProposalService.responseIO.data.Entity.id;
      this.searchCriteriaData = {
        'SearchPolicyDO.policySeq': currentPolicySeq,
      };
      this.showSearchScreen = true;
    }
    if (changes['showDataDesc'] && changes['showDataDesc'].currentValue) {
      if (this.isMobileViewRendered) this.showDataDesc = false;
    }
  }

  onSearchSelectClick(selectedOption: any) {
    let modelNameBodyList = this.service.getModelNameBodyList(['Proposer']);
    this.copyFromPolicySeq = selectedOption.policySeq;
    if (
      this.currentProposalService.responseIO.data.Proposer == undefined ||
      this.currentProposalService.responseIO.data.Proposer == null
    ) {
      this.service
        .load(this.currentProposalService.responseIO.data.Entity.id, modelNameBodyList)
        .subscribe((successResponse) => {
          let responseIO = JSON.parse(JSON.stringify(successResponse));
          this.currentProposalService.responseIO.data.Proposer = responseIO?.data?.Proposer;
          this.loadData();
        });
    } else {
      this.loadData();
    }
  }

  private loadData() {
    this.service.getLookupList('COPYPROPOSALOPTIONS').subscribe(
      (successResponse) => {
        this.lookupProposalDataTypeList = JSON.parse(JSON.stringify(successResponse)).data.values;
      },
      (error) => {
        console.log('Error:', error);
      }
    );
    let modelNameBodyList = this.service.getModelNameBodyList(this.getModelNameList());
    this.service.load(this.copyFromPolicySeq, modelNameBodyList).subscribe(
      (successResponse) => {
        this.service.responseIO = JSON.parse(JSON.stringify(successResponse));
        this.loadProposalCopyDataArray();
        this.showSearchScreen = false;
      },
      (error) => {
        console.log('Error:', error);
      }
    );
  }

  protected getModelNameList() {
    //made to be overidden to add additional model names
    return ['Proposer', 'PrimaryInsured', 'SupplementaryList', 'NomineeList', 'BasePlan', 'JointLife'];
  }

  public copy(): void {
    if (!this.isCheckboxChecked()) {
      this.warn(this.service.getMultilingualLabel('selectAtLeast1Option'));
    } else {
      this.confirm(
        this.service.getMultilingualLabel('copyPolicyConfirmation'),
        () => {
          // console.log('Data copied:', this.proposalDataToBeCopied);
          this.copyPolicyDataArray.emit({
            copyFromPolicySeq: this.copyFromPolicySeq,
            proposalDataToBeCopied: this.proposalDataToBeCopied,
          });
        },
        (error) => {
          console.log('Error:', error);
          console.log('Operation cancelled');
        }
      );
    }
  }

  public cancel(): void {
    console.log('Operation cancelled');
    this.showSearchScreen = true;
  }

  loadProposalCopyDataArray() {
    this.proposalDataToBeCopied = [];
    //Add Proposer Data only if the partyTypeCds match in both the policies
    if (
      this.currentProposalService.responseIO?.data?.Proposer?.partyTypeCd ==
      this.service.responseIO?.data?.Proposer?.partyTypeCd
    ) {
      this.proposalDataToBeCopied.push({
        typeCdOfData: 'copyProposerData',
        typeDescOfData: this.getPersonalData(this.service.responseIO.data.Proposer),
        isSelected: false,
        roleCd: this.service.responseIO.data.Proposer.roleCd,
        partyGuid: this.service.responseIO.data.Proposer.guid,
        childDataList: this.getChildDataList(this.service.responseIO.data.Proposer),
      });
    }
    if (
      this.currentProposalService.responseIO.data.Entity?.quoteProposerSameAsInsured == 'NO' &&
      this.service.responseIO.data.Entity?.quoteProposerSameAsInsured == 'NO'
    ) {
      this.proposalDataToBeCopied.push({
        typeCdOfData: 'copyPrimaryData',
        typeDescOfData: this.getPersonalData(this.service.responseIO.data.PrimaryInsured),
        isSelected: false,
        roleCd: this.service.responseIO.data.PrimaryInsured.roleCd,
        partyGuid: this.service.responseIO.data.PrimaryInsured.guid,
        childDataList: this.getChildDataList(this.service.responseIO.data.PrimaryInsured).filter(
          (child) => child.typeCdOfData !== 'copyEFormsData'
        ),
      });
    }
    //made to be overidden to add additional arrays
    this.postloadProposalCopyDataArray();
  }

  protected postloadProposalCopyDataArray() {
    // If supplementary list is present in current Policy then only we can copy Other Supplementary List to current Policy
    if (this.currentProposalService?.responseIO?.data?.SupplementaryList?.length > 0) {
      if (this.service.responseIO.data.SupplementaryList.length > 0) {
        for (let i = 0; i < this.service.responseIO.data.SupplementaryList.length; i++) {
          this.proposalDataToBeCopied.push({
            typeCdOfData: `${this.service.getMultilingualLabel('supplementary')} ${i + 1}`,
            typeDescOfData: this.getPersonalData(this.service.responseIO.data.SupplementaryList[i]),
            isSelected: false,
            roleCd: this.service.responseIO.data.SupplementaryList[i].roleCd,
            partyGuid: this.service.responseIO.data.SupplementaryList[i].guid,
          });
        }
      }
    }
    if (this.service.responseIO.data.NomineeList.length > 0) {
      for (let i = 0; i < this.service.responseIO.data.NomineeList.length; i++) {
        this.proposalDataToBeCopied.push({
          typeCdOfData: `${this.service.getMultilingualLabel('beneficiaryHeader')} ${i + 1}`,
          typeDescOfData: this.getPersonalData(this.service.responseIO.data.NomineeList[i]),
          isSelected: false,
          roleCd: this.service.responseIO.data.NomineeList[i].roleCd,
          partyGuid: this.getPartyGuid(this.service.responseIO.data.NomineeList[i]),
        });
      }
    }
  }

  //This function is to select all the checkboxes on the screen
  public selectAll(event: any) {
    const isSelected = event.target.checked;
    this.proposalDataToBeCopied.forEach((proposal) => {
      proposal.isSelected = isSelected;
      if (proposal.childDataList) {
        proposal.childDataList.forEach((child) => (child.isSelected = isSelected));
      }
    });
  }

  //This function is to get the Field Value (Using Metadata)
  protected getFieldData(model: any, field: string): string {
    return this.service.getModelFieldDataDesc(model, field);
  }

  public toggleParent(proposal: any) {
    if (proposal.childDataList) {
      const checked = proposal.isSelected;
      proposal.childDataList.forEach((child: any) => (child.isSelected = checked));
    }
  }

  public updateParentCheckState(proposalOption: any) {
    if (proposalOption.childDataList) {
      const totalChildOptions = proposalOption.childDataList.length;
      const selectedChildOptions = proposalOption.childDataList.filter((child: any) => child.isSelected).length;
      proposalOption.isSelected =
        totalChildOptions === selectedChildOptions ? true : selectedChildOptions > 0 ? 'indeterminate' : false;
    }
  }

  private isCheckboxChecked(): boolean {
    return this.proposalDataToBeCopied.some((proposal) => {
      if (proposal.isSelected) {
        return true;
      } else if (proposal.childDataList) {
        return proposal.childDataList.some((child) => child.isSelected);
      }
      return false;
    });
  }

  protected getPersonalData(model: any) {
    const partySameAsCd = model['partySameAsCd'];
    if (partySameAsCd === 'OTHER' || partySameAsCd == undefined || partySameAsCd == '') {
      const parts = [
        this.getFieldData(model, 'quotPartyAddtnField3'),
        this.getFieldData(model, 'genderCd'),
        this.getFieldData(model, 'birthDt'),
      ].filter((part) => part !== null && part !== undefined && part != '');
      return parts.join(', ');
    } else if (partySameAsCd != undefined) {
      return `Same as ${this.getFieldData(model, 'partySameAsCd')}`;
    } else {
      return '';
    }
  }

  protected getPartyGuid(model: any) {
    const partySameAsCd = model['partySameAsCd'];
    let partyModelKey: string;
    if (partySameAsCd == 'PROPOSER') partyModelKey = 'Proposer';
    else if (partySameAsCd == 'PRIMARY') partyModelKey = 'PrimaryInsured';
    else if (partySameAsCd == 'JOINT') partyModelKey = 'JointLife';
    if (partyModelKey) return this.service.responseIO.data[partyModelKey].guid;
    else return model.guid;
  }

  protected getChildDataList(model?: any): ProposalData[] {
    if (this.lookupProposalDataTypeList) {
      let childDataList = this.lookupProposalDataTypeList.map((lookup: any) => {
        let typeDescOfData: string = '';
        if (this.showDataDesc) {
          try {
            //Lookup cd should be the same as the name of the function for eg: copyPersonalData
            let functionName = lookup.cd;
            if (typeof this[functionName] === 'function') {
              typeDescOfData = eval('this.' + functionName + '(model)');
            }
          } catch (error) {
            console.log('Error:', error);
            console.log('Function ' + lookup.cd + ' not found ');
          }
        }
        return { typeCdOfData: lookup.cd, typeDescOfData: typeDescOfData, isSelected: false };
      });
      return childDataList;
    }
  }

  protected copyPersonalData(model: any): string {
    const parts = [
      this.getFieldData(model, 'fullName'),
      this.getFieldData(model, 'genderCd'),
      this.getFieldData(model, 'birthDt'),
      this.getFieldData(model, 'smoker'),
    ].filter((part) => part !== null && part !== undefined && part !== '');
    return parts.join(', ');
  }

  protected copyAddressData(model: any): string {
    const parts = [
      this.getFieldData(model.PermanentAddress, 'addressLine1Lang1'),
      this.getFieldData(model.PermanentAddress, 'cityCd'),
      this.getFieldData(model.ResidentalAddress, 'addressLine1Lang1'),
      this.getFieldData(model.ResidentalAddress, 'cityCd'),
      this.getFieldData(model.OfficeAddress, 'addressLine1Lang1'),
      this.getFieldData(model.OfficeAddress, 'cityCd'),
    ].filter((part) => part !== null && part !== undefined && part !== '');
    return parts.join(', ');
  }

  protected copyContactData(model: any): string {
    const parts = [
      this.getFieldData(model.MobileContact, 'contactNum'),
      this.getFieldData(model.PersonalEmail, 'emailAddress'),
    ].filter((part) => part !== null && part !== undefined && part !== '');
    return parts.join(', ');
  }

  protected copyEmploymentData(model: any): string {
    const parts = [
      this.getFieldData(model.Employment, 'industryCd'),
      this.getFieldData(model.Employment, 'natureOfDuty'),
      this.getFieldData(model.Employment, 'occupationCd'),
    ].filter((part) => part !== null && part !== undefined && part !== '');
    return parts.join(', ');
  }

  protected copyIdentityData(model: any): string {
    const parts =
      model.IdentityList?.map(
        (identity: any) =>
          this.getFieldData(identity, 'identityTypeCd') + ` (${this.getFieldData(identity, 'identityNum')})`
      ) || [];
    return parts
      .filter((part) => part !== null && !part.includes('()') && part !== undefined && part !== '')
      .join(', ');
  }

  protected copyIncomeData(model: any): string {
    const parts =
      model.OtherIncomeList?.map(
        (income: any) =>
          `${this.getFieldData(income, 'incomeTypeCd')} (${this.getFieldData(income, 'sourceOfIncome')})`
      ) || [];
    return parts
      .filter((part) => part !== null && !part.includes('()') && part !== undefined && part !== '')
      .join(', ');
  }

  protected copyQuestionnaireData(model: any): string {
    return '';
  }

  protected copyDocumentData(model: any): string {
    return '';
  }

  public showProposalDataDesc() {
    let url = 'copypolicy/' + this.service.responseIO.data.Entity.id;
    super.showWindow(url, this.isMobileViewRendered ? 500 : 100, this.isMobileViewRendered ? 15 : 300);
  }
}
