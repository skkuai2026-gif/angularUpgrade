import { Component, Input, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { FnaService } from '../service/fna-service.service';
import { SettingService } from 'src/app/system-common/services/setting.service';
import { BaseComponent } from 'src/app/system-common/base/base.component';

@Component({
  selector: 'sym-fna-recommendation',
  templateUrl: './fna-recommendation.component.html',
  styleUrls: ['../assets/css/fna.css', './fna-recommendation.component.scss'],
  changeDetection: ChangeDetectionStrategy.Eager,
  standalone: false,
})
export class FnaRecommendationComponent extends BaseComponent<FnaService> implements OnInit {
  // @Input() selectedTab: string;
  productCategory;
  constructor(public service: FnaService, public settingService: SettingService) {
    super(service);
  }

  ngOnInit() {}

  onProductClick(value) {
    this.productCategory = value;
  }
}
