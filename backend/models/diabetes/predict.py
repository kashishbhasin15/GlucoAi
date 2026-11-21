
import os
import json
import pandas as pd
import lightgbm as lgb


# Load model and configuration
HERE = os.path.dirname(os.path.abspath(__file__))

booster = lgb.Booster(
    model_file=os.path.join(HERE, "lgb_final.txt")
)

with open(os.path.join(HERE, "config.json")) as f:
    config = json.load(f)

FEATURES = config["features"]
T80 = config["thr_sens80"]
T90 = config["thr_sens90"]


# Convert Yes/No values into 1/0
def binary(value, name):

    if isinstance(value, bool):
        return int(value)

    if str(value).lower() in ["yes", "y", "true", "1"]:
        return 1

    if str(value).lower() in ["no", "n", "false", "0"]:
        return 0

    raise ValueError(f"Invalid value for {name}")


# Convert numeric inputs
def number(value, name, minimum, maximum, integer=False):

    try:
        value = float(value)
    except (ValueError, TypeError):
        raise ValueError(f"Invalid value for {name}")

    if not minimum <= value <= maximum:
        raise ValueError(f"{name} must be between {minimum} and {maximum}")

    if integer:
        if not value.is_integer():
            raise ValueError(f"{name} must be an integer")
        return int(value)

    return value


# Convert age into the model's original age category
def age_category(age):

    return 1 if age < 25 else min(13, (age - 25) // 5 + 2)


# Prepare patient information
def prepare_input(data):

    row = {}

    binary_features = [
        "HighBP", "HighChol", "CholCheck", "Smoker",
        "Stroke", "HeartDiseaseorAttack", "PhysActivity",
        "Fruits", "Veggies", "HvyAlcoholConsump",
        "AnyHealthcare", "NoDocbcCost", "DiffWalk"
    ]

    for feature in binary_features:
        row[feature] = binary(data.get(feature), feature)

    # BMI
    if data.get("BMI") is not None:
        row["BMI"] = number(data["BMI"], "BMI", 1, 150)
    else:
        height = number(data.get("height_cm"), "Height", 120, 230)
        weight = number(data.get("weight_kg"), "Weight", 30, 300)

        row["BMI"] = round(weight / (height / 100) ** 2, 1)

    # Health information
    row["GenHlth"] = number(data.get("GenHlth"), "GenHlth", 1, 5, True)
    row["MentHlth"] = number(data.get("MentHlth"), "MentHlth", 0, 30, True)
    row["PhysHlth"] = number(data.get("PhysHlth"), "PhysHlth", 0, 30, True)

    # Sex: Female = 0, Male = 1
    sex = data.get("Sex")

    if isinstance(sex, str):
        sex = sex.strip().lower()

        if sex == "female":
            row["Sex"] = 0
        elif sex == "male":
            row["Sex"] = 1
        else:
            raise ValueError("Sex must be Female or Male")
    else:
        row["Sex"] = binary(sex, "Sex")

    # Age
    age = number(data.get("age"), "Age", 18, 120, True)
    row["Age"] = age_category(age)

    # Education and income
    row["Education"] = number(data.get("Education"), "Education", 1, 6, True)
    row["Income"] = number(data.get("Income"), "Income", 1, 8, True)

    return pd.DataFrame(
        [[row[feature] for feature in FEATURES]],
        columns=FEATURES
    )


# Classify diabetes risk
def get_risk_level(probability):

    if probability >= T80:
        return "HIGHER"

    if probability >= T90:
        return "MODERATE"

    return "LOWER"


# Main prediction function for Flask
def predict_patient(data):

    patient_data = prepare_input(data)

    probability = float(
        booster.predict(patient_data.values.astype(float))[0]
    )

    return {
        "risk_probability": round(probability, 6),
        "risk_percent": round(probability * 100, 2),
        "risk_level": get_risk_level(probability),
        "model": "LightGBM",
        "disclaimer": (
            "Research screening estimate only. "
            "Not a medical diagnosis. "
            "Consult a healthcare professional."
        )
    }
