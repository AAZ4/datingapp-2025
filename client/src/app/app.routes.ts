import { Routes } from '@angular/router';
import { Home } from '../features/home/home';
import { MemberList } from '../features/members/member-list/member-list';
import { MemberDetailed } from '../features/members/member-detailed/member-detailed';
import { Lists } from '../features/lists/lists';
import { Messages } from '../features/messages/messages';
import { authGuard } from '../core/guards/auth-guard';
import { TestErrors } from '../features/test-errors/test-errors';
import { NotFound } from '../shared/errors/not-found/not-found';
import { ServerError } from '../shared/errors/server-error/server-error';
import { MemeberPhotos } from '../features/members/memeber-photos/memeber-photos';
import { MemeberProfile } from '../features/members/memeber-profile/memeber-profile';
import { MemeberMessages } from '../features/members/memeber-messages/memeber-messages';
import { memberResolver } from '../features/members/member-resolver';

export const routes: Routes = [
  { path: '', component: Home },
  {
    path: '',
    canActivate: [authGuard],
    children: [
      { path: 'members', component: MemberList, canActivate: [authGuard] },
      {
        path: 'members/:id',
        resolve: { member: memberResolver },
        runGuardsAndResolvers: 'always',
        component: MemberDetailed,
        children: [
          { path: '', redirectTo: 'profile', pathMatch: 'full' },
          { path: 'profile', component: MemeberProfile, title: 'Profile' },
          { path: 'photos', component: MemeberPhotos, title: 'Photos' },
          { path: 'messages', component: MemeberMessages, title: 'Messages' },
        ]
      },
      { path: 'lists', component: Lists },
      { path: 'messages', component: Messages },
    ],
  },
  { path: 'errors', component: TestErrors },
  { path: 'server-error', component: ServerError },
  { path: '**', component: NotFound },
];
