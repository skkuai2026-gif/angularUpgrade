import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class CollateralServiceService {
  constructor(private http: HttpClient) {
    this.getJSON().subscribe((data) => {});
  }

  public getJSON(): Observable<any> {
    return this.http.get('app/collateral/assets/data/data.json');
  }
}
