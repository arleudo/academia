from flask import Blueprint, request, jsonify, current_app
from pydantic import ValidationError
from datetime import date
from validation.pagamento_schema import PagamentoCreateSchema

pagamento_bp = Blueprint('pagamento', __name__)

@pagamento_bp.route('/pagamentos', methods=['POST'])
def create_pagamento():
    try:
        data = request.get_json()
        pagamento = PagamentoCreateSchema(**data)

        db = current_app.pagamento_db_instance
        aluno_db = current_app.db_instance

        aluno = aluno_db.read_aluno(pagamento.id_aluno)
        if not aluno:
            return jsonify({"erro": "Aluno não encontrado"}), 404

        if aluno["data_matricula"] is None:
            return jsonify({"erro": "Não é possível realizar pagamento. Aluno não está matriculado."}), 400

        pagamento_id = db.create_pagamento(
            pagamento.id_aluno,
            date.today().isoformat(),
            pagamento.valor,
            pagamento.tipo
        )

        return jsonify({"id_pagamento": pagamento_id}), 201

    except ValidationError as e:
        return jsonify({"erro": e.errors()}), 400
    except Exception as e:
        return jsonify({"erro": f"Erro interno: {str(e)}"}), 500


@pagamento_bp.route('/pagamentos', methods=['GET'])
def read_pagamentos():
    db = current_app.pagamento_db_instance
    pagamentos = db.read_pagamentos()
    return jsonify([dict(pagamento) for pagamento in pagamentos]), 200


@pagamento_bp.route('/pagamentos/<int:pagamento_id>', methods=['DELETE'])
def delete_pagamento(pagamento_id):
    db = current_app.pagamento_db_instance
    db.delete_pagamento(pagamento_id)
    return jsonify({"mensagem": "Pagamento deletado com sucesso"}), 200

@pagamento_bp.route('/pagamentos/<int:pagamento_id>', methods=['PUT'])
def update_pagamento(pagamento_id):
    try:
        data = request.get_json()
        pagamento = PagamentoCreateSchema(**data)

        db = current_app.pagamento_db_instance
        aluno_db = current_app.db_instance

        aluno = aluno_db.read_aluno(pagamento.id_aluno)
        if not aluno:
            return jsonify({"erro": "Aluno não encontrado"}), 404

        if aluno["data_matricula"] is None:
            return jsonify({"erro": "Não é possível atualizar o pagamento. Aluno não está matriculado."}), 400

        pagamento_existente = db.read_pagamento(pagamento_id)
        if not pagamento_existente:
            return jsonify({"erro": "Pagamento não encontrado"}), 404

        db.update_pagamento(
            pagamento_id,
            pagamento.id_aluno,
            pagamento.valor,
            pagamento.tipo
        )

        return jsonify({"mensagem": "Pagamento atualizado com sucesso"}), 200

    except ValidationError as e:
        return jsonify({"erro": e.errors()}), 400
    except Exception as e:
        return jsonify({"erro": f"Erro interno: {str(e)}"}), 500
