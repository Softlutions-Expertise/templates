export interface IObjectCodDescricao {
    cod: number;
    descricao: string;
}

export interface IObjectId {
    id: number;
}

export interface IObjectIdNome extends IObjectId {
    nome: string;
}

export interface IObjectUuid {
    id?: string;
}
