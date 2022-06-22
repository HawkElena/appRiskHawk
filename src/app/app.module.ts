import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

//para que funcione los iconos de las paginas fontawsome
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome' 

//para que las formas sean reactivos
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HeadersComponent } from './components/headers/headers.component';
import { RouterModule } from '@angular/router';


import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';


// son los controles de usuario para utilizarlos en los componentes
import { UserControlFormComponent } from './components/Control-de-usuario/user-control-form/user-control-form.component';
import { UserControlSearchComponent } from './components/Control-de-usuario/user-control-search/user-control-search.component';
import { HomeComponent } from './components/home/home.component';
import { LoginComponent } from './components/autentication/login/login.component';
import { MatrixComponent } from './components/Evaluation/matrix/matrix.component';
import { PlanComponent } from './components/Evaluation/plan/plan.component';

// extras
import { DatePipe } from '@angular/common';
import { ReportEvaluationPlanComponent } from './components/Reports/report-evaluation-plan/report-evaluation-plan.component';
import { ReportEvaluationMatrixComponent } from './components/Reports/report-evaluation-matrix/report-evaluation-matrix.component';
import { GroupComponent } from './components/Cat1/group/group.component';
import { EventComponent } from './components/Cat3/event/event.component';
import { AreaComponent } from './components/Cat2/area/area.component';


@NgModule({
  declarations: [
    AppComponent,
    UserControlFormComponent,
    UserControlSearchComponent,
    HomeComponent,
    HeadersComponent,
    LoginComponent,
    MatrixComponent,
    PlanComponent,
    ReportEvaluationPlanComponent,
    ReportEvaluationMatrixComponent,
    GroupComponent,
    EventComponent,
    AreaComponent,
    
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    NgbModule,
    FontAwesomeModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule, 
    RouterModule,
    
  ],
  providers: [DatePipe],
  bootstrap: [AppComponent]
})
export class AppModule { }
