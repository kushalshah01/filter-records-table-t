export class UserModel {
    id: number;
    name: string;
    status: number;
    constructor(init?: Partial<UserModel>) {
        Object.assign(this, init);
    }
}