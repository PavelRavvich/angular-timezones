import {
  OnInit,
  OnDestroy,
  Component,
  ChangeDetectorRef,
  ChangeDetectionStrategy,
} from '@angular/core';
import {
  map,
  tap,
  zip,
  take,
  repeat,
  interval,
  switchMap,
  Subscription,
} from "rxjs";
import { MatDialog } from "@angular/material/dialog";

import { incrementTime } from "../../helpers";

import { AddDialogComponent } from "@app/modules/timezone/components";

import { CookieStorageService } from "@app/core";
import { ApiService } from "../../services";


@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush, // not call rendering for each Observable change
})
export class ListComponent implements OnInit, OnDestroy {

  constructor(
    readonly dialog: MatDialog,
    readonly cdr: ChangeDetectorRef,
    readonly apiService: ApiService,
    readonly storageService: CookieStorageService,
  ) {
    setInterval(() => cdr.detectChanges(), 1000);
  }

  public displayedColumns: string[] = [
    'fullName',
    'shortName',
    'localTime',
    'localDate',
    'summertime',
  ];

  public data: any[] = [];
  private allTimezones: string[] = [];
  private subscriptions: Subscription[] = [];
  private currentTimezone: string | null = null;

  ngOnInit(): void {
    this.subscribeToDataStreams();
    this.subscriptions.push(
      zip(
        this.apiService.getTimezones(),
        this.apiService.getCurrentDateTime()
      ).subscribe(([allTimezones, currentDatetime]) => {
        this.currentTimezone = currentDatetime.timezone;
        this.allTimezones = allTimezones;

        this.subscribeTimezone(currentDatetime.timezone);
        const storedTimezones = this.storageService.getCookie(CookieStorageService.TIMEZONES_COOKIE_KEY) || '[]';
        JSON.parse(storedTimezones).forEach((item: any) => this.subscribeTimezone(item));
      })
    );
  }

  private subscribeToDataStreams(): void {
    this.apiService.data$.subscribe(data => this.updateData(data));
  }

  public subscribeTimezone(timezone: string): void {
    let current: any;
    const update = (updatedData: any) => {
      this.updateData(updatedData);
      current = updatedData;
    };
    this.subscriptions.push(
      this.apiService.getDateTime(timezone)
        .pipe(
          tap(data => current = data),
          switchMap(() =>
            interval(1000).pipe(
              take(60),
              map(() => incrementTime(current, 1)),
              tap(newData => update(newData))
            )
          ),
          repeat()
        )
        .subscribe()
    );
  }

  private updateData(newData: any): void {
    const index = this.data.findIndex(item => item.timezone === newData.timezone);
    if (index !== -1) {
      this.data[index] = newData;
    } else {
      this.data.push(newData);
    }
    this.data = [...this.data];
  }

  public openAddDialog(): void {
    const subTimezones = [...this.data.map(item => item.timezone), this.currentTimezone];
    const noSubTimezones = this.allTimezones.filter(
      timezone => !subTimezones.includes(timezone)
    );
    this.subscriptions.push(
      this.dialog
        .open(AddDialogComponent, {
          width: '400px',
          autoFocus: false,
          disableClose: true,
          data: { timezones: [...noSubTimezones] }
        })
        .afterClosed()
        .subscribe((timezone: string) => {
          if (timezone) {
            this.subscribeTimezone(timezone);
            this.updateTimezonesCookie(timezone);
          }
        })
    );
  }

  private updateTimezonesCookie(timezone: string): void {
    if (this.currentTimezone === timezone) return;
    const timezones = this.data
      .map(datetime => datetime.timezone)
      .filter(zone => zone !== this.currentTimezone);
    const serializedData = JSON.stringify([...timezones, timezone]);
    this.storageService.setCookie(CookieStorageService.TIMEZONES_COOKIE_KEY, serializedData);
  }

  public trackByFn(index: number, item: any): string {
    return item.fullName; // not rerender full item if fullName not changed
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(sub => sub.unsubscribe());
  }
}
