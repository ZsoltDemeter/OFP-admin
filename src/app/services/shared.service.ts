import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, Subject, throwError } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { catchError, timeout } from 'rxjs/operators';

const httpOptions = {
  headers: new HttpHeaders({
    'Content-Type': 'application/json',
    'Credentials': 'include,',  
  }),
  observe:'response' as 'body'
}

@Injectable({
  providedIn: 'root'
})

export class SharedService {
  // public apiUrl = 'https://3.79.231.199'
  public apiUrl = 'http://localhost:3000'
  public isLoading: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  private currentUser: BehaviorSubject<string> = new BehaviorSubject<string>("");
  public currentUser$: Observable<string> = this.currentUser.asObservable();

  selectedBaseServer: string; 
  timeoutSet = 4 *60 * 60 * 1000;
  // timeoutSet = 1;

  compareResponse: any;
  comparisonStatus: string = "";
  rootPath: string;

  private _baseServerSource = new Subject<string>();
  private _targetServerSource = new Subject<string>();
  baseServer$ = this._baseServerSource.asObservable();
  targetServer$ = this._targetServerSource.asObservable();

  private _rootPathSource = new Subject<any>();
  rootPath$ = this._rootPathSource.asObservable();

  constructor(private http:HttpClient) { }

  connectToBaseServer(body): Observable<{}>{
    return this.http.post<{}>(this.apiUrl + "/Connect/BaseServer",body,httpOptions).pipe(
      timeout(this.timeoutSet),
      catchError((error) => {
        if (error.name === 'TimeoutError') {
          alert('Request timed out');
        }
        return throwError(() => error);
      })
    );
  }

  getReports(): Observable<{}>{
    return this.http.get<any>(this.apiUrl + "/reports");
  }

  getProductionForecast(): Observable<{}>{
    return this.http.get<any>(this.apiUrl + "/production-forecast");
  }

  getConsumptionForecast(): Observable<{}>{
    return this.http.get<any>(this.apiUrl + "/consumption-forecast");
  }

  updateBaseServer(serverName: string){
    this.selectedBaseServer = serverName;
    this._baseServerSource.next(serverName)
  }

  updateCurrentUser(user) {
    this.currentUser.next(user);
  }

  updateRoothPath(path){
    this.rootPath = path;
    this._rootPathSource.next(path);
  }
}
