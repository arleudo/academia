import sqlite3
from flask import g


class AlunoDB:
    def __init__(self, db_name="academia.db"):
        self.db_name = db_name

    def get_db(self):
        if 'db' not in g:
            g.db = sqlite3.connect(self.db_name)
            g.db.row_factory = sqlite3.Row
        return g.db

    def close_db(self):
        db = g.pop('db', None)
        if db is not None:
            db.close()

    def create_table(self):
        try:
            db = sqlite3.connect(self.db_name)
            cursor = db.cursor()
            cursor.execute("""
                CREATE TABLE IF NOT EXISTS aluno (
                    id_aluno INTEGER PRIMARY KEY AUTOINCREMENT,
                    nome TEXT NOT NULL,
                    endereco TEXT NOT NULL,
                    cidade TEXT NOT NULL,
                    estado TEXT NOT NULL,
                    telefone TEXT NOT NULL,
                    data_matricula DATE,                           
                    data_desligamento DATE,
                    data_vencimento DATE
                )
            """)
            db.commit()
        except sqlite3.Error as e:
            print(f"[ERRO] Falha ao criar tabela: {e}")
        finally:
            db.close()

    def create_aluno(self, nome, endereco, cidade, estado, telefone,
                     data_matricula=None, data_desligamento=None, data_vencimento=None):
        try:
            db = self.get_db()
            cursor = db.cursor()
            cursor.execute("""
                INSERT INTO aluno (
                    nome, endereco, cidade, estado, telefone,
                    data_matricula, data_desligamento, data_vencimento
                )
                VALUES (?, ?, ?, ?, ?, ?, ?, ?)
            """, (nome, endereco, cidade, estado, telefone,
                  data_matricula, data_desligamento, data_vencimento))
            db.commit()
            return cursor.lastrowid
        except sqlite3.Error as e:
            print(f"[ERRO] Falha ao inserir aluno: {e}")
            return None

    def read_alunos(self):
        try:
            db = self.get_db()
            cursor = db.cursor()
            cursor.execute("SELECT * FROM aluno")
            return cursor.fetchall()
        except sqlite3.Error as e:
            print(f"[ERRO] Falha ao buscar alunos: {e}")
            return []

    def read_aluno(self, aluno_id):
        try:
            db = self.get_db()
            cursor = db.cursor()
            cursor.execute("SELECT * FROM aluno WHERE id_aluno = ?", (aluno_id,))
            return cursor.fetchone()
        except sqlite3.Error as e:
            print(f"[ERRO] Falha ao buscar aluno: {e}")
            return None

    def update_aluno(self, aluno_id, nome, endereco, cidade, estado, telefone,
                     data_matricula=None, data_desligamento=None, data_vencimento=None):
        try:
            db = self.get_db()
            cursor = db.cursor()
            cursor.execute("""
                UPDATE aluno
                SET nome = ?, endereco = ?, cidade = ?, estado = ?, telefone = ?,
                    data_matricula = ?, data_desligamento = ?, data_vencimento = ?
                WHERE id_aluno = ?
            """, (nome, endereco, cidade, estado, telefone,
                  data_matricula, data_desligamento, data_vencimento, aluno_id))
            db.commit()
        except sqlite3.Error as e:
            print(f"[ERRO] Falha ao atualizar aluno: {e}")

    def delete_aluno(self, aluno_id):
        try:
            db = self.get_db()
            cursor = db.cursor()
            cursor.execute("DELETE FROM aluno WHERE id_aluno = ?", (aluno_id,))
            db.commit()
        except sqlite3.Error as e:
            print(f"[ERRO] Falha ao excluir aluno: {e}")
