import { Component, Input, OnChanges, OnInit, SimpleChanges, ChangeDetectionStrategy } from '@angular/core';
import { BaseComponent } from 'src/app/system-common/base/base.component';
import { OccupationIndustryDutyService } from '../service/occupation-industry-duty.service';
import { SettingService } from 'src/app/system-common/services/setting.service';
import { FieldItem } from 'src/app/models/common/field-item';
import { BaseService } from 'src/app/system-common/services/base.service';

@Component({
  selector: 'sym-industry-occupation',
  templateUrl: './industry-occupation.component.html',
  styleUrls: ['./industry-occupation.component.scss'],
  changeDetection: ChangeDetectionStrategy.Eager,
  standalone: false,
})
export class IndustryOccupationComponent
  extends BaseComponent<OccupationIndustryDutyService>
  implements OnChanges
{
  @Input() public service: any;
  @Input() public model: any;

  public isOccupationIndustryDutySearchDisplayed: boolean;
  protected industryFieldItems: FieldItem[];
  public industrySelectedOption: any;

  constructor(
    public occupationIndustryDutyService: OccupationIndustryDutyService,
    public settingService: SettingService
  ) {
    super(occupationIndustryDutyService);
    this.industryFieldItems = [];
    this.occupationIndustryDutyService.industryFieldItems = [];
  }

  ngOnInit(): void {
    this.industryFieldItems = [];
    this.occupationIndustryDutyService.industryFieldItems = [];
  }
  ngOnChanges(changes: SimpleChanges) {
    super.ngOnChanges(changes);
    if (changes['model'] && changes['model'].currentValue) {
      this.occupationIndustryDutyService.model = this.model;
    }
  }

  public onOccupationIndustrySearchSelected(selectedOption) {
    //here copy the industry, occupation , nature of duty from selected options and copy to the model
    //since property names match written in for loop.
    // Object.keys(selectedOption).forEach((item) => {
    //     if (this.model.hasOwnProperty(item))
    //         this.model[item] = selectedOption[item];
    // });
    this.industrySelectedOption = selectedOption;
    this.service.setModelFieldValue(this.model, 'industryCd', selectedOption['industryCd']);
    setTimeout(() => {
      this.getNatureOfDuty();
    }, 5);
  }

  getNatureOfDuty(item?: FieldItem) {
    let natureOfDutyItem =
      item != undefined
        ? item
        : this.industryFieldItems.find((field: FieldItem) => field.fieldCd == 'natureOfDuty');
    this.occupationIndustryDutyService
      .getNatureOfDutyObject(natureOfDutyItem, this.industrySelectedOption)
      .subscribe(
        (body) => {
          let respNatureOfDuty: any;
          respNatureOfDuty = JSON.parse(JSON.stringify(body));

          if (this.industrySelectedOption != undefined) {
            this.service.setItemOptions(natureOfDutyItem, respNatureOfDuty.data.values, true);
            this.service.setModelFieldValue(
              natureOfDutyItem.model,
              'natureOfDuty',
              this.industrySelectedOption['natureOfDuty']
            );
            this.getOccupationCd();
          } else {
            setTimeout(() => {
              this.service.setItemOptions(natureOfDutyItem, respNatureOfDuty.data.values, true);
              this.getOccupationCd();
            }, 50);
          }
        },
        (error) => {
          console.log('Error:', error);
        }
      );
  }

  getOccupationCd(item?: FieldItem) {
    let occupationItem =
      item != undefined
        ? item
        : this.industryFieldItems.find((field: FieldItem) => field.fieldCd == 'occupationCd');
    if (occupationItem != undefined) {
      this.occupationIndustryDutyService
        .getOccupationCdObject(occupationItem, this.industrySelectedOption)
        .subscribe(
          (body) => {
            let respOccupationCd: any;
            respOccupationCd = JSON.parse(JSON.stringify(body));
            setTimeout(() => {
              this.service.setItemOptions(occupationItem, respOccupationCd.data.values, true);
              if (this.industrySelectedOption != undefined) {
                this.service.setModelFieldValue(
                  this.model,
                  'industryCd',
                  this.industrySelectedOption['industryCd']
                );
                this.service.setModelFieldValue(
                  this.model,
                  'natureOfDuty',
                  this.industrySelectedOption['natureOfDuty']
                );
                this.service.setModelFieldValue(
                  this.model,
                  'occupationCd',
                  this.industrySelectedOption['occupationCd']
                );
              }
            }, 10);
          },
          (error) => {
            console.log('Error:', error);
          }
        );
    }
  }
  public onOccupationIndustryDutySearchClick(field: FieldItem) {
    this.industrySelectedOption = undefined;
    this.isOccupationIndustryDutySearchDisplayed = true;
    setTimeout(() => {
      let id = this.model == undefined ? field.model.guid : this.model.guid;
      this.openModal('OccupationIndustryDutySearch' + id);
    }, 20);
  }

  public onIndustryFieldsCreated(fieldItemArray: FieldItem[]) {
    if (this.industryFieldItems != undefined) {
      fieldItemArray.filter((item) => {
        let index = this.industryFieldItems.findIndex((field: FieldItem) => field.fieldCd == item.fieldCd);
        let isAvailable = this.industryFieldItems.find((field: FieldItem) => field.fieldCd == item.fieldCd);
        if (!isAvailable) this.industryFieldItems.push(item);
        if (isAvailable) this.industryFieldItems[index] = item;
      });
    } else {
      this.industryFieldItems = fieldItemArray;
    }
  }

  protected industryCd_change(item: FieldItem) {
    this.service.setModelFieldValue(item.model, 'natureOfDuty', undefined);
    this.service.setModelFieldValue(item.model, 'occupationCd', undefined);
    if (this.industryFieldItems != undefined) {
      let natureOfDutyFieldItem: FieldItem;
      this.industryFieldItems.filter((industryFieldItem: FieldItem) => {
        if (industryFieldItem.fieldCd == 'natureOfDuty') natureOfDutyFieldItem = industryFieldItem;
      });
      if (natureOfDutyFieldItem != undefined) this.getNatureOfDuty();
      if (item != undefined && natureOfDutyFieldItem != undefined) this.getNatureOfDuty();
    }
  }

  protected natureOfDuty_change(item: FieldItem) {
    if (this.industryFieldItems != undefined) {
      let occupationCdFieldItem: FieldItem;
      this.industryFieldItems.filter((industryFieldItem: FieldItem) => {
        if (industryFieldItem.fieldCd == 'occupationCd') occupationCdFieldItem = industryFieldItem;
      });
      if (occupationCdFieldItem != undefined) this.getOccupationCd(occupationCdFieldItem);
    }
  }
}
