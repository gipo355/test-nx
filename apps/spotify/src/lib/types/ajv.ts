export type TAjvError = {
    instancePath: string;
    schemaPath: string;
    keyword: string;
    params: { missingProperty: string };
    message: string;
};

export type TAjvValidateFunction = {
    (data: unknown): boolean;
    errors?: TAjvError[] | null;
};
