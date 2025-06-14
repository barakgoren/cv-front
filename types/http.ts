export type HttpResponse<T = any> = {
    data: T;
    meta: {
        code: number;
        title: string;
        message: string;
    }
}