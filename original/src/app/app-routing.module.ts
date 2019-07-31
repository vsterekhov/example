import {NgModule} from "@angular/core";
import {RouterModule, Routes} from "@angular/router";
import {AuthorizationComponent} from "./authorization/authorization-component";
import {RegistrationComponent} from "./registration/registration.component";
import {PresenterByRecoveryResolverService} from "./registration/presenter-by-recovery-resolver.service";

const routes: Routes = [
    {
        path: 'login',
        component: AuthorizationComponent
    }, {
        path: 'registration', component: RegistrationComponent,
        resolve: {
            presenterByRecovery: PresenterByRecoveryResolverService
        }
    }, {
        path: 'manage',
        loadChildren: './manage-module/manage.module#ManageModule'
    }, {
        path: 'vote',
        loadChildren: './vote-module/vote.module#VoteModule'
    }, {
        path: 'view-vote',
        loadChildren: './view-vote-module/view-vote.module#ViewVoteModule'
    }, {
        path: '**',
        redirectTo: '/vote'
    }];

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule]
})
export class AppRoutingModule {
}
