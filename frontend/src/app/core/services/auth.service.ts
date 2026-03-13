import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { Router } from '@angular/router';
import { LoginRequest, LoginResponse, RegisterRequest } from '../models/models';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private apiUrl = 'http://localhost:8080/api/auth';
  private currentUserSubject = new BehaviorSubject<LoginResponse | null>(this.getStoredUser());
  public currentUser$ = this.currentUserSubject.asObservable();

  constructor(private http: HttpClient, private router: Router) {}

  private getStoredUser(): LoginResponse | null {
    const data = localStorage.getItem('currentUser');
    return data ? JSON.parse(data) : null;
  }

  get currentUser(): LoginResponse | null {
    return this.currentUserSubject.value;
  }

  get token(): string | null {
    return this.currentUser?.token ?? null;
  }

  get role(): string | null {
    return this.currentUser?.role ?? null;
  }

  get isLoggedIn(): boolean {
    return !!this.currentUser;
  }

  login(credentials: LoginRequest): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(`${this.apiUrl}/login`, credentials).pipe(
      tap(response => {
        localStorage.setItem('currentUser', JSON.stringify(response));
        this.currentUserSubject.next(response);
      })
    );
  }

  register(data: RegisterRequest): Observable<any> {
    return this.http.post(`${this.apiUrl}/register`, data);
  }

  logout(): void {
    localStorage.removeItem('currentUser');
    this.currentUserSubject.next(null);
    this.router.navigate(['/auth/login']);
  }

  redirectToRole(): void {
    const role = this.role;
    if (role === 'ADMIN') this.router.navigate(['/admin/dashboard']);
    else if (role === 'VENDOR') this.router.navigate(['/vendor/dashboard']);
    else if (role === 'EMPLOYEE') this.router.navigate(['/employee/dashboard']);
    else this.router.navigate(['/auth/login']);
  }
}
