import { Injectable } from '@angular/core';
import { AuthService } from '@core/services/auth.service';
import { ServerService } from "@core/services/server.service";
import { HttpClient } from "@angular/common/http";

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(
    private auth: AuthService,
    private server: ServerService,
    private http: HttpClient
  ) { }
}
