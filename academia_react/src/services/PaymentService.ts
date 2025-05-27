import { IPayment, IPaymentInput } from "@/models";
import { paymentStore } from "@/store";
import axios from "axios";

export class PaymentService {
    public list = async () => {
        const { setPayments } = paymentStore.getState();

        const payments = (await axios.get(import.meta.env.VITE_URL_BACK_END + "/pagamentos")).data;
        setPayments(payments);
    }

    public create = async (payment: IPaymentInput, toast: ({ }) => void) => {
        const { payments, setPayments } = paymentStore.getState();
        try {
            const ret = (await axios.post(import.meta.env.VITE_URL_BACK_END + "/pagamentos", payment)).data;
            setPayments([...payments, { ...payment, id_pagamento: ret.id_pagamento.toString(), data: new Date().toLocaleDateString()}]);
            toast({
                title: "Sucesso",
                description: "Pagamento cadastrado com sucesso!",
            });
        } catch (error) {
            if (axios.isAxiosError(error)) {
                toast({
                    title: "Erro",
                    variant: "destructive",
                    description: error.response?.data.erro,
                });
            }
        }
    }    

    public update = async (payment: IPayment, toast: ({ }) => void) => {
        const { payments, setPayments } = paymentStore.getState();
        try {
            await axios.put(import.meta.env.VITE_URL_BACK_END + "/pagamentos/" + payment.id_pagamento, payment);
            const index = payments.findIndex((u: IPayment) => u.id_pagamento === payment.id_pagamento);

            if (index !== -1) {
                const updatedpayments = [...payments];
                updatedpayments[index] = payment;
                setPayments(updatedpayments);
            }
            toast({
                title: "Sucesso",
                description: "Pagamento atualizado com sucesso!",
            });
        } catch (error) {
            if (axios.isAxiosError(error)) {
                toast({
                    title: "Erro",
                    variant: "destructive",
                    description: error.response?.data,
                });
            }
        }
    }

    public delete = async (id: string, toast: ({ }) => void) => {
        const { removePayment } = paymentStore.getState();

        try {
            await axios.delete(import.meta.env.VITE_URL_BACK_END + "/pagamentos/" + id);
            removePayment(id);
            toast({
                title: "Sucesso",
                description: "Pagamento removido com sucesso!",
            });
        } catch (error) {
            if (axios.isAxiosError(error)) {
                toast({
                    title: "Erro",
                    variant: "destructive",
                    description: error.response?.data.erro,
                });
            }
        }
    }
}