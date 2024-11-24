// types/responses.ts
export interface ServiceResult<T> {
    status: boolean;
    data?: T;
    error?: string;
}

export interface FileUploadResult {
    secure_url: string;
    public_id: string;
}