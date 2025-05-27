//-------------------------------- Users -----------------------------------//
export interface IUser {
    id_aluno: string;
    nome: string;
    endereco: string;
    cidade: string;
    estado: string;
    telefone: string;
    data_matricula?: string | undefined;
	data_vencimento?: string | undefined;
    data_desligamento?: string | undefined;
}

export interface IUserInput {
    nome: string;
    endereco: string;
    cidade: string;
    estado: string;
    telefone: string;
}

export interface IMatriculaInput {
    id_aluno: string;
    data_matricula?: string;
    data_desligamento?: string;
}

export interface IUserLoginInput {
    email: string;
    password: string;
}

export interface IPayment {
    id_pagamento: string;
    id_aluno: string;
    valor: string;
    tipo: string;
    data: string;
}

export interface IPaymentInput {
    id_aluno: string;
    valor: string;
    tipo: string;
}

//-------------------------------- Stores -----------------------------------//
export interface IUserStore {
    users: IUser[];
    user: IUser | null;
    setUsers: (users: IUser[]) => void;
    setUser: (user: IUser | null) => void;
    removeUser: (id: string) => void;
}

export interface IDialogStore {
    opened: boolean;
    open: () => void;
    close: () => void;
}

export interface IDialogMatriculaStore {
    opened_: boolean;
    open_: () => void;
    close_: () => void;
}

export interface IPaymentStore {
    payments: IPayment[];
    payment: IPayment | null;
    setPayments: (p: IPayment[]) => void;
    setPayment: (p: IPayment | null) => void;
    removePayment: (id: string) => void;
}