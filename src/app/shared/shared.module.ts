import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from "@angular/router";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { DateTimeFormatPipe } from "./pispes";

@NgModule({
  declarations: [
    DateTimeFormatPipe,
  ],
  imports: [
    FormsModule,
    ReactiveFormsModule,
    RouterModule,
    CommonModule,
  ],
  exports: [
    DateTimeFormatPipe
  ]
})
export class SharedModule { }
