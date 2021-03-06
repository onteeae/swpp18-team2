import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { InterestDetailComponent } from './interest-detail.component';
import {Component, EventEmitter, Input, Output} from '@angular/core';
import {Article, ArticleTag, ArticleType, FeedService, TagColor} from '../../core/feed.service';
import {RouterTestingModule} from '@angular/router/testing';
import {AuthService} from '../../core/auth.service';
import {Interest, InterestService, InterestTag} from '../../core/interest.service';
import {UserService} from '../../core/user.service';
import {of} from 'rxjs';
import {HttpClientTestingModule} from '@angular/common/http/testing';
import {ActivatedRoute, convertToParamMap} from '@angular/router';

@Component({selector: 'app-feed-list', template: ''})
class MockFeedListComponent {
  @Input() articles: Article[]
}
@Component({selector: 'app-interest-info', template: ''})
class MockInterestInfoComponent {
  @Input() interest
}
@Component({selector: 'app-interest-people-list', template: ''})
class MockInterestPeopleListComponent {
  @Input() users
}

const mockColor: TagColor = {
  id: 1, name: 'color', rgb: '#ffffff'
}
const mockInterestTags: InterestTag[] = [
  { id: 1, name: 'tag1',  color: mockColor, noShow: false}
]
const mockInterest: Interest[] = [
  {id: 1, name: 'interest1', createUser: 'user1', createdDate: 'now', photoURL: 'test', tags: mockInterestTags}
]
const mockTag: ArticleTag[] = [
  {id: 1, name: 'testTag', color: mockColor, noShow: false}
]
const mockType: ArticleType = {id: 1, name: 'testType'}
const mockArticle: Article[] = [
  {id: 1, title: 'testTitle', content: 'testContent', author: '1', type: mockType, tags: mockTag}
]
const mockArticles: Article[] = [
  {id: 1, title: 'testTitle', content: 'testContent', author: '1', type: mockType, tags: mockTag},
  {id: 2, title: 'testTitle', content: 'testContent', author: '1', type: mockType, tags: mockTag}
]
const mockUser = {id: '1', name: 'test', interests: mockInterest}
const mockUserNoInterest = {id: '1', name: 'test', interests: [{id: 100}]}
const mockUsers = [{id: '1', name: 'test', interests: mockInterest}]
class MockAuthService extends AuthService {
  user
  userReturn
  getUser() {
    return of(this.userReturn)
  }
  setUser(user) {
    this.userReturn = user
  }
}
describe('InterestDetailComponent', () => {
  let component: InterestDetailComponent;
  let fixture: ComponentFixture<InterestDetailComponent>;
  let authService: AuthService
  let feedService: jasmine.SpyObj<FeedService>;
  let interestService: jasmine.SpyObj<InterestService>;
  let userService: jasmine.SpyObj<UserService>;
  beforeEach(async(() => {

    const interestSpy = jasmine.createSpyObj('InterestService', ['getInterestByID', 'getUserInterests'])
    const feedSpy = jasmine.createSpyObj('FeedService', ['getArticleByInterest'])
    const userSpy = jasmine.createSpyObj('UserService',['getUserByInterest', 'addInterestToUser'])

    TestBed.configureTestingModule({
      imports: [RouterTestingModule, HttpClientTestingModule],
      declarations: [ InterestDetailComponent, MockFeedListComponent, MockInterestInfoComponent, MockInterestPeopleListComponent ],
      providers:
        [{provide: AuthService, useClass: MockAuthService},
        {provide: InterestService, useValue: interestSpy},
        {provide: FeedService, useValue: feedSpy},
        {provide: UserService, useValue: userSpy},
          {
            provide: ActivatedRoute,
            useValue: {
              snapshot: {
                paramMap: convertToParamMap({
                  id: '1'
                })
              }
            }
          }]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InterestDetailComponent);
    component = fixture.componentInstance;
    feedService = TestBed.get(FeedService)
    userService = TestBed.get(UserService)
    authService = TestBed.get(AuthService)
    interestService = TestBed.get(InterestService)
    feedService.getArticleByInterest.and.returnValue(of(mockArticles))
    interestService.getInterestByID.and.returnValue(of(mockInterest[0]))
    interestService.getUserInterests.and.returnValue(of(mockInterest))
    userService.getUserByInterest.and.returnValue(of(mockUsers))
    userService.addInterestToUser.and.returnValue(of(mockUser))
    authService.setUser(mockUser)
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
    authService.user = mockUser
    component.ngOnInit()
    expect(component).toBeTruthy();
    feedService.getArticleByInterest.and.returnValue(of(mockArticles))
    component.ngOnInit()
    expect(component).toBeTruthy();
    authService.user = mockUserNoInterest
    component.ngOnInit()
    expect(component).toBeTruthy();
    authService.user = null
    authService.setUser(mockUserNoInterest)
    component.ngOnInit()
    expect(component).toBeTruthy();
    component.isMember = true
    spyOn(window, 'confirm').and.returnValue(false);
    component.subscribe()
    expect(component).toBeTruthy();
  });
  it('should be able to subscribe to a interest', () => {
    component.isMember = true
    spyOn(authService, 'setUser')
    spyOn(window, 'confirm').and.returnValue(true);
    component.subscribe()
    expect(userService.addInterestToUser).toHaveBeenCalledWith(1, false)
    expect(authService.setUser).toHaveBeenCalledWith(mockUser)
    component.isMember = false
    component.subscribe()
    expect(userService.addInterestToUser).toHaveBeenCalledWith(1, true)
    expect(authService.setUser).toHaveBeenCalledWith(mockUser)

  });
});
