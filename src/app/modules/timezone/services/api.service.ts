import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, ReplaySubject, retry, tap } from 'rxjs';

@Injectable()
export class ApiService {

  private subject = new ReplaySubject<any>(1);
  public data$ = this.subject.asObservable();

  constructor(
    private readonly http: HttpClient,
  ) {}

  public getTimezones(): Observable<any> {
    return this.http.get('timezone');
  }

  public getDateTime(zone: string): Observable<any> {
    return this.http.get(`timezone/${zone}`, {})
      .pipe(
        tap((data: any) => this.subject.next(data)),
      );
  }

  public getCurrentDateTime(): Observable<any> {
    return this.http.get(`ip`, {})
      .pipe(
        tap((data: any) => this.subject.next(data)),
      );
  }
}
