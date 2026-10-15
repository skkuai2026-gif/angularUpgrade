import { Component, Input, OnChanges, OnInit, SimpleChanges, ChangeDetectionStrategy } from '@angular/core';
import { CSAService } from '../service/csa-service.service';
import { SettingService } from 'src/app/system-common/services/setting.service';
import { BaseComponent } from 'src/app/system-common/base/base.component';
import { FieldItem } from 'src/app/models/common/field-item';
import { NavigationLink } from 'src/app/models/common/navigation-link';

@Component({
  selector: 'sym-fna-data',
  templateUrl: './fna-data.component.html',
  styleUrls: ['../assets/css/fna.css', './fna-data.component.scss'],
  changeDetection: ChangeDetectionStrategy.Eager,
  standalone: false,
})
export class FnaDataComponent extends BaseComponent<CSAService> implements OnChanges {
  navigationLinkList: NavigationLink[];
  searchCriteriaforProposal: any;
  //  @Input() modelPath: string;
  public model: any;
  constructor(csaService: CSAService) {
    super(csaService);
    this.searchCriteriaforProposal = {
      'SearchProspectDO.fnaId': this.service.responseIO.data.Entity.fnaNum,
    };
  }
  ngOnInit(): void {
    this.loadNavigationLinkList();
    this.service.responseIO.data.FNAParty.FNAQuestionResponseList.forEach((fnaParty: any) => {
      fnaParty['objName'] = this.service.responseIO.data.FNAParty.FNAQuestionResponseList[0].objName;
    });
  }

  ngOnChanges(changes: SimpleChanges) {
    super.ngOnChanges(changes);
    this.loadNavigationLinkList();
  }

  protected loadNavigationLinkList() {
    this.navigationLinkList = [];
    let nav = new NavigationLink();

    nav.link = 'fna_Details_Body';
    nav.labelKey = 'PERSONALDETAILS';
    this.navigationLinkList.push(nav);

    nav = new NavigationLink();
    nav.link = 'financial_Details_Body';
    nav.labelKey = 'FINANCIALDETAILS';
    this.navigationLinkList.push(nav);
  }
}
