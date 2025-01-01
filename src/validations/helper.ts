export interface ErrorStructure {
    field?: string
    message: string
    params?: string
}

export function generateErrorStructure(field: string, message: string): ErrorStructure {
    return {
        field,
        message
    }
}

export function generateErrorStructureParams(params: string, message: string): ErrorStructure {
    return {
        params,
        message
    }
}

