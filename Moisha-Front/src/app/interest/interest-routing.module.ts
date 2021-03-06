import {RouterModule, Routes} from '@angular/router';
import {NgModule} from '@angular/core';
import {InterestCreateComponent} from './interest-create/interest-create.component';
import {InterestHomeComponent} from './interest-home/interest-home.component';
import {InterestFeedComponent} from './interest-feed/interest-feed.component';
import {ArticleCreateComponent} from '../feed/article-create/article-create.component';
import {InterestComponent} from './interest/interest.component';
import {InterestDetailComponent} from './interest-detail/interest-detail.component';
import {InterestPeopleHomeComponent} from './interest-people-home/interest-people-home.component';

const routes: Routes = [
  {
    path: '',
    component: InterestHomeComponent,
    children: [
      {
        path: '',
        component: InterestComponent
      },
      {
        path: 'create',
        component: InterestCreateComponent
      },
      {
        path: ':id',
        children: [
          {
            path: '',
            component: InterestDetailComponent,
          },
          {
            path: 'people',
            component: InterestPeopleHomeComponent
          },
          {
            path: 'feed',
            component: InterestFeedComponent
          },
          {
            path: 'feed/create',
            component: ArticleCreateComponent
          },
        ]
      },
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class InterestRoutingModule {}
