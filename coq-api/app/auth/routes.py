from flask import Blueprint, request
from app import userDB

bp = Blueprint("auth", __name__)

@bp.route("/validateUser", methods=["POST"])
def validateUser():
    return "validate User"