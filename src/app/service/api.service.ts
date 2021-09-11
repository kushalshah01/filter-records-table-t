import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { TicketModel } from '../models/ticket.class';
import Swal from 'sweetalert2'

@Injectable({
    providedIn: 'root'
})

export class ApiService {

    public REST_API_SERVER = "http://localhost:3000";
    httpOptions = {
        headers: new HttpHeaders({
            'Content-Type': 'application/json'
        })
    }

    constructor(private httpClient: HttpClient) { }

    public sendGetRequest<T>(url): Observable<T> {
        return this.httpClient.get<T>(url).pipe(catchError(this.errorHandler));
    }

    public sendUpdateRequest<T>(url, data): Observable<T> {
        return this.httpClient.put<T>(url, JSON.stringify(data), this.httpOptions)
            .pipe(catchError(this.errorHandler))
    }

    errorHandler(error) {
        let errorMessage = '';
        if (error.error instanceof ErrorEvent) {
            // Get client-side error
            errorMessage = error.error.message;
        } else {
            // Get server-side error
            errorMessage = `Error Code: ${error.status}\nMessage: ${error.message}`;
        }
        Swal.fire({ title: "Something went wrong!", text: errorMessage, icon: "error" })
        console.log(errorMessage);
        return throwError(errorMessage);
    }
}