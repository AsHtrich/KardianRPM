# import functools
import fastapi as _fastapi
import fastapi.security as _security
import datetime as _dt
import sqlalchemy.orm as _orm
import passlib.hash as _hash
import database as _database, models as _models, schemas as _schemas
import jwt as _jwt
import models as _models
# import thingspeak
import json
# from sqlalchemy import func
import pandas as pd
import pickle
from datetime import datetime as _dt
import time
from typing import Generator
import csv
from fastapi.middleware.cors import CORSMiddleware
import sys
import asyncio

oauth2schema = _security.OAuth2PasswordBearer(tokenUrl="/api/token")
JWT_SECRET = "myjwtsecret"

def create_database():
    return _database.Base.metadata.create_all(bind=_database.engine)

def get_db():
    db = _database.SessionLocal()
    try:
        yield db
    finally:
        db.close()

async def get_user_by_email(email: str, db: _orm.Session):
    return db.query(_models.Users).filter(_models.Users.email == email).first()

async def create_user(user: _schemas.UserCreate, db: _orm.Session):
    user_obj = _models.Users(email=user.email, hashed_password=_hash.bcrypt.hash(user.hashed_password))
    db.add(user_obj)
    db.commit()
    db.refresh(user_obj)
    return user_obj

async def authUser(email:str, password: str, db: _orm.Session):
    user = await get_user_by_email(db=db, email=email)

    if not user:
        return False
    if not user.verify_password(password):
        return False
    return user

async def create_token(user: _models.Users):
    user_obj = _schemas.User.model_validate(user)

    token = _jwt.encode(user_obj.model_dump(), JWT_SECRET)

    return dict(access_token = token, token_type="bearer")

async def get_current_user(db: _orm.Session= _fastapi.Depends(get_db), token: str= _fastapi.Depends(oauth2schema)):
    try:
        payload = _jwt.decode(token, JWT_SECRET, algorithms=["HS256"])
        user= db.query(_models.Users).get(payload["uid"])
    except:
        raise _fastapi.HTTPException(status_code=401, detail="Invalid Email or Password")
    
    return _schemas.User.model_validate(user)

async def get_users(db: _orm.Session):
    allUsers = db.query(_models.Users).all()
    return list(map(_schemas.User.model_validate, allUsers))

# ---------------------------------------------------------------------------------------------------------------------------------------------------------


async def create_patients(patient: _schemas.Patient, user: _schemas.User, db: _orm.Session):
    patient_obj = _models.Patients(
        patID=patient.patID, age=patient.age, deviceID=patient.deviceID, pno=patient.pno, name=patient.name, address=patient.address, email=patient.email, docID=user.uid, Relname=patient.Relname,Relpno=patient.Relpno,desc=patient.desc
    )
    db.add(patient_obj)
    db.commit()
    db.refresh(patient_obj)
    return patient_obj


async def get_patients(user: _schemas.User, db: _orm.Session):
    allPatients = db.query(_models.Patients).filter_by(docID=user.uid)
    return list(map(_schemas.Patient.model_validate, allPatients))

# ---------------------------------------------------------------------------------------------------------------------------------------------------------

async def _item_selector(item_id, db, item_model, item_id_attr):
    item = (db.query(item_model).filter(item_id_attr == item_id).first())

    if item is None:
        raise _fastapi.HTTPException(status_code=400, detail=f"{item_model.__name__} does not exist")
    return item

async def get_item(item_id, db, item_model, item_id_attr):
    item = await _item_selector(item_id, db, item_model, item_id_attr)

    return item

# ---------------------------------------------------------------------------------------------------------------------------------------------------------

async def create_presc(patID,presc: _schemas.Presc,  db: _orm.Session):
    patient_obj = _models.Prescs(
        patID=patID, date=presc.date,duration=presc.duration,medication=presc.medication, frequency=presc.frequency, dosage=presc.dosage, form=presc.form,instructions=presc.instructions
    )
    db.add(patient_obj)
    db.commit()
    db.refresh(patient_obj)
    return patient_obj

async def get_prescs(patID, db: _orm.Session):
    allPrescs = db.query(_models.Prescs).filter_by(patID=patID)
    return list(map(_schemas.Presc.model_validate, allPrescs))
from typing import List
async def get_alerts(db: _orm.Session ) -> List[_schemas.Alerts]:
    # Query the database to get all alerts
    db_alerts = db.query(_models.Alerts).all()

    # Convert the database results into the response schema format
    return [ _schemas.Alerts(
                aid=alert.aid,
                timestamp=alert.timestamp,
                prediction=alert.prediction,
                values=alert.values
            ) for alert in db_alerts ]

# ---------------------------------------------------------------------------------------------------------------------------------------------------------

async def reporter(report: _schemas.Requests,  db: _orm.Session):
    report_obj = _models.Requests(
        report=report.report
    )
    db.add(report_obj)
    db.commit()
    db.refresh(report_obj)
    return report_obj

# ---------------------------------------------------------------------------------------------------------------------------------------------------------

with open("./ml/model_iso_forest.pkl", "rb") as f:
    model = pickle.load(f)
db = next(get_db())
df = pd.read_csv("./data/heart.csv")
async def prediction_stream():
    for index, row in df.iterrows():
        row_data = row.values.reshape(1, -1) 
        prediction = model.predict(row_data)[0]  
        if prediction == -1:
            alert = _models.Alerts(
                prediction=int(prediction),  # Save the prediction value
                values=json.dumps(row_data.tolist()),  # Store the feature values as a JSON string
                timestamp = _dt.now()
            )
            print(alert)
            db.add(alert)  # Add the alert to the session
            db.commit() 
        data = {"index": index, "prediction": int(prediction)}
        yield f"data:{json.dumps(data)}\n\n"
        await asyncio.sleep(1) 


# ---------------------------------------------------------------------------------------------------------------------------------------------------------

hr = pd.read_csv("./data/HR.csv")
async def heart_stream():
    for index, row in hr.iterrows():
        data = {"index": index, "heart_rate": float(row["Value"])}
        yield f"data:{json.dumps(data)}\n\n"
        await asyncio.sleep(1) 

spo2 = pd.read_csv("./data/SPO2.csv")
async def spo2_stream():
    for index, row in spo2.iterrows():
        data = {"index": index, "spo2": float(row["spo2"])}
        yield f"data:{json.dumps(data)}\n\n"
        await asyncio.sleep(1) 



















# async def generate_predictions(data, db: _orm.Session, delay=1):
#     for _, row in data.iterrows():
#         features = row.values.reshape(1, -1)
#         prediction = model.predict(features)

#         prediction_data = {
#             "prediction": int(prediction[0]),  
#             "features": features.tolist(), 
#         }
#         if prediction[0] == -1:
#             alert = _models.Alerts(
#                 prediction=int(prediction[0]),
#                 values=json.dumps(features.tolist()),  # Convert to JSON format
#                 timestamp=_dt.fromisoformat(_dt.now().isoformat())()
#             )
#             db.add(alert)
#             db.commit()
#         yield f"data:{json.dumps(prediction_data)}\n\n"
#         await asyncio.sleep(delay)


# async def generate_predictions():
#     for _, row in data.iterrows():
#         features = row.values.reshape(1, -1)
#         prediction = model.predict(features)
#         prediction_data = {
#             "prediction": int(prediction[0]),  
#             "features": features.tolist(),  
#         }
#         yield f"data:{json.dumps(prediction_data)}\n\n"
#         await asyncio.sleep(1)

# CSV_FILE_PATH = "./data/heartrate.csv"
# def stream_csv_data() -> Generator:
#     with open(CSV_FILE_PATH, mode='r') as file:
#         reader = csv.DictReader(file)
#         for row in reader:
#             json_data = json.dumps(row)
#             yield f"data: {json_data}\n\n"  
#             time.sleep(0.5)  