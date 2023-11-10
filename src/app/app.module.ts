import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatToolbarModule } from '@angular/material/toolbar';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { FilterHandlerComponent } from './components/filter-handler/filter-handler.component';
import { UiToolbarComponent } from './elements/ui-toolbar/ui-toolbar.component';

// Components
import { NgxFilterHandlerComponent } from '../../projects/ngx-lib/src/lib/components/ngx-filter-handler/ngx-filter-handler.component';

@NgModule({
   declarations: [AppComponent, UiToolbarComponent, FilterHandlerComponent],
   imports: [
      BrowserModule,
      AppRoutingModule,
      BrowserAnimationsModule,
      MatButtonModule,
      MatSidenavModule,
      MatToolbarModule,
      MatFormFieldModule,
      MatInputModule,
      FormsModule,
      MatIconModule,
      MatCardModule,
      NgxFilterHandlerComponent,
   ],
   providers: [],
   bootstrap: [AppComponent],
})
export class AppModule {}
