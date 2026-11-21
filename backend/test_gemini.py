
from gemini_service import generate_diabetes_insights

patient_data = {
    "age": 25,
    "BMI": 22.5,
    "HighBP": 0,
    "HighChol": 0,
    "PhysActivity": 1
}

prediction = {
    "risk_percent": 12.0,
    "risk_level": "MODERATE"
}

result = generate_diabetes_insights(
    patient_data,
    prediction
)

print("\nGEMINI HEALTH INSIGHTS\n")
print(result)
