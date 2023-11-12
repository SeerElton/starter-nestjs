export class Result<T> {
    isSuccess: boolean = false;
    value: T;

    constructor();
    constructor(isSuccess?: boolean);
    constructor(isSuccess?: boolean, value?: T) {
        if (value)
            this.value = value;
        if (isSuccess)
            this.isSuccess = isSuccess;
    }
}