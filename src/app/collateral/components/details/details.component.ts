import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CollateralServiceService } from '../../service/collateral-service.service';
import { BreadCrumb } from './../../../models/common/bread-crumb';

@Component({
  selector: 'sym-details',
  templateUrl: './details.component.html',
  styleUrls: ['../../assets/css/collateral_css.css', './details.component.scss'],
  changeDetection: ChangeDetectionStrategy.Eager,
  standalone: false,
})
export class DetailsComponent implements OnInit {
  constructor(
    private readonly activatedRoute: ActivatedRoute,
    private collateralServiceService: CollateralServiceService
  ) {}
  // arrType: string[];
  arrType: any[];
  public selectedModule;
  public selectedFeature;
  public selectedId;
  public thisType;
  public thisFeature;
  public thisDetail;
  public breadCrumbList: BreadCrumb[];
  public breadCrumArray: any;

  ngOnInit() {
    this.selectedModule = this.activatedRoute.snapshot.paramMap.get('module_name');
    this.selectedFeature = this.activatedRoute.snapshot.paramMap.get('feature');
    this.selectedId = this.activatedRoute.snapshot.paramMap.get('id');
    var sType = this.selectedModule;
    var sFeature = this.selectedFeature;
    var sId = this.selectedId;
    this.collateralServiceService.getJSON().subscribe((data) => {
      this.thisType = data.data.types.filter(function (item) {
        return item.id == sType;
      });
      this.thisFeature = this.thisType[0].sub_types.filter(function (item) {
        return item.id == sFeature;
      });
      this.thisDetail = this.thisFeature[0].features.filter(function (item) {
        return item.id == sId;
      });
      // this.arrType = this.thisDetail[0].details as string[];
      this.arrType = this.thisDetail[0].details;

      this.breadCrumArray = [
        {
          id: 'Home',
          link: '/home',
        },
        {
          id: 'Collateral',
          link: '/collateral',
        },
        {
          id: this.thisType[0].name,
          link: '/collateral/sub_types/' + this.thisType[0].id,
        },
        {
          id: this.thisFeature[0].name,
          link: '/collateral/features/' + this.thisType[0].id + '/' + this.thisFeature[0].id,
        },
        {
          id: this.thisDetail[0].name,
        },
      ];
      this.breadCrumbList = this.getBreadCrumbList(this.breadCrumArray);
    });
  }

  protected getBreadCrumbList(bcArray): BreadCrumb[] {
    return bcArray;
  }
}
