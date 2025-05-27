from flask import Blueprint, request, jsonify, current_app
from datetime import date, timedelta
from validation.aluno_schema import MatriculaSchema, AlunoCreateSchema, DesmatriculaSchema
from pydantic import ValidationError

aluno_bp = Blueprint('aluno', __name__)

@aluno_bp.route('/alunos', methods=['POST'])
def create_aluno():
    try:
        data = request.get_json()
        aluno = AlunoCreateSchema(**data)

        db = current_app.db_instance
        aluno_id = db.create_aluno(**aluno.dict())
        return jsonify({"id_aluno": aluno_id}), 201

    except ValidationError as e:
        return jsonify({"error": e.errors()}), 400
    except Exception as e:
        return jsonify({"error": f"Erro interno: {str(e)}"}), 500

@aluno_bp.route('/alunos', methods=['GET'])
def read_alunos():
    db = current_app.db_instance
    alunos = db.read_alunos()
    return jsonify([dict(aluno) for aluno in alunos]), 200

@aluno_bp.route('/alunos/<int:aluno_id>', methods=['GET'])
def read_aluno(aluno_id):
    db = current_app.db_instance
    aluno = db.read_aluno(aluno_id)
    if aluno is None:
        return jsonify({"erro": "Aluno não encontrado"}), 404
    return jsonify(dict(aluno)), 200

@aluno_bp.route('/alunos/<int:aluno_id>', methods=['PUT'])
def update_aluno(aluno_id):
    db = current_app.db_instance
    aluno_atual = db.read_aluno(aluno_id)

    if aluno_atual is None:
        return jsonify({"erro": "Aluno não encontrado"}), 404
    
    data_matricula = aluno_atual["data_matricula"]
    data_vencimento = aluno_atual["data_vencimento"]
    data_desligamento = aluno_atual["data_desligamento"]

    data = request.get_json()
    dados_completos = {
        "nome": data.get('nome', aluno_atual['nome']),
        "endereco": data.get('endereco', aluno_atual['endereco']),
        "cidade": data.get('cidade', aluno_atual['cidade']),
        "estado": data.get('estado', aluno_atual['estado']),
        "telefone": data.get('telefone', aluno_atual['telefone'])
    }
    
    try:
        aluno_validado = AlunoCreateSchema(**dados_completos)
    except ValidationError as e:
        return jsonify({"erros": e.errors()}), 400

    db.update_aluno(
        aluno_id,
        aluno_validado.nome,
        aluno_validado.endereco,
        aluno_validado.cidade,
        aluno_validado.estado,
        aluno_validado.telefone,
        data_matricula,
        data_desligamento,
        data_vencimento        
    )

    return jsonify({"mensagem": "Aluno atualizado com sucesso"}), 200

@aluno_bp.route('/alunos/<int:aluno_id>', methods=['DELETE'])
def delete_aluno(aluno_id):
    db = current_app.db_instance
    aluno = db.read_aluno(aluno_id)

    if aluno is None:
        return jsonify({"erro": "Aluno não encontrado"}), 404

    if aluno['data_matricula'] and not aluno['data_desligamento']:
        return jsonify({"erro": "Não é possível excluir um aluno matriculado"}), 400

    db.delete_aluno(aluno_id)
    return jsonify({"mensagem": "Aluno deletado com sucesso"}), 200

@aluno_bp.route('/alunos/<int:aluno_id>/matricula', methods=['PUT'])
def matricular_aluno(aluno_id):
    db = current_app.db_instance

    aluno = db.read_aluno(aluno_id)
    if aluno is None:
        return jsonify({"erro": "Aluno não encontrado"}), 404

    if aluno['data_matricula']:
        return jsonify({"erro": "Aluno já está matriculado"}), 400

    try:
        data = request.get_json()
        print(data)
        dados_matricula = MatriculaSchema(**data)
        print(dados_matricula)
    except ValidationError as e:
        return jsonify({"erro": e.errors()}), 400
    except Exception as e:
        return jsonify({"erro": str(e)}), 500

    data_matricula = dados_matricula.data_matricula
    data_vencimento = data_matricula + timedelta(days=30)
    data_desligamento = None

    db.update_aluno(
        aluno_id,
        aluno['nome'],
        aluno['endereco'],
        aluno['cidade'],
        aluno['estado'],
        aluno['telefone'],
        data_matricula.isoformat(),
        data_desligamento,
        data_vencimento.isoformat()
    )    


    return jsonify({
        "data_matricula": data_matricula.isoformat(),
        "data_vencimento": data_vencimento.isoformat()
    }), 200
    
@aluno_bp.route('/alunos/<int:aluno_id>/desmatricula', methods=['PUT'])
def desmatricular_aluno(aluno_id):
    db = current_app.db_instance

    aluno = db.read_aluno(aluno_id)
    if aluno is None:
        return jsonify({"erro": "Aluno não encontrado"}), 404

    try:
        data = request.get_json()
        dados_desmatricula = DesmatriculaSchema(**data)
    except ValidationError as e:
        return jsonify({"erro": e.errors()}), 400
    
    db.update_aluno(
        aluno_id,
        aluno['nome'],
        aluno['endereco'],
        aluno['cidade'],
        aluno['estado'],
        aluno['telefone'],
        data_matricula=None,
        data_desligamento=dados_desmatricula.data_desligamento.isoformat(),
        data_vencimento=None
    )

    return jsonify({
        "mensagem": "Aluno desmatriculado com sucesso",
        "data_desligamento": dados_desmatricula.data_desligamento.isoformat()
    }), 200

