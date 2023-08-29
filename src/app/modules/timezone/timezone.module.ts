import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TimezoneRoutingModule } from "./timezone-routing.module";
import { MatTableModule } from "@angular/material/table";
import { SharedModule } from "@app/shared/shared.module";

import { ApiService } from './services';
import { ListComponent, AddDialogComponent } from './components';
import { MatButtonModule } from "@angular/material/button";
import { MatDialogModule } from "@angular/material/dialog";
import { MatInputModule } from "@angular/material/input";
import { MatAutocompleteModule } from "@angular/material/autocomplete";
import { ReactiveFormsModule } from "@angular/forms";


@NgModule({
  declarations: [
    ListComponent,
    AddDialogComponent
  ],
  imports: [
    CommonModule,
    TimezoneRoutingModule,
    SharedModule,
    MatTableModule,
    MatDialogModule,
    MatButtonModule,
    MatInputModule,
    MatAutocompleteModule,
    ReactiveFormsModule,
  ],
  providers: [
    ApiService,
  ]
})
export class TimezoneModule {}
