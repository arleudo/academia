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
import { IMatriculaInput, IUser } from "@/models";
import { UserService } from "@/services/UserService";
import { dialogStore, usersStore } from "@/store";
import { LogOutIcon, LucideNotebookPen, Pencil, Plus, Trash2 } from "lucide-react";
import { useEffect } from "react";

export function UsersTable() {
    useEffect(() => {
        new UserService().list();
    }, []);

    const { users, setUser } = usersStore();
    const { open } = dialogStore();

    const handleSave = () => {
        setUser({} as IUser);
        open();
    }

    const realizarMatricula = (id: string) => {

        const hoje = new Date();
        const dataFormatada = `${hoje.getFullYear()}-${String(hoje.getMonth() + 1).padStart(2, '0')}-${String(hoje.getDate()).padStart(2, '0')}`;

        const matricula = {
            id_aluno: id,
            data_matricula: dataFormatada
        } as IMatriculaInput;

        new UserService().matricular(matricula, toast);
    }

    const desmatricular = (id: string) => {

        const hoje = new Date();
        const dataFormatada = `${hoje.getFullYear()}-${String(hoje.getMonth() + 1).padStart(2, '0')}-${String(hoje.getDate()).padStart(2, '0')}`;

        const matricula = {
            id_aluno: id,
            data_desligamento: dataFormatada
        } as IMatriculaInput;

        new UserService().desmatricular(matricula, toast);
    }

    function formatarDataLocal(isoString?: string) {
        if (!isoString) return "";
        const date = new Date(isoString);
        // corrige com base no fuso local
        const localDate = new Date(date.getTime() + date.getTimezoneOffset() * 60000);
        return localDate.toLocaleDateString("pt-BR");
    }



    return (
        <div className="pl-4 pr-4 rounded-md flex items-center justify-center mx-auto max-w-6xl w-full">
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>Nome</TableHead>
                        <TableHead>Endereço</TableHead>
                        <TableHead>Cidade</TableHead>
                        <TableHead>Estado</TableHead>
                        <TableHead>Telefone</TableHead>
                        <TableHead>Data da Matrícula</TableHead>
                        <TableHead>Data do Vencimento</TableHead>
                        <TableHead>Data do Desligamento</TableHead>
                        <TableHead />
                    </TableRow>
                </TableHeader>
                <TableBody>{
                    users.map(user =>
                        <TableRow key={user.id_aluno} className="odd:bg-primary/10 hover:shadow-lg">
                            <TableCell>{user.nome}</TableCell>
                            <TableCell>{user.endereco}</TableCell>
                            <TableCell>{user.cidade}</TableCell>
                            <TableCell>{user.estado}</TableCell>
                            <TableCell>{user.telefone}</TableCell>
                            <TableCell>{formatarDataLocal(user.data_matricula)}</TableCell>
                            <TableCell>{formatarDataLocal(user.data_vencimento)}</TableCell>
                            <TableCell>{formatarDataLocal(user.data_desligamento)}</TableCell>
                            <TableCell className="flex flex-row gap-4 justify-end">
                                <FullStackTooltip children={< LucideNotebookPen className="hover:cursor-pointer text-accent-foreground/60" onClick={() => {
                                    realizarMatricula(user.id_aluno);
                                }} />} content="Clique para realizar a matricula do aluno." />
                                <FullStackTooltip children={< LogOutIcon className="hover:cursor-pointer text-accent-foreground/60" onClick={() => {
                                    desmatricular(user.id_aluno);
                                }} />} content="Clique para desmatricular o aluno." />
                                <FullStackTooltip children={< Pencil className="hover:cursor-pointer text-accent-foreground/60" onClick={() => {
                                    setUser(user);
                                    open();
                                }} />} content="Clique para editar o aluno." />

                                <FullStackTooltip children={< Trash2 className="hover:cursor-pointer text-accent-foreground/60" onClick={() => {
                                    new UserService().delete(user.id_aluno, toast);
                                }} />} content="Clique para deletar o aluno." />
                            </TableCell>
                        </TableRow>
                    )
                }
                </TableBody>
            </Table>
            <FullStackTooltip children={<Button className="fixed bottom-4 right-4 rounded-full h-14" onClick={handleSave}
            ><Plus /></Button>} content="Clique para criar um novo aluno." />

        </div>
    )
}
