import { Component, OnDestroy, OnInit } from '@angular/core';
import {
  map,
  tap,
  take,
  repeat,
  interval,
  switchMap,
  Subscription, Observable,
} from "rxjs";
import { MatDialog } from "@angular/material/dialog";
import { AddDialogComponent } from "@app/modules/timezone/components";

import { CookieStorageService } from "@app/core";
import { ApiService } from "../../services";
import { incrementTime } from "../../helpers";

@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.css']
})
export class ListComponent implements OnInit, OnDestroy {

  constructor(
    readonly dialog: MatDialog,
    readonly apiService: ApiService,
    readonly storageService: CookieStorageService,
  ) {
    this.apiService.getTimezones()
      .subscribe((data: string[]) => this.allTimezones = data);
  }

  public displayedColumns: string[] = [
    'fullName',
    'shortName',
    'localTime',
    'localDate',
    'summertime',
  ];

  public data: any[] = [];
  public allTimezones: string[] = [];
  private subscriptions: Subscription[] = [];
  private currentTimezone: string | null = null;

  ngOnInit(): void {
    this.subscribeToDataStreams();
    this.subscribeTimezonesFromCookies();
    this.subscribeToCurrentTimezone();
  }

  private subscribeTimezonesFromCookies(): void {
    const storedTimezones = this.storageService
      .getCookie(CookieStorageService.TIMEZONES_COOKIE_KEY);
    if (storedTimezones) {
      const timezones: string[] = JSON.parse(storedTimezones);
      timezones.forEach(timezone => {
        this.subscriptions.push(
          this.updateTimeStream(this.apiService.getDateTime(timezone)).subscribe()
        );
        if (timezone === this.currentTimezone) {
          this.currentTimezone = null;
        }
      });
    }
  }

  private subscribeToDataStreams(): void {
    this.apiService.data$.subscribe(data => this.updateData(data));
  }

  private subscribeToCurrentTimezone(): void {
    if (!this.currentTimezone) {
      this.subscriptions.push(
        this.apiService.getCurrentDateTime().pipe(
          tap(data => this.currentTimezone = data.timezone)
        ).subscribe()
      );
    }
  }

  public addTimezone(zone: string): void {
    this.subscriptions.push(
      this.updateTimeStream(this.apiService.getDateTime(zone)).subscribe()
    );
    this.updateTimezonesCookie(zone);
  }

  private updateTimezonesCookie(zone: string): void {
    const timezonesArray = this.data.map(item => item.timezone);
    const serializedData = JSON.stringify([...timezonesArray, zone]);
    this.storageService.setCookie(CookieStorageService.TIMEZONES_COOKIE_KEY, serializedData);
  }

  private updateTimeStream(apiCall: Observable<any>): Observable<any> {
    let currentData: any;
    return apiCall.pipe(
      tap(data => {
        this.updateData(data);
        currentData = data;
      }),
      switchMap(() =>
        interval(1000).pipe(
          take(60),
          map(() => incrementTime(currentData, 1)),
          tap(updatedData => {
            this.updateData(updatedData);
            currentData = updatedData;
          })
        )
      ),
      repeat()
    );
  }

  private updateData(newData: any): void {
    const index = this.data.findIndex(item => item.timezone === newData.timezone);
    if (index !== -1) {
      this.data[index] = newData;
    } else {
      if (newData.timezone === this.currentTimezone) {
        this.data.unshift(newData);
      } else {
        this.data.push(newData);
      }
    }
    this.data = [...this.data];
  }

  public openAddDialog(): void {
    const subTimezones = this.data.map(item => item.timezone);
    const noSubTimezones = this.allTimezones.filter(
      timezone => !subTimezones.includes(timezone)
    );
    this.subscriptions.push(
      this.dialog
        .open(AddDialogComponent, {
          width: '400px',
          autoFocus: false,
          disableClose: true,
          data: { timezones: noSubTimezones }
        })
        .afterClosed()
        .subscribe((timezone: string) => {
          if (timezone) {
            this.addTimezone(timezone);
          }
        })
    );
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(sub => sub.unsubscribe());
  }
}
