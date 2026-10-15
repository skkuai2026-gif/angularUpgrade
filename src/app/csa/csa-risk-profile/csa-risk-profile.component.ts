import {
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
  SimpleChanges,
  ChangeDetectionStrategy,
} from '@angular/core';
import { CSAService } from '../service/csa-service.service';
import { SettingService } from 'src/app/system-common/services/setting.service';
import { BaseComponent } from 'src/app/system-common/base/base.component';
import { HttpClient } from '@angular/common/http';
import { FieldItem } from 'src/app/models/common/field-item';
import { NavigationLink } from 'src/app/models/common/navigation-link';

@Component({
  selector: 'sym-csa-risk-profile',
  templateUrl: './csa-risk-profile.component.html',
  styleUrls: ['../assets/css/fna.css', './csa-risk-profile.component.scss'],
  changeDetection: ChangeDetectionStrategy.Eager,
  standalone: false,
})
export class CSARiskProfileComponent extends BaseComponent<CSAService> {
  // @Input() selectedTab: string;
  navigationLinkList: NavigationLink[];
  searchCriteriaforProposal: any;
  @Output() computeRiskScoreClick = new EventEmitter<any>();
  fundRiskClassLabel: any;
  fundRiskClass: string;
  fundTablehtml: any;
  newProdList = [];
  showFundTable: boolean = false;
  isRiskFundApplicable: boolean = false;
  userData: any;
  agentID: any;
  constructor(public service: CSAService, public settingService: SettingService) {
    super(service);
    this.searchCriteriaforProposal = {
      'SearchProspectDO.fnaId': this.service.responseIO.data.Entity.fnaNum,
    };
  }

  ngOnInit() {
    this.service.responseIO.data.LeadRPQ.RPQResponseList.forEach((fnaParty: any) => {
      fnaParty['objName'] = this.service.responseIO.data.LeadRPQ.RPQResponseList[0].objName;
    });
    this.userData = this.service.getUserLoginData();
    this.agentID = this.userData?.['UserId'];
    this.service.getRiskFundApplicable(this.agentID).subscribe((resp) => {
      var respData = JSON.parse(JSON.stringify(resp));
      // console.log('respData', respData);
      this.service.isRiskFundApplicableFlag = respData.data.isRiskFundApplicable;
      if (this.service.isRiskFundApplicableFlag === true) {
        this.isRiskFundApplicable = true;
      } else {
        this.isRiskFundApplicable = false;
      }
      // console.log('Get search list failed.');
      // console.log('Error:', error);
    });
    if (this.service.responseIO.data.LeadRPQ != undefined) {
      if (
        this.service.responseIO.data.LeadRPQ.address1 != 'INDIVIDUAL' &&
        this.service.responseIO.data.LeadRPQ.address1 != null &&
        this.service.responseIO.data.LeadRPQ.address1 != '' &&
        this.service.isRiskFundApplicableFlag == true
      ) {
        this.service.setFieldReadOnly(this.service.responseIO.data.LeadRPQ, 'education', 'NO');
        this.service.setFieldReadOnly(this.service.responseIO.data.LeadRPQ, 'incomeGroup', 'NO');
      }
    }
    this.fundRiskClassLabel = undefined;
    this.fundRiskClass = undefined;
    this.loadNavigationLinkList();
    if (this.service.responseIO.data.LeadRPQ == '') {
      this.service.setModelFieldValue(this.service.responseIO.data.LeadRPQ, 'rpqScore', 0);
    }
    this.computeRiskScore(false);
  }

  ngOnChanges(changes: SimpleChanges) {
    super.ngOnChanges(changes);
    this.loadNavigationLinkList();
    this.service.setFieldReadOnly(this.service.responseIO.data.LeadRPQ, 'education', 'NO');
    this.service.setFieldReadOnly(this.service.responseIO.data.LeadRPQ, 'incomeGroup', 'NO');
    // this.service.setFieldVisible(this.service.responseIO.data.LeadRPQ,'otherTitle','NO');
    // this.service.setFieldVisible(this.service.responseIO.data.LeadRPQ,'closureNotes','NO');
  }

  protected loadNavigationLinkList() {
    this.navigationLinkList = [];
    let nav = new NavigationLink();

    nav.link = 'rpq_Details_Body';
    nav.labelKey = 'RPQDETAILS';
    this.navigationLinkList.push(nav);

    nav = new NavigationLink();
    nav.link = 'rpq_score';
    nav.labelKey = 'RPQSCORE';
    this.navigationLinkList.push(nav);
    console.log('compute Risk Score', this.navigationLinkList);

    nav = new NavigationLink();
    nav.link = 'fund_option';
    nav.labelKey = 'FUNDOPTIONS';
    this.navigationLinkList.push(nav);
  }

  public score_change() {
    this.service.setModelFieldValue(this.service.responseIO.data.LeadRPQ, 'rpqScore', 0);
    this.service.setModelFieldValue(this, 'fundRiskClassLabel', null);
    this.service.setModelFieldValue(this, 'fundRiskClass', null);
    this.service.setModelFieldValue(this.service.responseIO.data.LeadRPQ, 'address1', null);
    this.service.setModelFieldValue(this.service.responseIO.data.LeadRPQ, 'education', null);
    this.service.setModelFieldValue(this.service.responseIO.data.LeadRPQ, 'incomeGroup', null);
    this.service.setModelFieldValue(this.service.responseIO.data.LeadRPQ, 'otherTitle', null);
    this.service.setFieldVisible(this.service.responseIO.data.LeadRPQ, 'otherTitle', 'NO');
    this.service.setFieldVisible(this.service.responseIO.data.LeadRPQ, 'closureNotes', 'NO');
    // this.service.responseIO.metadata[this.service.responseIO.data.LeadRPQ['guid']]['otherTitle'].VISIBILITY=='NO'
    this.service.setModelFieldValue(this.service.responseIO.data.LeadRPQ, 'nationality', null);
    this.fundTablehtml = null;

    // this.computeRiskScore();
  }

  computeRiskScore(saveFlag?: boolean) {
    let rpqScore = 0;
    this.service.responseIO.data.LeadRPQ.RPQResponseList.forEach((resp) => {
      if (resp.score != null) {
        rpqScore += Number(resp.score);
      }
    });

    this.service.setModelFieldValue(this.service.responseIO.data.LeadRPQ, 'rpqScore', rpqScore);
    // if (saveFlag === undefined || saveFlag) this.computeRiskScoreClick.emit(rpqScore);

    this.service.computeRiskScore(rpqScore).subscribe(
      (respCompute) => {
        if (respCompute?.data?.fundRiskClassLabel) {
          this.fundRiskClassLabel = respCompute.data.fundRiskClassLabel;
          this.fundRiskClass = respCompute.data.fundRiskClass;

          this.fundTablehtml = respCompute.data.FundTable;
          console.log('FundTable', this.fundTablehtml);
          // this.service.setModelFieldValue(this.service.responseIO.data.LeadRPQ, 'address1', null);
          // this.service.setModelFieldValue(this.service.responseIO.data.LeadRPQ, 'education', null);
          // this.service.setModelFieldValue(this.service.responseIO.data.LeadRPQ, 'incomeGroup', null)
          // this.service.setModelFieldValue(this.service.responseIO.data.LeadRPQ, 'otherTitle', null)

          // this.showFundTable = this.fundTablehtml;
        } else {
          // this.showFundTable = false;
        }
      },
      (error) => {
        console.error('Error in computeRiskScore', error);
        this.showFundTable = false;
      }
    );
  }

  protected address1_focus(item: FieldItem) {
    this.service
      .getpopulateFundListbasisRiskProfile(
        this.service.fundRiskClassLabel,
        this.service.responseIO.data.LeadRPQ.rpqScore
      )
      .subscribe(
        (successResponse) => {
          let responseJson = JSON.parse(JSON.stringify(successResponse));

          const fundMap = responseJson.data.FundListbasisRiskProfile;
          let codeKey = Object.keys(fundMap)[0].trim();
          codeKey = codeKey.replace(/[\[\]]/g, '');

          const codeArray = codeKey.split(',').map((code) => code.trim());
          const descArray = fundMap[Object.keys(fundMap)[0]];

          this.newProdList = codeArray.map((code, index) => ({
            cd: code,
            desc: descArray[index],
          }));

          // console.log('newProdList106', this.newProdList[0])
          let respAddress1Cd: any;
          respAddress1Cd = JSON.parse(JSON.stringify(this.newProdList));
          this.service.setItemOptions(item, respAddress1Cd, false);
          // this.address1_change(this.newProdList[0]);
          // if (this.newProdList[0]?.cd === 'NOFUNDPACKAGE') {
          //   console.log('inif condition 118')
          //   this.showFundTable = false;
          // } else {
          //   console.log('in else condition 119')
          //   this.showFundTable = true;}
        },
        (error) => {
          console.log('Error:', error);
        }
      );
  }
  selectFundOptionWithoutIndiviual(selected: any) {
    selected = selected.fieldValue;
    this.service.selectFundListOptionWithoutIndiviual(selected).subscribe(
      (successResponse) => {
        let responseJson = JSON.parse(JSON.stringify(successResponse));
        let respEducationCd: any;
        respEducationCd = responseJson.data.FundListCd;
        console.log('respEducationCd  1500', respEducationCd);
        const fundString = respEducationCd.join(',');
        console.log('fundString  1500', fundString);

        // this.service.setFieldReadOnly(this.service.responseIO.data.LeadRPQ, 'education', 'NO');
        // this.service.setFieldReadOnly(this.service.responseIO.data.LeadRPQ, 'incomeGroup', 'NO');

        // const educationOptions = respEducationCd.map((desc, index) => ({
        //   cd: desc,
        //   desc: desc,
        //   isDef: index === 0 ? 1 : 0
        // }));
        // console.log('educationOptions163:::',educationOptions);

        this.service.setModelFieldValue(this.service.responseIO.data.LeadRPQ, 'education', fundString);
        this.service.setModelFieldValue(this.service.responseIO.data.LeadRPQ, 'incomeGroup', fundString);
        this.service.setFieldReadOnly(this.service.responseIO.data.LeadRPQ, 'education', 'NO');
        this.service.setFieldReadOnly(this.service.responseIO.data.LeadRPQ, 'incomeGroup', 'NO');
        this.service.setFieldVisible(this.service.responseIO.data.LeadRPQ, 'otherTitle', 'NO');
        this.service.setFieldVisible(this.service.responseIO.data.LeadRPQ, 'nationality', 'NO');
      },
      (error) => {
        console.log('Error:', error);
      }
    );
  }

  address1_change(selected: any): void {
    this.service.setModelFieldValue(this.service.responseIO.data.LeadRPQ, 'education', null);
    this.service.setModelFieldValue(this.service.responseIO.data.LeadRPQ, 'incomeGroup', null);
    if (selected.fieldValue !== 'INDIVIDUAL' && !selected.fieldValue?.includes('INDIVIDUAL')) {
      this.selectFundOptionWithoutIndiviual(selected);
    } else {
      this.service.setFieldReadOnly(this.service.responseIO.data.LeadRPQ, 'education', 'YES');
      this.service.setFieldReadOnly(this.service.responseIO.data.LeadRPQ, 'incomeGroup', 'YES');
      this.service.setFieldVisible(this.service.responseIO.data.LeadRPQ, 'otherTitle', 'NO');
      this.service.setFieldVisible(this.service.responseIO.data.LeadRPQ, 'closureNotes', 'NO');
      this.service.setModelFieldValue(this.service.responseIO.data.LeadRPQ, 'nationality', null);
      this.service.setFieldVisible(this.service.responseIO.data.LeadRPQ, 'nationality', 'NO');
      // this.service.setModelFieldValue(this.service.responseIO.data.LeadRPQ, 'education', null);
      // this.service.setModelFieldValue(this.service.responseIO.data.LeadRPQ, 'incomeGroup', null)
    }
  }
  otherTitle_change(selected: any): void {
    if (this.settingService.getApplicationMode() === 'offline') {
      if (this.service.responseIO.data.LeadRPQ != undefined) {
        if (
          this.service.responseIO.data.LeadRPQ.address1 != 'INDIVIDUAL' &&
          this.service.responseIO.data.LeadRPQ.address1 != null &&
          this.service.isRiskFundApplicableFlag == true
        ) {
          this.service.setFieldReadOnly(this.service.responseIO.data.LeadRPQ, 'education', 'NO');
          this.service.setFieldReadOnly(this.service.responseIO.data.LeadRPQ, 'incomeGroup', 'NO');
        }
      }
    }
  }

  education_focus(item: FieldItem) {
    this.agentID = this.userData?.['UserId'];

    this.service.getRPQFunds(this.agentID, item);
  }

  incomeGroup_focus(item: FieldItem) {
    this.agentID = this.userData?.['UserId'];
    this.service.getRPQFunds(this.agentID, item);
  }
}
