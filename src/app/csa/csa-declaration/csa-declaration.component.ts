import { Component, Input, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { CSAService } from '../service/csa-service.service';
import { Router } from '@angular/router';
import { BaseComponent } from 'src/app/system-common/base/base.component';
import { SettingService } from 'src/app/system-common/services/setting.service';
declare const setSignatureHeight: any;

@Component({
  selector: 'sym-csa-declaration',
  templateUrl: './csa-declaration.component.html',
  styleUrls: ['../assets/css/fna.css', './csa-declaration.component.scss'],
  changeDetection: ChangeDetectionStrategy.Eager,
  standalone: false,
})
export class CSADeclarationComponent extends BaseComponent<CSAService> implements OnInit {
  // @Input() selectedTab: string;
  serviceSignature: any;
  searchCriteriaforProposal: any;
  constructor(public service: CSAService, public router: Router, public settingService: SettingService) {
    super(service);
    this.serviceSignature = this.service.getSignature();
    this.searchCriteriaforProposal = {
      'SearchProspectDO.fnaId': this.service.responseIO.data.Entity.fnaNum,
    };
  }

  ngOnInit() {}

  setSignatureHeight() {
    setTimeout(() => {
      setSignatureHeight();
    }, 10);
  }
}
