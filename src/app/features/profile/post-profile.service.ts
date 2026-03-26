import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class PostProfileService {
  private readonly httpClient = inject(HttpClient);

  header: object = {
      headers: {
        'AUTHORIZATION' : `Bearer ${localStorage.getItem('socialToken')}`,
      },
  }

  

  getMyPosts(userId:string): Observable<any>{
    return this.httpClient.get(environment.baseUrl + `/users/${userId}/posts`, this.header);
  }

  UploadProfile(): Observable<any>{
    return this.httpClient.put(environment.baseUrl + `/users/upload-photo`, this.header);
  }
}
