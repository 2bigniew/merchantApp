import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Message } from '@merchant-workspace/api-interfaces';
import {SocketService} from "./core/socket.service";

@Component({
  selector: 'merchant-workspace-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  hello$ = this.http.get<Message>('/api/hello');
  constructor(private http: HttpClient, private socketService: SocketService) {}

  title = 'front';

  ngOnInit() {
    this.title = 'Looool'
  }
}
