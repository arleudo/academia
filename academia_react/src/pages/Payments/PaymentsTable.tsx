import { FullStackTooltip } from "@/components";
import { Button } from "@/components/ui/button";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import { toast } from "@/hooks/use-toast";
import { IPayment } from "@/models";
import { UserService } from "@/services";
import { PaymentService } from "@/services/PaymentService";
import { dialogStore, paymentStore, usersStore } from "@/store";
import { Pencil, Plus, Trash2 } from "lucide-react";
import { useEffect } from "react";

export function PaymentsTable() {
    useEffect(() => {
        new PaymentService().list();
        new UserService().list();
    }, []);

    const { payments, setPayment } = paymentStore();
    const { users } = usersStore();
    const { open } = dialogStore();

    const handleSave = () => {
        setPayment({} as IPayment);
        open();
    }

    return (
        <div className="pl-4 pr-4 rounded-md flex items-center justify-center mx-auto max-w-6xl w-full">
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>Aluno</TableHead>
                        <TableHead>Tipo</TableHead>
                        <TableHead>Valor</TableHead>
                        <TableHead>Data</TableHead>
                        <TableHead />
                    </TableRow>
                </TableHeader>
                <TableBody>{
                    payments.map(payment =>
                        <TableRow key={payment.id_pagamento} className="odd:bg-primary/10 hover:shadow-lg">
                            <TableCell>{users.find((user) => user.id_aluno == payment.id_aluno)?.nome }</TableCell>
                            <TableCell>{payment.tipo}</TableCell>
                            <TableCell>{payment.valor}</TableCell>
                            <TableCell>{new Date(payment.data).toLocaleDateString()}</TableCell>
                            <TableCell className="flex flex-row gap-4 justify-end">
                                <FullStackTooltip children={< Pencil className="hover:cursor-pointer text-accent-foreground/60" onClick={() => {
                                    setPayment(payment);
                                    open();
                                }} />} content="Clique para editar o pagamento." />

                                <FullStackTooltip children={< Trash2 className="hover:cursor-pointer text-accent-foreground/60" onClick={() => {
                                    new PaymentService().delete(payment.id_pagamento, toast);
                                }} />} content="Clique para deletar o pagamento." />
                            </TableCell>
                        </TableRow>
                    )
                }
                </TableBody>
            </Table>
            <FullStackTooltip children={<Button className="fixed bottom-4 right-4 rounded-full h-14" onClick={handleSave}
            ><Plus /></Button>} content="Clique para criar um novo pagamento." />

        </div>
    )
}
