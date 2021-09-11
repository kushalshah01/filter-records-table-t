import { Component, OnInit, TemplateRef } from '@angular/core';
import { StatusModel } from './models/status.class';
import { TicketModel } from './models/ticket.class';
import { TypeModel } from './models/type.class';
import { UserModel } from './models/user.class';
import { ApiService } from './service/api.service';
import * as _ from "lodash";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {

  title = 'code-test';
  userId: number = 1;
  selectedValue: { fieldName: string, value: number } = { fieldName: '', value: null };

  userDetail: UserModel = new UserModel();
  typeList: Array<TypeModel> = new Array<TypeModel>();
  statusList: Array<StatusModel> = new Array<StatusModel>();
  allTickets: Array<TicketModel> = new Array<TicketModel>();
  filteredTickets: Array<TicketModel> = new Array<TicketModel>();

  toasts: any[] = [];
  constructor(private _apiService: ApiService) { }
  ngOnInit(): void {
    this.getUser();
    this.getType();
    this.getStatus();
    this.getTickets();
  }

  getCount(value: number, fieldName: string) {
    return _.filter(this.allTickets, ticket => { return ticket[fieldName] === value }).length;
  }

  getUserIconColorClass() {
    if (this.allTickets.length >= 1 && this.allTickets.filter(ticket => ticket.status === _.find(this.statusList, list => { return list.name == 'Completed' }).id).length == this.allTickets.length) {
      return "text-success";
    } else if (this.allTickets.length >= 1 && this.allTickets.filter(ticket => ticket.status === _.find(this.statusList, list => { return list.name == 'NotStarted' }).id).length == this.allTickets.length) {
      return "text-danger";
    } else if (this.allTickets.length >= 1 && !!this.allTickets.find(ticket => ticket.status === _.find(this.statusList, list => { return list.name == 'InProgress' }).id)) {
      return "text-primary";
    } else {
      return "text-danger";
    }
  }

  filterRecord(value: number, fieldName: string, object) {
    object.isActive = !object.isActive;
    if (object.isActive) {
      this.selectedValue = { fieldName: fieldName, value: value };
      this.filteredTickets = _.filter(this.allTickets, ticket => { return ticket[fieldName] === value });

      if (fieldName == 'type') {
        _.each(this.typeList, list => { list.isActive = list.id != object.id ? false : list.isActive; });
        _.each(this.statusList, list => { list.isActive = false; });
      } else {
        _.each(this.statusList, list => { list.isActive = list.id != object.id ? false : list.isActive; });
        _.each(this.typeList, list => { list.isActive = false; });
      }
    } else {
      this.filteredTickets = [];
    }
  }

  updateRecord(ticket: TicketModel, val) {
    ticket.status = Number(val);
    this._apiService.sendUpdateRequest<TicketModel>(this._apiService.REST_API_SERVER + '/ticket/' + ticket.id, ticket)
      .subscribe(ticket => {
        if (!!ticket) {
          this.refreshTicketsAndFilterRecords();
        } else {
          //need to show alert not updated...
        }
      });
  }

  getStatusDetailByName(name: string) {
    return _.find(this.statusList, list => list.name === name).id;
  }

  private refreshTicketsAndFilterRecords() {
    this._apiService.sendGetRequest<Array<TicketModel>>(this._apiService.REST_API_SERVER + '/ticket')
      .subscribe(tickets => {
        this.allTickets = tickets;
        this.filteredTickets = _.filter(this.allTickets, ticket => { return ticket[this.selectedValue.fieldName] === this.selectedValue.value });
      });
  }

  private getUser() {
    this._apiService.sendGetRequest<UserModel>(this._apiService.REST_API_SERVER + '/user/' + this.userId).subscribe(user => { this.userDetail = user; });
  }

  private getType() {
    this._apiService.sendGetRequest<Array<TypeModel>>(this._apiService.REST_API_SERVER + '/type').subscribe(type => { this.typeList = type; _.each(this.typeList, list => { list.isActive = false; }); });
  }

  private getStatus() {
    this._apiService.sendGetRequest<Array<StatusModel>>(this._apiService.REST_API_SERVER + '/status').subscribe(status => { this.statusList = status; _.each(this.statusList, list => { list.isActive = false; }); });
  }

  private getTickets() {
    this._apiService.sendGetRequest<Array<TicketModel>>(this._apiService.REST_API_SERVER + '/ticket').subscribe(tickets => { this.allTickets = tickets; });
  }
}
