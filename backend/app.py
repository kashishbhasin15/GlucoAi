
from pathlib import Path
import os
import pandas as pd
from catboost import CatBoostClassifier, CatBoostRegressor
from flask import Flask, jsonify, request
from flask_cors import CORS
from analytics import analytics
from gemini_service import (
    generate_diabetes_insights,
    generate_readmission_insights,
    generate_chat_response
)
from models.diabetes.predict import predict_patient


# ==========================================
# FLASK CONFIGURATION
# ==========================================

app = Flask(__name__)
app.register_blueprint(
    analytics,
    url_prefix="/api/analytics"
)


frontend_origin = os.getenv("FRONTEND_ORIGIN", "").strip().rstrip("/")

allowed_origins = [
    "http://localhost:5173",
    "https://frontend-seven-sigma-40.vercel.app",
]

if frontend_origin and frontend_origin not in allowed_origins:
    allowed_origins.append(frontend_origin)

CORS(
    app,
    resources={
        r"/api/.*": {
            "origins": allowed_origins,
            "methods": ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
            "allow_headers": ["Content-Type", "Authorization"],
        }
    },
    supports_credentials=False,
)



BASE_DIR = Path(__file__).resolve().parent
MODEL_DIR = BASE_DIR / "models"


# ==========================================
# LOAD HOSPITAL STAY MODELS
# ==========================================

classifier = CatBoostClassifier()
classifier.load_model(
    str(MODEL_DIR / "length_of_stay_classifier.cbm")
)

regressor = CatBoostRegressor()
regressor.load_model(
    str(MODEL_DIR / "length_of_stay_regression.cbm")
)


# ==========================================
# HOSPITAL STAY MODEL FEATURES
# ==========================================

FEATURES = [
    "race",
    "gender",
    "age",
    "admission_type_id",
    "admission_source_id",
    "number_outpatient",
    "number_emergency",
    "number_inpatient",
    "diag_1",
]

NUMERIC_FEATURES = [
    "admission_type_id",
    "admission_source_id",
    "number_outpatient",
    "number_emergency",
    "number_inpatient",
]


# ==========================================
# GLUCOAI HELP CHATBOT
# ==========================================

@app.post("/api/chat")
def chat():

    data = request.get_json(silent=True)

    if not isinstance(data, dict):
        return jsonify({
            "success": False,
            "error": "Invalid request."
        }), 400

    message = data.get("message")

    if not isinstance(message, str) or not message.strip():
        return jsonify({
            "success": False,
            "error": "Please enter a message."
        }), 400

    if len(message) > 2000:
        return jsonify({
            "success": False,
            "error": "Message is too long."
        }), 400

    history = data.get("history", [])

    if not isinstance(history, list) or len(history) > 10:
        return jsonify({
            "success": False,
            "error": "Invalid conversation history."
        }), 400

    # Only accept prediction context when explicitly enabled.
    include_context = data.get("include_prediction") is True
    prediction_context = data.get("prediction_context")

    if include_context:
        if not isinstance(prediction_context, dict):
            return jsonify({
                "success": False,
                "error": "Prediction information is unavailable."
            }), 400

        if len(str(prediction_context)) > 4000:
            return jsonify({
                "success": False,
                "error": "Prediction information is too large."
            }), 400

    else:
        prediction_context = None

    try:
        reply = generate_chat_response(
            message=message.strip(),
            history=history,
            prediction_context=prediction_context
        )

        return jsonify({
            "success": True,
            "reply": reply
        })

    except Exception:
        app.logger.exception("GLUCOAI chatbot failed")

        return jsonify({
            "success": False,
            "error": "Unable to generate a response. Please try again."
        }), 503


# ==========================================
# HEALTH CHECK
# ==========================================

@app.get("/api/health")
def health():
    return jsonify({
        "status": "ok",
        "models_loaded": True,
        "available_models": [
            "CatBoost Hospital Stay Classifier",
            "CatBoost Hospital Stay Regressor",
            "LightGBM Diabetes Risk Model",
            "Gemini Readmission Assessment",
        ],
    })


# ==========================================
# HOSPITAL STAY PREDICTION
# ==========================================

@app.post("/api/predict/length-of-stay")
def predict_length_of_stay():

    data = request.get_json(silent=True)

    if not isinstance(data, dict):
        return jsonify({
            "error": "Expected a JSON object"
        }), 400

    missing = [
        field for field in FEATURES
        if field not in data or data[field] is None
    ]

    if missing:
        return jsonify({
            "error": "Missing required fields",
            "fields": missing,
        }), 400

    try:
        row = {
            field: str(data[field])
            for field in FEATURES
            if field not in NUMERIC_FEATURES
        }

        row.update({
            field: int(data[field])
            for field in NUMERIC_FEATURES
        })

        X = pd.DataFrame([row], columns=FEATURES)

        predicted_days = max(
            1,
            round(float(regressor.predict(X)[0]))
        )

        predicted_category = str(
            classifier.predict(X).flatten()[0]
        )

        return jsonify({
            "predicted_days": predicted_days,
            "predicted_category": predicted_category,
            "model": {
                "classification": "CatBoost",
                "regression": "CatBoost",
            },
            "disclaimer": (
                "Research prediction only. "
                "Not for clinical decision-making."
            ),
        })

    except (ValueError, TypeError) as error:
        return jsonify({
            "error": str(error)
        }), 400

    except Exception:
        app.logger.exception("Hospital stay prediction failed")

        return jsonify({
            "error": "Hospital stay prediction failed."
        }), 500


# ==========================================
# DIABETES RISK PREDICTION
# ==========================================
@app.post("/api/predict/diabetes")
def predict_diabetes():

    data = request.get_json(silent=True)

    if not isinstance(data, dict):
        return jsonify({
            "success": False,
            "error": "Expected a JSON object",
        }), 400

    try:
        app.logger.warning("Starting LightGBM prediction")

        result = predict_patient(data)

        app.logger.warning("LightGBM prediction completed")

        # Temporarily disable Gemini for testing
        result["gemini_insights"] = None
        result["gemini_status"] = "unavailable"

        return jsonify({
            "success": True,
            "prediction": result,
        })

    except ValueError as error:
        return jsonify({
            "success": False,
            "error": str(error),
        }), 400

    except Exception:
        app.logger.exception("Diabetes prediction failed")

        return jsonify({
            "success": False,
            "error": "Diabetes prediction failed.",
        }), 500
# @app.post("/api/predict/diabetes")
# def predict_diabetes():

#     data = request.get_json(silent=True)

#     if not isinstance(data, dict):
#         return jsonify({
#             "success": False,
#             "error": "Expected a JSON object",
#         }), 400

#     try:
#         result = predict_patient(data)

#         # Gemini provides educational insights.
#         try:
#             result["gemini_insights"] = generate_diabetes_insights(
#                 data,
#                 result,
#             )
#             result["gemini_status"] = "success"

#         except Exception:
#             app.logger.exception("Gemini diabetes insights failed")

#             result["gemini_insights"] = None
#             result["gemini_status"] = "unavailable"

#         return jsonify({
#             "success": True,
#             "prediction": result,
#         })

#     except ValueError as error:
#         return jsonify({
#             "success": False,
#             "error": str(error),
#         }), 400

#     except Exception:
#         app.logger.exception("Diabetes prediction failed")

#         return jsonify({
#             "success": False,
#             "error": "Diabetes prediction failed.",
#         }), 500


# ==========================================
# HOSPITAL READMISSION ASSESSMENT
# ==========================================

READMISSION_FIELDS = [
    "age_group",
    "gender",
    "admission_type",
    "number_inpatient",
    "number_emergency",
    "time_in_hospital",
    "number_diagnoses",
    "num_medications",
    "change",
    "diabetesMed",
    "num_lab_procedures",
    "num_procedures",
]


@app.post("/api/predict/readmission")
def predict_readmission():

    data = request.get_json(silent=True)

    if not isinstance(data, dict):
        return jsonify({
            "success": False,
            "error": "Expected a JSON object",
        }), 400

    missing = [
        field for field in READMISSION_FIELDS
        if field not in data or data[field] in (None, "")
    ]

    if missing:
        return jsonify({
            "success": False,
            "error": "Missing required fields",
            "fields": missing,
        }), 400

    try:
        result = generate_readmission_insights(data)

        outcome = str(
            result.get("predicted_readmission", "")
        ).strip().upper()

        if outcome not in ("YES", "NO"):
            raise ValueError(
                "Invalid readmission assessment returned."
            )

        # Validate the expected response fields.
        explanation = result.get("assessment_explanation", "")
        factors = result.get("relevant_factors", [])
        suggestions = result.get("preventive_suggestions", [])
        follow_up = result.get("follow_up_guidance", [])

        if not isinstance(explanation, str) or not explanation.strip():
            raise ValueError("Assessment explanation is missing.")

        if not all(isinstance(items, list) for items in (
            factors, suggestions, follow_up
        )):
            raise ValueError("Invalid assessment sections returned.")

        return jsonify({
            "success": True,
            "prediction": {
                "assessment_type": "30-day readmission assessment",
                "predicted_readmission": outcome,
                "assessment_explanation": explanation,
                "relevant_factors": factors,
                "preventive_suggestions": suggestions,
                "follow_up_guidance": follow_up,
                "status": "success",
                "disclaimer": (
                    "Experimental AI-generated educational assessment. "
                    "Not a validated readmission prediction or "
                    "clinical decision."
                ),
            },
        })

    except Exception:
        app.logger.exception("Readmission assessment failed")

        return jsonify({
            "success": False,
            "error": "Unable to generate readmission assessment.",
        }), 503


# ==========================================
# START SERVER
# ==========================================

if __name__ == "__main__":
    app.run(debug=True, port=5000)
