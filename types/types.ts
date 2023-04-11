export type ResponseData<T = any> = {
    code: number,
    message: string,
    data: T,
    token?: string
}