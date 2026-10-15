import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';

@Component({
  selector: 'sym-test-rest-api',
  templateUrl: './test-rest-api.component.html',
  styleUrls: ['./test-rest-api.component.scss'],
  changeDetection: ChangeDetectionStrategy.Eager,
  standalone: false,
})
export class TestRestApiComponent implements OnInit {
  restApiDataInfo: any;
  isRestApiListingDisplay: boolean;

  constructor() {
    this.isRestApiListingDisplay = true;
  }

  ngOnInit() {}

  public onRestApiDataInfo(restApiDataInfo: any) {
    this.restApiDataInfo = restApiDataInfo;
    if (restApiDataInfo != undefined && restApiDataInfo.screenReqdFl == 'YES')
      this.isRestApiListingDisplay = false;
  }
}
