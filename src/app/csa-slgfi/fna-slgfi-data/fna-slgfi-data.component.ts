import { Component, Input, OnChanges, OnInit, SimpleChanges, ChangeDetectionStrategy } from '@angular/core';
import { CSASLGFIService } from '../service/csa-slgfi-service.service';
import { SettingService } from 'src/app/system-common/services/setting.service';
import { BaseComponent } from 'src/app/system-common/base/base.component';
import { FieldItem } from 'src/app/models/common/field-item';
import { NavigationLink } from 'src/app/models/common/navigation-link';

@Component({
  selector: 'sym-fna-slgfi-data',
  templateUrl: './fna-slgfi-data.component.html',
  styleUrls: ['./fna-slgfi-data.component.scss'],
  changeDetection: ChangeDetectionStrategy.Eager,
  standalone: false,
})
export class FnaSLGFIDataComponent extends BaseComponent<CSASLGFIService> implements OnChanges {
  navigationLinkList: NavigationLink[];
  // @Input() modelPath: string;
  public model: any;
  searchCriteriaforProposal: any;
  constructor(csaService: CSASLGFIService) {
    super(csaService);
  }
  ngOnInit(): void {
    this.loadNavigationLinkList();
    this.service.responseIO.data.FNAParty.FNAQuestionResponseList.forEach((fnaParty: any) => {
      fnaParty['objName'] = this.service.responseIO.data.FNAParty.FNAQuestionResponseList[0].objName;
    });
    this.service.responseIO.data.FNARequestAdditionalAllList.forEach((fnaParty: any) => {
      fnaParty['objName'] = this.service.responseIO.data.FNARequestAdditionalAllList[0].objName;
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
