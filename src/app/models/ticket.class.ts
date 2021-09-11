export class TicketModel {
    id: number;
    description: string;
    assignee: number;
    type:number;
    status:number;
    constructor(init?: Partial<TicketModel>) {
        Object.assign(this, init);
    }
}