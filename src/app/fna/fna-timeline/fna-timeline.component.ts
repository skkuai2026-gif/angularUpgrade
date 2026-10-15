import {
  Component,
  ElementRef,
  Input,
  OnInit,
  QueryList,
  ViewChild,
  ViewChildren,
  ChangeDetectionStrategy,
} from '@angular/core';
import { BaseComponent } from 'src/app/system-common/base/base.component';
import { FnaService } from '../service/fna-service.service';
import { SettingService } from 'src/app/system-common/services/setting.service';

import { CdkDragDrop, moveItemInArray, transferArrayItem, CdkDrag, CdkDropList } from '@angular/cdk/drag-drop';
@Component({
  selector: 'sym-fna-timeline',
  templateUrl: './fna-timeline.component.html',
  styleUrls: ['../assets/css/fna.css', './fna-timeline.component.scss'],
  changeDetection: ChangeDetectionStrategy.Eager,
  standalone: false,
})
export class FnaTimelineComponent extends BaseComponent<FnaService> implements OnInit {
  @ViewChild('timec') timec: ElementRef;
  @ViewChild('ageC') ageC: ElementRef;
  timeLineList = [
    'Education',
    'Retirement',
    'Property',
    'Protection',
    'Savings',
    'Travel',
    'Fitness',
    'Dream Car',
    'Mansion',
    'Others',
  ];
  age: number[];
  ageDataList: { age: number; details: any[] }[];
  selectedAge: Number;
  constructor(public service: FnaService, public settingService: SettingService) {
    super(service);
    this.age = [];
    this.ageDataList = [];
    for (let i = 25; i <= 100; i = i + 5) {
      this.age.push(i);
      let age = { age: i, details: [] };
      this.ageDataList.push(age);
    }
    this.selectedAge = this.age[0];
  }

  ngOnInit() {}
  onDrop(event: CdkDragDrop<string[]>, i) {
    // console.log(event);
    // console.log(
    //   event.previousContainer.element.nativeElement.id,
    //   event.container,
    //   event.previousIndex,
    //   event.currentIndex
    // );
    let src = { src: event.previousContainer.element.nativeElement.id.toLowerCase().replace(' ', '-') };

    this.ageDataList[i].details.push(src);
  }
}
