import {TestBed, inject, async} from '@angular/core/testing';

import {Article, ArticleTag, ArticleType, FeedService, TagColor} from './feed.service';
import {HttpClientTestingModule, HttpTestingController} from '@angular/common/http/testing';
import {RouterTestingModule} from '@angular/router/testing';
import {AuthService} from './auth.service';
import {Router} from '@angular/router';
import {HttpParams} from '@angular/common/http';



const mockColor: TagColor = {id: 1, name: 'color', rgb: '#ffffff'}
const mockTag: ArticleTag[] = [
  {id: 1, name: 'testTag', color: mockColor, noShow: false}
]
const mockType: ArticleType = {id: 1, name: 'testType'}
const mockArticle: Article[] = [
  {id: 1, title: 'testTitle', content: 'testContent', author: '1', type: mockType, tags: mockTag}
]
describe('FeedService', () => {
  let httpClient;
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule],
      providers: [FeedService]
    });
    httpClient = TestBed.get(HttpTestingController)
  });

  it('should be created', inject([FeedService], (service: FeedService) => {
    expect(service).toBeTruthy();
  }));
  it('should be able to search tags', async(inject([FeedService], (service: FeedService) => {
    service.searchTag('test').subscribe((result) => {
      expect(result).toEqual(mockTag)
    })
    const req = httpClient.expectOne(req => req.url.includes(`/search/articletag`));
    expect(req.request.method).toBe('GET')
    req.flush(mockTag);
    httpClient.verify();
  })));
  it('should be able to get Article By User with page, limit', async(inject([FeedService], (service: FeedService) => {
    service.getArticleByUser(3,3).subscribe((result) => {
      expect(result).toEqual(mockArticle)
    })
    const req = httpClient.expectOne(req => req.url.includes(`/article/`));
    expect(req.request.method).toBe('GET')
    req.flush(mockArticle)
    httpClient.verify()
  })))
  it('should be able to get Article By User with page', async(inject([FeedService], (service: FeedService) => {
    service.getArticleByUser(3).subscribe((result) => {
      expect(result).toEqual(mockArticle)
    })
    const req = httpClient.expectOne(req => req.url.includes(`/article/`));
    expect(req.request.method).toBe('GET')
    req.flush(mockArticle)
    httpClient.verify()
  })))
  it('should be able to get Article By User with limit', async(inject([FeedService], (service: FeedService) => {
    service.getArticleByUser(undefined, 3).subscribe((result) => {
      expect(result).toEqual(mockArticle)
    })
    const req = httpClient.expectOne(req => req.url.includes(`/article/`));
    expect(req.request.method).toBe('GET')
    req.flush(mockArticle)
    httpClient.verify()
  })))
  it('should be able to get Article By User without page, limit', async(inject([FeedService], (service: FeedService) => {
    service.getArticleByUser().subscribe((result) => {
      expect(result).toEqual(mockArticle)
    })
    const req = httpClient.expectOne(req => req.url.includes(`/article/`));
    expect(req.request.method).toBe('GET')
    req.flush(mockArticle)
    httpClient.verify()
  })));
  it('should be able to get Article By Interest with page, limit', async(inject([FeedService], (service: FeedService) => {
    service.getArticleByInterest(1, 1,1).subscribe((result) => {
      expect(result).toEqual(mockArticle)
    })
    const req = httpClient.expectOne(req => req.url.includes(`/article/interest/`));
    expect(req.request.method).toBe('GET')
    req.flush(mockArticle)
    httpClient.verify();
  })));
  it('should be able to get Article By Interest with page', async(inject([FeedService], (service: FeedService) => {
    service.getArticleByInterest(1, 1).subscribe((result) => {
      expect(result).toEqual(mockArticle)
    })
    const req = httpClient.expectOne(req => req.url.includes(`/article/interest/`));
    expect(req.request.method).toBe('GET')
    req.flush(mockArticle)
    httpClient.verify();
  })));
  it('should be able to get Article By Interest with  limit', async(inject([FeedService], (service: FeedService) => {
    service.getArticleByInterest(1, undefined, 1).subscribe((result) => {
      expect(result).toEqual(mockArticle)
    })
    const req = httpClient.expectOne(req => req.url.includes(`/article/interest/`));
    expect(req.request.method).toBe('GET')
    req.flush(mockArticle)
    httpClient.verify();
  })));
  it('should be able to get Article By Interest without page, limit', async(inject([FeedService], (service: FeedService) => {
    service.getArticleByInterest(1).subscribe((result) => {
      expect(result).toEqual(mockArticle)
    })
    const req = httpClient.expectOne(req => req.url.includes(`/article/interest/`));
    expect(req.request.method).toBe('GET')
    req.flush(mockArticle)
    httpClient.verify();
  })));
  it('should be able to create Article', async(inject([FeedService], (service: FeedService) => {
    const payload = {title: 'test', 'content': 'test'}
    service.createArticle(payload).subscribe((result) => {
      expect(result).toEqual(mockArticle[0])
    })
    const req = httpClient.expectOne(req => req.url.includes(`/article/create/`));
    expect(req.request.method).toBe('POST')
    req.flush(mockArticle[0])
    httpClient.verify();
  })));

});
