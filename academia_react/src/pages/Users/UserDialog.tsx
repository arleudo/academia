
import { Save } from "lucide-react"
import { FullStackTooltip } from "@/components";
import { Button, Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, Input, Label } from "@/components/ui";
import { UserService } from "@/services/UserService";
import { useToast } from "@/hooks/use-toast";
import { dialogStore, usersStore } from "@/store";
import { IUserInput } from "@/models";

export function UserDialog() {
    const { opened, close } = dialogStore();
    const { user, setUser } = usersStore();
    const { toast } = useToast();
    

    const handleCreate = () => {
        console.log(user);
        if (!user?.id_aluno) {
            new UserService().create(user as IUserInput, toast);
        }
        else {
            new UserService().update(user, toast)
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
                    <Label>Nome</Label>
                    <Input id="nome" className="col-span-3" defaultValue={user?.nome || ""} onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                        const nome = e.target.value;
                        setUser({ ...user!, nome });
                    }} />
                    <Label>Endereço</Label>
                    <Input id="endereco" className="col-span-3" defaultValue={user?.endereco || ""} onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                        const endereco = e.target.value;
                        setUser({ ...user!, endereco });
                    }} />
                    <Label>Cidade</Label>
                    <Input id="cidade" className="col-span-3" defaultValue={user?.cidade || ""} onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                        const cidade = e.target.value;
                        setUser({ ...user!, cidade });
                    }} />
                    <Label>Estado</Label>
                    <Input id="estado" className="col-span-3" defaultValue={user?.estado || ""} onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                        const estado = e.target.value;
                        setUser({ ...user!, estado });
                    }} />
                    <Label>Telefone</Label>
                    <Input id="telefone" className="col-span-3" defaultValue={user?.telefone || ""} onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                        const telefone = e.target.value;
                        setUser({ ...user!, telefone });
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
