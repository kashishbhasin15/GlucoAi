
from pathlib import Path
from functools import lru_cache

import pandas as pd
from flask import Blueprint, jsonify

analytics = Blueprint("analytics", __name__)

DATA_PATH = Path(__file__).resolve().parent / "data" / "diabetic_data.csv"


@lru_cache(maxsize=1)
def load_data():
    df = pd.read_csv(DATA_PATH)

    df["age_group"] = df["age"].replace({
        "[0-10)": "0–20",
        "[10-20)": "0–20",
        "[20-30)": "20–30",
        "[30-40)": "30–40",
        "[40-50)": "40–50",
        "[50-60)": "50–60",
        "[60-70)": "60–70",
        "[70-80)": "70–80",
        "[80-90)": "80–90",
        "[90-100)": "90+"
    })

    return df


def readmission_rate(df):
    return round(float(df["readmitted"].eq("<30").mean()) * 100, 2)


def percentage(count, total):
    return round(float(count / total) * 100, 2) if total else 0


@analytics.get("/overview")
def healthcare_overview():
    df = load_data()
    total = len(df)

    reference_stats = [
        {
            "label": "Total Hospital Encounters",
            "value": f"{total:,}"
        },
        {
            "label": "Unique Patients",
            "value": f"{df['patient_nbr'].nunique():,}"
        },
        {
            "label": "30-Day Readmission Rate",
            "value": f"{readmission_rate(df)}%"
        },
        {
            "label": "Average Hospital Stay",
            "value": f"{df['time_in_hospital'].mean():.2f} days"
        }
    ]

    age_stats = []
    age_details = {}

    for age, group in df.groupby("age_group", sort=True):
        age_stats.append({
            "age": age,
            "encounters": len(group),
            "share": percentage(len(group), total),
            "readmitRate": readmission_rate(group),
            "avgStay": round(float(group["time_in_hospital"].mean()), 2),
            "avgMeds": round(float(group["num_medications"].mean()), 2),
            "avgLab": round(float(group["num_lab_procedures"].mean()), 2),
            "avgProcs": round(float(group["num_procedures"].mean()), 2)
        })

        age_details[age] = {
            "uniquePatients": int(group["patient_nbr"].nunique()),
            "genderSegments": gender_segments(group),
            "statusSegments": status_segments(group)
        }

    return jsonify({
        "referenceStats": reference_stats,
        "ageGroupStats": age_stats,
        "genderSegments": gender_segments(df),
        "statusSegments": status_segments(df),
        "ageDetails": age_details
    })


def gender_segments(df):
    colors = {
        "Female": "#E8A1CA",
        "Male": "#8BB9FF",
        "Unknown/Invalid": "#B9A4F0"
    }

    return [
        {
            "label": str(gender),
            "value": percentage(count, len(df)),
            "color": colors.get(gender, "#7845E8")
        }
        for gender, count in df["gender"].value_counts().items()
    ]


def status_segments(df):
    categories = [
        ("<30", "Within 30 Days", "#F4B83F"),
        (">30", "After 30 Days", "#B9A4F0"),
        ("NO", "No Recorded Readmission", "#4448F5")
    ]

    return [
        {
            "label": label,
            "value": percentage(
                df["readmitted"].eq(status).sum(), len(df)
            ),
            "color": color
        }
        for status, label, color in categories
    ]




# ==========================================
# ADDITIONAL ANALYTICS HELPERS
# ==========================================

def calculate_age_stats(df):
    result = []

    for age, group in df.groupby("age_group", sort=True):
        result.append({
            "age": age,
            "encounters": len(group),
            "share": percentage(len(group), len(df)),
            "readmitRate": readmission_rate(group),
            "avgStay": round(
                float(group["time_in_hospital"].mean()), 4
            ),
            "avgMeds": round(
                float(group["num_medications"].mean()), 4
            ),
            "avgLab": round(
                float(group["num_lab_procedures"].mean()), 4
            ),
            "avgProcs": round(
                float(group["num_procedures"].mean()), 4
            )
        })

    return result


def calculate_stay_distribution(df):
    return [
        {
            "name": f"{day}d",
            "value": int(
                df["time_in_hospital"].eq(day).sum()
            )
        }
        for day in range(1, 15)
    ]


def calculate_group_rates(df, column):
    result = []

    for name, group in df.groupby(
        column, observed=True, sort=False
    ):
        if len(group) == 0:
            continue

        result.append({
            "name": str(name),
            "value": readmission_rate(group),
            "n": len(group)
        })

    return result


def calculate_binned_rates(df, column, bins, labels):
    temp = df[["readmitted", column]].copy()

    temp["group"] = pd.cut(
        temp[column],
        bins=bins,
        labels=labels,
        include_lowest=True
    )

    rows = calculate_group_rates(temp, "group")

    return sorted(
        rows,
        key=lambda row: labels.index(row["name"])
    )


# ==========================================
# READMISSION BY ADMISSION TYPE
# ==========================================

def calculate_admission_rates(df):

    admission_mapping = {
        1: "Emergency",
        2: "Urgent",
        3: "Elective",
        4: "Newborn",
        5: "Unknown",
        6: "Unknown",
        7: "Trauma Center",
        8: "Unknown"
    }

    temp = df[
        ["admission_type_id", "readmitted"]
    ].copy()

    temp["admission_type"] = (
        temp["admission_type_id"]
        .map(admission_mapping)
        .fillna("Unknown")
    )

    return calculate_group_rates(
        temp, "admission_type"
    )


# ==========================================
# COMPLETE ANALYTICS ENDPOINT
# ==========================================

@analytics.get("/")
def complete_analytics():

    df = load_data()

    stay_by_age = {}
    inpatient_by_age = {}

    for age, group in df.groupby("age_group", sort=True):

        stay_by_age[age] = (
            calculate_stay_distribution(group)
        )

        inpatient_by_age[age] = (
            calculate_binned_rates(
                group,
                "number_inpatient",
                [-1, 0, 1, 2, 5, float("inf")],
                ["0", "1", "2", "3–5", "6+"]
            )
        )

    result = {

        "overallReadmitRate": readmission_rate(df),

        "ageGroupStats": calculate_age_stats(df),

        "stayDist": calculate_stay_distribution(df),

        "stayDistByAge": stay_by_age,

        "inpatientByAge": inpatient_by_age,

        "readmitByGender": calculate_group_rates(
            df, "gender"
        ),

        "readmitByStay": calculate_binned_rates(
            df,
            "time_in_hospital",
            [0, 2, 4, 6, 8, 10, 14],
            [
                "1–2 d",
                "3–4 d",
                "5–6 d",
                "7–8 d",
                "9–10 d",
                "11–14 d"
            ]
        ),

        "readmitByAdmission": calculate_admission_rates(df),

        "readmitByInpatient": calculate_binned_rates(
            df,
            "number_inpatient",
            [-1, 0, 1, 2, 5, float("inf")],
            ["0", "1", "2", "3–5", "6+"]
        ),

        "readmitByEmergency": calculate_binned_rates(
            df,
            "number_emergency",
            [-1, 0, 2, 5, 10, float("inf")],
            [
                "0 Visits",
                "1–2 Visits",
                "3–5 Visits",
                "6–10 Visits",
                "11+ Visits"
            ]
        )
    }

    return jsonify(result)
