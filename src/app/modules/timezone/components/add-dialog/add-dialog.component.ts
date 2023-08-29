import { Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from "@angular/material/dialog";
import { map, Observable, startWith, Subject, takeUntil, tap } from "rxjs";
import { FormControl } from "@angular/forms";

@Component({
  selector: 'app-add-dialog',
  templateUrl: './add-dialog.component.html',
  styleUrls: ['./add-dialog.component.css']
})
export class AddDialogComponent implements OnInit, OnDestroy {

  constructor(
    public dialogRef: MatDialogRef<AddDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
  ) {
    this.timezones = data.timezones;
    this.isSubmitDisabled = true;
    this.timezoneControl = new FormControl(null);
    this.filteredTimezones = new Observable<string[]>();
  }

  get submitDisabled(): boolean {
    return this.isSubmitDisabled;
  }

  public timezones: string[] = [];
  public isSubmitDisabled: boolean;
  public timezoneControl: FormControl;
  public filteredTimezones: Observable<string[]>;
  // Use this subject to unsubscribe from observables on component destruction
  private _destroyed = new Subject<void>();

  ngOnInit() {
    this.filteredTimezones = this.timezoneControl.valueChanges.pipe(
      startWith(''),
      map(timezone => {
        return this.timezones.filter(option =>
          !timezone || option.toLowerCase().includes(timezone.toLowerCase())
        );
      }),
      tap(_ => {
        const value = this.timezoneControl.value;
        this.isSubmitDisabled = value ? !this.timezones.includes(value) : true;
      }),
      takeUntil(this._destroyed)
    );
  }

  public close(): void {
    this.dialogRef.close(this.timezoneControl.value);
  }

  ngOnDestroy() {
    this._destroyed.next();
    this._destroyed.complete();
  }
}
