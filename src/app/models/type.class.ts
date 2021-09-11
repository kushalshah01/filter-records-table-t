import { StatusModel } from "./status.class";

export class TypeModel extends StatusModel {
    constructor(init?: Partial<TypeModel>) {
        super();
        Object.assign(this, init);
    }
}