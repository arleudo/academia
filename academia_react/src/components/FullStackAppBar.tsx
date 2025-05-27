import { LucideHome} from "lucide-react";
import { useNavigate } from "react-router-dom";

export function FullStackAppBar() {
    const navigate = useNavigate();

    return (
        <header className="w-full bg-primary shadow-md fixed top-0">
            <div className="mx-auto px-4 py-2 flex justify-between items-center">
                <div className="flex items-center space-x-4">
                    <LucideHome className="w-6 h-6 text-destructive-foreground hover:cursor-pointer"  onClick={()=>{
                        navigate('/');
                    }}/>
                    <span className="text-xl text-destructive-foreground font-semibold">Academia</span>
                </div>

                <div className="flex items-center gap-4 text-destructive-foreground">
                </div>
            </div>
        </header>
    );
}
