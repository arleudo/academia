from flask import Flask, g
from models.aluno_db import AlunoDB
from models.pagamento_db import PagamentoDB
from flask_cors import CORS

app = Flask(__name__)
CORS(app)
app.config['DATABASE'] = 'academia.db'

db_instance = AlunoDB(app.config['DATABASE'])
db_instance.create_table()

pagamento_db_instance = PagamentoDB(app.config['DATABASE'])
pagamento_db_instance.create_table()

@app.before_request
def before_request():
    db_instance.get_db()
    pagamento_db_instance.get_db()

@app.teardown_appcontext
def teardown_db(exception):
    db_instance.close_db()
    pagamento_db_instance.close_db()

app.db_instance = db_instance
app.pagamento_db_instance = pagamento_db_instance

from routes.aluno_routes import aluno_bp
from routes.pagamento_routes import pagamento_bp

app.register_blueprint(aluno_bp)
app.register_blueprint(pagamento_bp)

if __name__ == '__main__':
    app.run(debug=True)