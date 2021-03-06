import {TestBed, inject, async} from '@angular/core/testing';

import {AuthResponse, AuthService, CheckResponse} from './auth.service';
import {HttpClientTestingModule, HttpTestingController} from '@angular/common/http/testing';
import {RouterTestingModule} from '@angular/router/testing';
import {Observable, of} from 'rxjs';
import {Mock} from 'protractor/built/driverProviders';
import {Router} from '@angular/router';
import {InterestService} from './interest.service';
import {HttpParameterCodec, HttpParams} from '@angular/common/http';
export interface SignUpPayload {
  email: string
  name: string
  nickName: string
  studentId: number
  major: string
  password: string
}
const mockUser = {id: 1, email: 'test@test.com', password: 'Qwe12345'}
describe('AuthService', () => {
  let store;
  let mockLocalStorage;
  let httpClient;
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule],
      providers: [AuthService]
    });
    store = {};
    httpClient = TestBed.get(HttpTestingController)
    mockLocalStorage = {
      getItem: (key: string): string => {
        return key in store ? store[key] : null;
      },
      setItem: (key: string, value: string) => {
        store[key] = `${value}`;
      },
      removeItem: (key: string) => {
        delete store[key];
      },
      clear: () => {
        store = {};
      }
    }
    httpClient = TestBed.get(HttpTestingController)
  });
  it('should be created', inject([AuthService], (service: AuthService) => {
    expect(service).toBeTruthy();
  }));
  it('should get token', inject([AuthService], (service: AuthService) => {
    spyOn(localStorage, 'getItem').and.callFake(mockLocalStorage.getItem)
    spyOn(localStorage, 'setItem').and.callFake(mockLocalStorage.setItem)
    service.setToken('testToken')
    const token = 'testToken'
    service.setToken(token)
    expect('testToken').toEqual(service.token)
  }));
  it('should be able to login/logout', async(inject([AuthService, Router], (service: AuthService, router: Router) => {
    spyOn(localStorage, 'getItem').and.callFake(mockLocalStorage.getItem)
    spyOn(localStorage, 'setItem').and.callFake(mockLocalStorage.setItem)
    spyOn(localStorage, 'removeItem').and.callFake(mockLocalStorage.removeItem)
    const navigateSpy = spyOn(router, 'navigate');
    service.login('test@test.com', 'Qwe12345').subscribe((result)=>{
      expect(result.token).toEqual(localStorage.getItem('access_token'))
      const loggedin = service.isLoggedIn
      expect(loggedin).toEqual(true)
      expect(navigateSpy).toHaveBeenCalledWith(['/']);
      service.getUser().subscribe((user) => {
        expect(user.name).toEqual('test')
      })
      service.logout()
      expect(localStorage.getItem('access_token')).toEqual(null)
      expect(navigateSpy).toHaveBeenCalledWith(['intro']);
    })
    const req = httpClient.expectOne(
      `/user/login/`
    );
    expect(req.request.method).toBe('POST')
    req.flush({
      name: 'test',
      token: 'token'
    });
    const reqGet = httpClient.expectOne(
      `/user/info`
    );
    expect(reqGet.request.method).toBe('GET')
    reqGet.flush({
      name: 'test'
    })
    httpClient.verify();
  })));
  it('should be able to signup', async(inject([AuthService, Router], (service: AuthService, router: Router) => {
    spyOn(localStorage, 'getItem').and.callFake(mockLocalStorage.getItem)
    spyOn(localStorage, 'setItem').and.callFake(mockLocalStorage.setItem)
    spyOn(localStorage, 'removeItem').and.callFake(mockLocalStorage.removeItem)
    const navigateSpy = spyOn(router, 'navigate');
    const payload = {
      email: 'test@test.com',
      name: 'test',
      nickName: 'test',
      studentId: 12345,
      major: 'test',
      password: 'Qwe12345'
    }
    service.signup(payload).subscribe((result) => {
      expect(result.token).toEqual(localStorage.getItem('access_token'))
      expect(navigateSpy).toHaveBeenCalledWith(['/']);
    })
    const req = httpClient.expectOne(
      `/user/signup/`
    );
    expect(req.request.method).toBe('POST')
    req.flush({
      token: 'token'
    });
    httpClient.verify();
  })));
  it('should be able to modify user Info', async(inject([AuthService], (service: AuthService) => {
    const payload = {
      nickName: 'test',
      email: 'test@test.com',
      passWord: 'test'
    }
    service.modifyInfo(payload).subscribe((result) => {
      expect(result).toEqual(mockUser)
    })
    const req = httpClient.expectOne(req =>
      req.url.includes(`/user/modify/`));
    expect(req.request.method).toBe('PUT')
    req.flush(mockUser);
    httpClient.verify();
  })));
  it('should be able to checkDuplicate with nicakname', async(inject([AuthService], (service: AuthService) => {
    const mockResponse: CheckResponse = {
      isDuplicate: true
    }
    service.checkDuplicate('test').subscribe((result) => {
      expect(result).toEqual(mockResponse)
    })
    const req = httpClient.expectOne(req =>
      req.params.get('nickName') === 'test' &&
      req.url.includes('/user/check/'));
    expect(req.request.method).toBe('GET')
    req.flush(mockResponse);
    httpClient.verify();
  })));
  it('should be able to checkDuplicate with email', async(inject([AuthService], (service: AuthService) => {
    const mockResponse: CheckResponse = {
      isDuplicate: true
    }
    service.checkDuplicate(undefined, 'test').subscribe((result) => {
      expect(result).toEqual(mockResponse)
    })
    const req = httpClient.expectOne(req =>
      req.params.get('email') === 'test' &&
      req.url.includes('/user/check/'));
    expect(req.request.method).toBe('GET')
    req.flush(mockResponse);
    httpClient.verify();
  })));
  it('should be able to checkDuplicate with studentid', async(inject([AuthService], (service: AuthService) => {
    const mockResponse: CheckResponse = {
      isDuplicate: true
    }
    service.checkDuplicate(undefined, undefined, 'test').subscribe((result) => {
      expect(result).toEqual(mockResponse)
    })
    const req = httpClient.expectOne(req =>
      req.params.get('studentId') === 'test' &&
      req.url.includes('/user/check/'));
    expect(req.request.method).toBe('GET')
    req.flush(mockResponse);
    httpClient.verify();
  })));
  it('should be able to checkDuplicate with no params', async(inject([AuthService], (service: AuthService) => {
    const mockResponse: CheckResponse = {
      isDuplicate: true
    }
    service.checkDuplicate(undefined, undefined, undefined).subscribe((result) => {
      expect(result).toEqual(mockResponse)
    })
    const req = httpClient.expectOne(req =>
      req.url.includes('/user/check/'));
    expect(req.request.method).toBe('GET')
    req.flush(mockResponse);
    httpClient.verify();
  })));
});

