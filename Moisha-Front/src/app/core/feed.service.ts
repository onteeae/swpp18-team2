import { Injectable } from '@angular/core';
import {HttpClient, HttpParams} from '@angular/common/http';
import {DepartmentSearchResponse} from './user.service';
import {tap} from 'rxjs/operators';
import {InterestTag} from './interest.service';
import {Observable} from 'rxjs';

export interface TagColor {
  id: number,
  name: string,
  rgb: string
}
export interface ArticleTag {
  id: number,
  name: string,
  color: TagColor
}
export interface ArticleType {
  id: number,
  name: string
}
export interface Article {
  id: number,
  title: string,
  content: string,
  author: string,
  type: ArticleType,
  tags: ArticleTag[]
}

@Injectable({
  providedIn: 'root'
})
export class FeedService {
  searchTag(search: string): Observable<ArticleTag[]> {
    const params = new HttpParams().set('q', search);
    return this.http.get<InterestTag[]>('/search/article/tag', {
      params
    }).pipe(tap((result) => console.log(result)));
  }
  constructor(private http: HttpClient) { }
  getArticleByUser(limit?: number) {
    let params;
    if(limit)
      params = new HttpParams().set('limit', limit.toString());
    return this.http.get<Article[]>('/article/', {
      params
    });
  }
  getArticleByInterest(id: number, limit?: number) {
     let params;
      if(limit)
        params = new HttpParams().set('limit', limit.toString());
      return this.http.get<Article[]>('/article/interest/' + id + '/', {
      params
    });
  }
  createArticle(payload) {
    return this.http.post('/article/create/', payload);
  }
}
