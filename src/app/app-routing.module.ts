import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { FilterHandlerComponent } from './components/filter-handler/filter-handler.component';

const routes: Routes = [
   {
      path: '',
      redirectTo: 'filter-handler',
      pathMatch: 'full',
   },
   {
      path: 'filter-handler',
      component: FilterHandlerComponent,
   },
];

@NgModule({
   imports: [RouterModule.forRoot(routes)],
   exports: [RouterModule],
})
export class AppRoutingModule {}
