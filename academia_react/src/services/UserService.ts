import { IMatriculaInput, IUser, IUserInput } from "@/models";
import { usersStore } from "@/store";
import axios from "axios";

export class UserService {
    public list = async () => {
        const { setUsers } = usersStore.getState();

        const users = (await axios.get(import.meta.env.VITE_URL_BACK_END + "/alunos")).data;
        setUsers(users);
    }

    public create = async (user: IUserInput, toast: ({ }) => void) => {
        const { users, setUsers } = usersStore.getState();
        try {
            const ret = (await axios.post(import.meta.env.VITE_URL_BACK_END + "/alunos", user)).data;
            setUsers([...users, { ...user, id_aluno: ret.id_aluno.toString() }]);
            toast({
                title: "Sucesso",
                description: "Usuário cadastrado com sucesso!",
            });
        } catch (error) {
            toast({
                title: "Erro",
                variant: "destructive",
                description: "Erro ao cadastrar o aluno"
            });
        }
    }

    public matricular = async (matricula: IMatriculaInput, toast: ({ }) => void) => {
        const { users, setUsers } = usersStore.getState();
        console.log(matricula);
        
        let ret;
        try {
            ret = (await axios.put(
                import.meta.env.VITE_URL_BACK_END + "/alunos/" + matricula.id_aluno + "/matricula",
                { data_matricula: matricula.data_matricula }
            )).data;

            const usuarioExistente = users.find(u => u.id_aluno === matricula.id_aluno);

            if (!usuarioExistente) {
                toast({
                    title: "Erro",
                    variant: "destructive",
                    description: "Usuário não encontrado para atualizar matrícula",
                });
                return;
            }

            const usuarioAtualizado = {
                ...usuarioExistente,
                data_matricula: ret.data_matricula,
                data_vencimento: ret.data_vencimento,
                data_desligamento: undefined,
            };

            const novosUsuarios = users.map(u =>
                u.id_aluno === matricula.id_aluno ? usuarioAtualizado : u
            );

            setUsers(novosUsuarios);

            toast({
                title: "Sucesso",
                description: "Usuário matriculado com sucesso!",
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

    public desmatricular = async (matricula: IMatriculaInput, toast: ({ }) => void) => {
        const { users, setUsers } = usersStore.getState();
        let ret;
        try {
            ret = (await axios.put(
                import.meta.env.VITE_URL_BACK_END + "/alunos/" + matricula.id_aluno + "/desmatricula",
                { data_desligamento: matricula.data_desligamento }
            )).data;

            const usuarioExistente = users.find(u => u.id_aluno === matricula.id_aluno);

            if (!usuarioExistente) {
                toast({
                    title: "Erro",
                    variant: "destructive",
                    description: "Usuário não encontrado para atualizar matrícula",
                });
                return;
            }

            const usuarioAtualizado = {
                ...usuarioExistente,
                data_desligamento: ret.data_desligamento,
                data_vencimento: ret.data_vencimento,
                data_matricula: undefined,
            };

            const novosUsuarios = users.map(u =>
                u.id_aluno === matricula.id_aluno ? usuarioAtualizado : u
            );

            setUsers(novosUsuarios);

            toast({
                title: "Sucesso",
                description: "Usuário desmatriculado com sucesso!",
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

    public update = async (user: IUser, toast: ({ }) => void) => {
        const { users, setUsers } = usersStore.getState();
        try {
            await axios.put(import.meta.env.VITE_URL_BACK_END + "/alunos/" + user.id_aluno, user);
            const index = users.findIndex((u: IUser) => u.id_aluno === user.id_aluno);

            if (index !== -1) {
                const updatedUsers = [...users];
                updatedUsers[index] = user;
                setUsers(updatedUsers);
            }
            toast({
                title: "Sucesso",
                description: "Usuário atualizado com sucesso!",
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
        const { removeUser } = usersStore.getState();

        try {
            await axios.delete(import.meta.env.VITE_URL_BACK_END + "/alunos/" + id);
            removeUser(id);
            toast({
                title: "Sucesso",
                description: "Usuário removido com sucesso!",
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