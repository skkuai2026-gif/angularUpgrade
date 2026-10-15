import { Component, Input, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { CSASLGFIService } from '../service/csa-slgfi-service.service';
import { Router } from '@angular/router';
import { BaseComponent } from 'src/app/system-common/base/base.component';
import { SettingService } from 'src/app/system-common/services/setting.service';
declare const setSignatureHeight: any;

@Component({
  selector: 'sym-csa-slgfi-declaration',
  templateUrl: './csa-slgfi-declaration.component.html',
  styleUrls: ['./csa-slgfi-declaration.component.scss'],
  changeDetection: ChangeDetectionStrategy.Eager,
  standalone: false,
})
export class CSASLGFIDeclarationComponent extends BaseComponent<CSASLGFIService> implements OnInit {
  // @Input() selectedTab: string;
  serviceSignature: any;
  constructor(public service: CSASLGFIService, public router: Router, public settingService: SettingService) {
    super(service);
    this.serviceSignature = this.service.getSignature();
  }

  ngOnInit() {}

  setSignatureHeight() {
    setTimeout(() => {
      setSignatureHeight();
    }, 10);
  }
}
