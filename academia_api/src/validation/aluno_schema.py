from pydantic import BaseModel, Field, validator
from typing import Optional
from datetime import date

class AlunoCreateSchema(BaseModel):
    nome: str = Field(..., min_length=4)
    endereco: str = Field(..., min_length=4)
    cidade: str = Field(..., min_length=3)
    estado: str = Field(..., min_length=2)
    telefone: str = Field(..., min_length=8)
    
    class Config:
        extra = "forbid"

class MatriculaSchema(BaseModel):
    data_matricula: date = Field(...)
    
    class Config:
        extra = "forbid"

class DesmatriculaSchema(BaseModel):
    data_desligamento: date = Field(...)

    class Config:
        extra = "forbid"
