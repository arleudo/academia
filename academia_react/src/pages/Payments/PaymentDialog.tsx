
import { Save } from "lucide-react"
import { FullStackTooltip } from "@/components";
import { Button, Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, Input, Label } from "@/components/ui";
import { PaymentService } from "@/services/PaymentService";
import { useToast } from "@/hooks/use-toast";
import { dialogStore, paymentStore } from "@/store";
import { IPaymentInput } from "@/models";

export function PaymentDialog() {
    const { opened, close } = dialogStore();
    const { payment, setPayment } = paymentStore();
    const { toast } = useToast();
    

    const handleCreate = () => {
        console.log(payment);
        if (!payment?.id_pagamento) {
            new PaymentService().create(payment as IPaymentInput, toast);
        }
        else {
            new PaymentService().update(payment, toast)
        }
        close();
    }

    return (
        <Dialog open={opened} onOpenChange={close}>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Usuário</DialogTitle>
                    <DialogDescription>
                        Insira os dados nos campos abaixo. Clique no botão salvar para finalizar.
                    </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                    <Label>Id do aluno</Label>
                    <Input id="id_aluno" className="col-span-3" defaultValue={payment?.id_aluno || ""} onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                        const id_aluno = e.target.value;
                        setPayment({ ...payment!, id_aluno });
                    }} />
                    <Label>Tipo</Label>
                    <Input id="tipo" className="col-span-3" defaultValue={payment?.tipo || ""} onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                        const tipo = e.target.value;
                        setPayment({ ...payment!, tipo });
                    }} />
                    <Label>Valor</Label>
                    <Input id="valor" className="col-span-3" defaultValue={payment?.valor || ""} onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                        const valor = e.target.value;
                        setPayment({ ...payment!, valor });
                    }} />
                </div>
                <DialogFooter>
                    <FullStackTooltip
                        children={<Button onClick={handleCreate} onKeyDown={(event) => {
                            if (event.key === "Enter") {
                                handleCreate();
                            }
                        }}><Save /></Button>}
                        content="Clique para salvar o usuário" />

                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}
