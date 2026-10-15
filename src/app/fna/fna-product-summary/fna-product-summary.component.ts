import { Component, Input, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { BaseComponent } from 'src/app/system-common/base/base.component';
import { FnaService } from '../service/fna-service.service';
import { SettingService } from 'src/app/system-common/services/setting.service';

@Component({
  selector: 'sym-fna-product-summary',
  templateUrl: './fna-product-summary.component.html',
  styleUrls: ['../assets/css/fna.css', './fna-product-summary.component.scss'],
  changeDetection: ChangeDetectionStrategy.Eager,
  standalone: false,
})
export class FnaProductSummaryComponent extends BaseComponent<FnaService> implements OnInit {
  // @Input() selectedTab: string;
  constructor(public service: FnaService, public settingService: SettingService) {
    super(service);
  }

  ngOnInit() {}
}
