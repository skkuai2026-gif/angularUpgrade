import { TabItem } from './../../models/common/tab-items';
import { Component, OnInit, OnChanges, SimpleChanges, Input, ChangeDetectionStrategy } from '@angular/core';
import { QuotationService } from '../services/quotation.service';
import { QuotationRiderCardHandlerComponent } from './quotation-rider-card.handler';
import { FieldItem } from 'src/app/models/common/field-item';

@Component({
  selector: 'sym-quotation-rider-card',
  templateUrl: './quotation-rider-card.component.html',
  styleUrls: ['./quotation-rider-card.component.scss'],
  changeDetection: ChangeDetectionStrategy.Eager,
  standalone: false,
})
export class QuotationRiderCardComponent extends QuotationRiderCardHandlerComponent implements OnChanges {
  @Input() responseUpdated: boolean;
  selectedTab: TabItem;
  tabList: TabItem[];
  isEditClicked: boolean;
  selectedRider: any;

  constructor(quotationService: QuotationService) {
    super(quotationService);
  }

  ngOnInit() {
    super.ngOnInit();
  }

  ngOnChanges(changes: SimpleChanges) {
    super.ngOnChanges(changes);
  }

  public onRiderChanged(fieldItem: FieldItem): void {
    this.service.setModelFieldValue(this.service.responseIO.data.Entity, 'quotAddtnlField10', null);
    super.onRiderChanged(fieldItem);
  }
  public setCurrentRider() {
    // if (this.selectedRider == undefined) return;
    this.service.responseIO.data.RiderList.forEach((rider: any) => {
      //need to set the objname for the name field since used in automated testing
      rider['objName'] = this.service.responseIO.data.RiderList[0].objName;
      if (this.selectedRider != undefined && rider.guid == this.selectedRider.guid) this.selectedRider = rider;
    });
  }
  protected getRiderTabList() {
    this.tabList = [];
    let riderIndex = 0;
    let length = 0;
    this.service.responseIO.data.RiderList.forEach((rider: any) => {
      rider['objName'] = this.service.responseIO.data.RiderList[0].objName;
      let isExist: boolean;
      isExist = false;
      if (length !== 0) {
        for (let index = 0; index < length; index++) {
          if (this.tabList[index] != undefined && this.tabList[index].id === rider.insuredPartyRefGuid) {
            isExist = true;
            break;
          }
        }
      }

      if (length == 0 || !isExist) {
        let tab = new TabItem();
        tab.id = rider.insuredPartyRefGuid;
        tab.text = rider.insuredPartyName;
        tab.index = riderIndex;
        this.tabList[riderIndex] = tab;
        if (rider.status == 'D' || rider.removed == 'YES') tab.visible = false;
        riderIndex++;
        length = this.tabList.length;
      }
      rider['errorExists'] = this.service.getErrorCount(rider);
      // if (this.selectedRider != undefined && this.selectedRider.guid == rider.guid) {
      //   this.closeModal('riderEditor');
      //   setTimeout(() => {
      //     this.onEditBtnClick(rider);
      //   }, 5);
      // }
    });
    this.tabList[0].isSelected = true;
    this.selectedTab = this.tabList[0];

    // console.log(this.tabList);
  }
}
