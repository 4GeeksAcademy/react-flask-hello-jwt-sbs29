"""
This module takes care of starting the API Server, Loading the DB and Adding the endpoints
"""
from flask import Flask, request, jsonify, url_for, Blueprint
from flask_jwt_extended import create_access_token, get_jwt_identity, get_jwt, jwt_required
from api.models import db, User, TokenBlockedList
from api.utils import generate_sitemap, APIException
from flask_cors import CORS
from flask_bcrypt import Bcrypt

app = Flask(__name__)
bcrypt = Bcrypt(app)

api = Blueprint('api', __name__)

# Allow CORS requests to this API
CORS(api)


@api.route('/hello', methods=['POST', 'GET'])
def handle_hello():

    response_body = {
        "message": "Hello! I'm a message that came from the backend, check the network tab on the google inspector and you will see the GET request"
    }

    return jsonify(response_body), 200

#--------------------------SIGNUP-----------------------------------------------------------------------

@api.route('/signup', methods=['POST'])
def user_signup():

    body = request.get_json()

    if "email" not in body:
        return jsonify({"msg":"El campo email es requerido"}), 400
    if "password" not in body:
        return jsonify({"msg":"El campo password es requerido"}), 400
    
    encrypted_password = bcrypt.generate_password_hash(body["password"]).decode('utf-8')
    
    new_user = User(email = body["email"], password = encrypted_password,  is_active = True)

    if "first_name" in body:
        new_user.first_name = body["first_name"]
    else:
        new_user.first_name = ""

    if "last_name" in body:
        new_user.last_name = body["last_name"]
    else:
        new_user.last_name = ""

    db.session.add(new_user)
    db.session.commit()
    return jsonify({"msg":"user added correctly"})


#--------------------------LOGIN------------------------------------------------------------------------

@api.route('/login', methods=['POST'])
def user_login():

    body = request.get_json()

    #1. Valido los datos de la peticion
    if "email" not in body:
        return jsonify({"msg":"El campo email es requerido"}), 400
    if "password" not in body:
        return jsonify({"msg":"El campo password es requerido"}), 400
    
    #2. Busco al usuario en la base de datos con el correo
    user = User.query.filter_by(email = body["email"]).first()

    #2.1 Si el usuario no aparece, retorna un error 404
    if user is None:
        return jsonify({"msg":"User not found"}), 404
    
    #3. Verifico el campo password del body con el password del usuario de la base de datos
    password_checked = bcrypt.check_password_hash(user.password, body["password"])

    #3.1 Si no se verifica se retorna un error de clave invalida 401
    if password_checked == False:
        return jsonify({"msg":"Invalid password"}), 401
    
    #4. Genero el token
    role = "admin"
    if user.id % 2 == 0:
        role= "user"
    token = create_access_token(identity = user.id, additional_claims={"role":role})
    return jsonify({"token": token}), 200


#--------------------------LOGOUT-----------------------------------------------------------------------

@api.route('/logout', methods=['POST'])
@jwt_required()
def uiser_logout():
    jti = get_jwt()["jti"]
    token_blocked = TokenBlockedList(jti = jti)
    db.session.add(token_blocked)
    db.session.commit()
    return jsonify({"msg":"Closed session"})


#--------------------------USER_INFO--------------------------------------------------------------------

@api.route('/userinfo', methods=['GET'])
@jwt_required()
def user_info():
    user = get_jwt_identity()
    payload = get_jwt()
    return jsonify({"user": user, "role":payload["role"]})
