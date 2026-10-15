import { Component, OnChanges, SimpleChanges, ChangeDetectionStrategy } from '@angular/core';
import { PageHeader } from 'src/app/models/common/page-header';
import { TabItem } from 'src/app/models/common/tab-items';
import { BaseComponent } from 'src/app/system-common/base/base.component';
import { HeaderService } from 'src/app/system-common/services/header.service';
import { CollateralProductService } from '../services/collateral-product.service';

@Component({
  selector: 'sym-collateral-product-main',
  templateUrl: './collateral-product-main.component.html',
  styleUrls: ['./collateral-product-main.component.scss'],
  changeDetection: ChangeDetectionStrategy.Eager,
  standalone: false,
})
export class CollateralProductMainComponent extends BaseComponent<CollateralProductService> implements OnChanges {
  selectedTab: TabItem;
  tabList: TabItem[];
  collateralBodyList: any;
  constructor(collateralProductService: CollateralProductService, public headerService?: HeaderService) {
    super(collateralProductService);
    // console.log(this.service.responseIO);
  }

  ngOnChanges(changes: SimpleChanges) {
    super.ngOnChanges(changes);
  }

  ngOnInit() {
    if (this.headerService != undefined) this.headerService.pageHeader = this.getPageHeader();
    this.initCollateralHeaderList();
  }

  setTab(tab: TabItem) {
    this.selectedTab = tab;
    if (tab != undefined) this.setCollateralBody();
  }

  protected initCollateralHeaderList() {
    this.service.getCollateralRenderLevelList().subscribe(
      (body) => {
        let response: any;
        response = JSON.parse(JSON.stringify(body));
        this.initTabList(response.data.collateralRenderLevelList);
      },
      (error) => {
        console.log('Error:', error);
      }
    );
  }

  protected initTabList(response: any) {
    this.getTabList(response);
    this.selectedTab = this.tabList[0];
    this.tabList[0].isSelected = true;
    this.setCollateralBody();
  }

  protected getTabList(response: any): TabItem[] {
    this.tabList = [];
    response.forEach((collateralHeaderLevel) => {
      let tab = new TabItem();
      tab.id = collateralHeaderLevel.levelCd;
      tab.text = collateralHeaderLevel.header1;
      this.tabList.push(tab);
    });
    return this.tabList;
  }

  protected setCollateralBody() {
    this.service.getCollateralRenderLevelList(this.selectedTab.id).subscribe(
      (body) => {
        let response: any;
        response = JSON.parse(JSON.stringify(body));
        this.collateralBodyList = response.data.collateralRenderLevelList;
      },
      (error) => {
        console.log('Error:', error);
      }
    );
  }

  protected getPageHeader() {
    let header = new PageHeader();
    header.title = 'Collateral';
    return header;
  }
}
