import { create } from "zustand";
import { IPayment, IPaymentStore } from "../models";

export const paymentStore = create<IPaymentStore>()((set) => ({
    payments: [],
    payment: {} as IPayment | null,
    setPayments: (newUsers: IPayment[]) => set(() => ({ payments: newUsers })),
    setPayment: (newUser: IPayment | null) => set(() => ({ payment: newUser })),
    removePayment: (id: string) => set((state) => ({ payments: state.payments.filter((u) => u.id_pagamento !== id) })),
}))