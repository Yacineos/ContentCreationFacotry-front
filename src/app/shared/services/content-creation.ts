import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface ContentCreationRequest {
  youtubeUrl: string;
}

export interface ContentCreationResponse {
  success: boolean;
  message: string;
  instagramPostId?: string;
}

@Injectable({
  providedIn: 'root'
})
export class ContentCreation {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = 'http://localhost:3000/api'; // Replace with your backend URL

  postYouTubeToInstagram(youtubeUrl: string): Observable<ContentCreationResponse> {
    const request: ContentCreationRequest = { youtubeUrl };
    
    return this.http.post<ContentCreationResponse>(
      `${this.apiUrl}/content/youtube-to-instagram`,
      request
    );
  }

  validateYouTubeUrl(url: string): boolean {
    const youtubeRegex = /^(https?:\/\/)?(www\.)?(youtube\.com\/(watch\?v=|embed\/|v\/)|youtu\.be\/)[\w-]+/;
    return youtubeRegex.test(url);
  }
}
