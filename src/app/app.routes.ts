import { Routes } from '@angular/router';
import { AuthLayoutComponent } from './layouts/auth-layout/auth-layout.component';
import { MainLayoutComponent } from './layouts/main-layout/main-layout.component';
import { LoginComponent } from './features/login/login.component';
import { RegisterComponent } from './features/register/register.component';
import { ForgotPasswordComponent } from './features/forgot-password/forgot-password.component';
import { FeedComponent } from './features/feed/feed.component';
import { ProfileComponent } from './features/profile/profile.component';
import { NotificationComponent } from './features/notification/notification.component';
import { ChangePasswordComponent } from './features/change-password/change-password.component';
import { NotfoundComponent } from './features/notfound/notfound.component';
import { authGuard } from './core/auth/guards/auth-guard';
import { guestGuard } from './core/auth/guards/guest-guard';
import { DetailsComponent } from './features/details/details.component';
import { UpdatePostComponent } from './features/update-post/update-post.component';
import { SharePostComponent } from './features/share-post/share-post.component';

export const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch:'full' },
  {
    path: '',
    component: AuthLayoutComponent,
    canActivate:[guestGuard],
    children: [
      { path: 'login', component: LoginComponent, title: 'Login Page' },
      { path: 'register', component: RegisterComponent, title: 'Register Page' },
      { path: 'forget', component: ForgotPasswordComponent, title: 'Forget Password Page' },
    ],
  },
  {
    path: '',
    component: MainLayoutComponent,
     canActivate:[authGuard],
     children: [
      { path: 'feed', component: FeedComponent, title: 'TimeLine Page' },
      { path: 'profile', component: ProfileComponent, title: 'Profile Page' },
      { path: 'notification', component: NotificationComponent, title: 'Notification Page' },
      { path: 'changepassword', component: ChangePasswordComponent, title: 'Change Password Page' },
      { path: 'details/:id', component: DetailsComponent, title: 'Details Page' },
      { path: 'update-post/:id', component: UpdatePostComponent, title: 'UpdatePost Page' },
      { path: 'share-post/:id', component: SharePostComponent, title: 'sharePost Page' },
    ],
  },

  { path: '**', component: NotfoundComponent, title: 'NotFound Page' },
];
