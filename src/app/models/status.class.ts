export class StatusModel {
    id: number;
    name: string;
    friendlyName: string;
    isActive: boolean = false;
    constructor(init?: Partial<StatusModel>) {
        Object.assign(this, init);
    }
}