import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { ListComponent } from "./components";


const routes: Routes = [
  {
    path: '',
    component: ListComponent,
    data: { title: 'Timezones' },
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class TimezoneRoutingModule {}
