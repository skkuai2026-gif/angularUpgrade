import { Component, OnInit, Input, Output, EventEmitter, ChangeDetectionStrategy } from '@angular/core';
import { BreadCrumb } from 'src/app/models/common/bread-crumb';
import { SettingService } from 'src/app/system-common/services/setting.service';
import { BusinessCommonService } from 'src/app/business-common/service/business-common.service';
import { BaseComponent } from 'src/app/system-common/base/base.component';
@Component({
  selector: 'sym-insurance-type-selection',
  templateUrl: './insurance-type-selection.component.html',
  styleUrls: ['./insurance-type-selection.component.scss'],
  changeDetection: ChangeDetectionStrategy.Eager,
  standalone: false,
})
export class InsuranceTypeSelectionComponent extends BaseComponent<BusinessCommonService> {
  /**
   * It expects JSON Object of BreadCrumb Which is rendered on the top of the page
   * which helps in navigating the page
   */

  @Input() breadCrumbList: BreadCrumb[];

  /**
   * It provides the router link that should be navigated to
   * Example: '/policy-search'
   */

  @Input() searchRouterLink: string;

  @Output() notifyInsuranceTypeSelect = new EventEmitter<string>();
  public respInsuranceTypeList;
  constructor(public businessCommonService: BusinessCommonService, public settingService: SettingService) {
    super(businessCommonService);
  }

  ngOnInit() {
    this.setInsuranceTypeList();
  }

  public onInsuranceTypeClick(type: string) {
    this.settingService.setSessionStorageValue('insuranceTypeCd', type);
    this.notifyInsuranceTypeSelect.emit(type);
  }

  protected setInsuranceTypeList() {
    this.businessCommonService.getInsuranceTypeList().subscribe((body) => {
      this.respInsuranceTypeList = JSON.parse(JSON.stringify(body));
    });
  }
}
