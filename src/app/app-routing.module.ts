import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './components/autentication/login/login.component';
import { GroupComponent } from './components/Cat1/group/group.component';
import { AreaComponent } from './components/Cat2/area/area.component';
import { EventComponent } from './components/Cat3/event/event.component';
import { MatrixComponent } from './components/Evaluation/matrix/matrix.component';
import { PlanComponent } from './components/Evaluation/plan/plan.component';
import { HomeComponent } from './components/home/home.component';
import { ReportEvaluationMatrixComponent } from './components/Reports/report-evaluation-matrix/report-evaluation-matrix.component';
import { ReportEvaluationPlanComponent } from './components/Reports/report-evaluation-plan/report-evaluation-plan.component';

const routes: Routes = [  {path: '', component: HomeComponent }
,{path: 'login', component: LoginComponent} 
,{path: 'home', component: HomeComponent} 
,{ path: 'matrix', component: MatrixComponent }
,{ path: 'plan', component: PlanComponent }
,{ path: 'reportMatrix', component: ReportEvaluationMatrixComponent }
,{ path: 'reportPlan', component: ReportEvaluationPlanComponent }
,{ path: 'group', component:GroupComponent }
,{ path: 'area', component: AreaComponent }
,{ path: 'event', component: EventComponent }

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
