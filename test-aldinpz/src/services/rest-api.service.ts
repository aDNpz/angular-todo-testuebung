import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { PostToDo, Record, ToDos } from 'src/models/models';

@Injectable({
  providedIn: 'root'
})
export class RestApiService {

  private url = 'https://api.airtable.com/v0/appWottkuts50x4xO/ToDoTable'


  private headers = {
    headers: new HttpHeaders({
      Authorization: 'Bearer patmMoL9dNRlRBYlS.8233b70fcc44e828f5355441457f76c1e7009afbecd532a9f6f78803e5185ce7'
    })
  }

  constructor(private client: HttpClient) { }

  getAll(): Observable<ToDos> {
    return this.client.get<ToDos>(this.url, this.headers)
  }

  delete(id: string) : Observable<any>{
    return this.client.delete(this.url + '/' + id, this.headers)
  }

  post(todo: PostToDo) : Observable<Record>{
    return this.client.post<Record>(this.url, todo, this.headers)
  }

  patch(todo: PostToDo, id: string) : Observable<Record>{
    return this.client.patch<Record>(this.url + '/' + id, todo, this.headers)
  }
}
