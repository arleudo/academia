import { Button } from "@/components/ui";
import { useNavigate } from 'react-router-dom';
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"

const cardContent = [
    { id: 1, title: "Alunos", description: "Parte responsável por gerenciar os alunos da aplicação", content: "Aqui voce pode criar, editar e remover os alunos da aplicação", route: '/alunos' },
    { id: 2, title: "Pagamentos", description: "Parte responsável por gerenciar os pagamentos", content: "Aqui voce pode criar, editar e remover os pagamnentos dos alunos", route: '/pagamentos' },
]


export function Home() {
    const navigate = useNavigate();

    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 p-4 mt-14">
            {cardContent.map((card) =>
                <Card key={card.id} className="bg-transparent shadow-md rounded-lg p-6 h-full flex flex-col hover:shadow-xl transition-transform transform hover:scale-101 duration-75">
                    <CardHeader>
                        <CardTitle>{card.title}</CardTitle>
                        <CardDescription>{card.description}</CardDescription>
                    </CardHeader>
                    <CardContent className="flex-1">
                        <p>{card.content}</p>
                    </CardContent>
                    <CardFooter >
                        <Button className="w-full" onClick={() => {
                            navigate(card.route);
                        }}>
                            Navegar
                        </Button>
                    </CardFooter>
                </Card>)}

        </div>
    );
}