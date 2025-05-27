import sqlite3
from flask import g

class PagamentoDB:
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
        db = sqlite3.connect(self.db_name)
        cursor = db.cursor()
        cursor.execute("""
            CREATE TABLE IF NOT EXISTS pagamento (
                id_pagamento INTEGER PRIMARY KEY AUTOINCREMENT,
                id_aluno INTEGER NOT NULL,
                data TEXT NOT NULL,
                valor REAL NOT NULL,
                tipo TEXT CHECK(tipo IN ('dinheiro', 'cartão')) NOT NULL,
                FOREIGN KEY(id_aluno) REFERENCES aluno(id_aluno)
            )
        """)
        db.commit()
        db.close()

    def create_pagamento(self, id_aluno, data, valor, tipo):
        db = self.get_db()
        cursor = db.cursor()
        cursor.execute("""
            INSERT INTO pagamento (id_aluno, data, valor, tipo)
            VALUES (?, ?, ?, ?)
        """, (id_aluno, data, valor, tipo))
        db.commit()
        return cursor.lastrowid

    def read_pagamentos(self):
        db = self.get_db()
        cursor = db.cursor()
        cursor.execute("SELECT * FROM pagamento")
        return cursor.fetchall()

    def delete_pagamento(self, pagamento_id):
        db = self.get_db()
        cursor = db.cursor()
        cursor.execute("DELETE FROM pagamento WHERE id_pagamento = ?", (pagamento_id,))
        db.commit()