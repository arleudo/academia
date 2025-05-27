from pydantic import BaseModel, Field, validator
from typing import Literal

class PagamentoCreateSchema(BaseModel):
    id_aluno: int = Field(...)
    valor: float = Field(...)
    tipo: Literal["dinheiro", "cartão"]

    class Config:
        extra = "forbid"

