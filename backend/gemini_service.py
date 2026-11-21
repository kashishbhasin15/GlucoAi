
import os
from dotenv import load_dotenv
from google import genai
import json

load_dotenv()

API_KEY = os.getenv("GEMINI_API_KEY")

if not API_KEY:
    raise ValueError("GEMINI_API_KEY is missing from .env")

client = genai.Client(api_key=API_KEY)

MODEL_NAME = "gemini-3.1-flash-lite"


def generate_diabetes_insights(patient_data, prediction):

    prompt = f"""
You are the healthcare education assistant for GLUCOAI.

Generate personalized educational insights using the
patient information and the actual LightGBM screening result.

PATIENT INFORMATION:
{patient_data}

ACTUAL LIGHTGBM RESULT:
{prediction}

Return these four sections:

1. Screening Explanation
Explain the screening result in simple language.

2. Relevant Health Factors
Discuss relevant factors from the supplied patient information.
Do not claim that any factor caused the result.

3. Health and Lifestyle Suggestions
Provide practical, general educational suggestions.

4. Follow-up Guidance
Suggest appropriate topics to discuss with a healthcare professional.

OUTPUT FORMATTING RULES:

- Do not start with greetings or introductions.
- Do not repeat the entire disclaimer.
- Use exactly four main headings.
- Use short paragraphs.
- Use 3-5 concise bullet points where appropriate.
- Bold only important health terms.
- Avoid repeating the same recommendations.
- Keep the complete response around 250-350 words.
- Do not use tables.
- Do not invent patient information.
- Clearly distinguish reported health information from
  factors actually used by the prediction model.
- Never imply that a low model score overrides concerning
  symptoms or medical history.

IMPORTANT RULES:
- Preserve the exact LightGBM risk percentage and category.
- Never change or recalculate the model prediction.
- Do not diagnose diabetes.
- Do not prescribe medicines or treatments.
- Do not invent patient information.
- Do not claim that the model establishes clinical risk.
- Clearly explain that screening is not a diagnosis.
- Use simple, supportive language.
- Do not infer family history because it is not collected.
- Do not make recommendations based on information not supplied.
"""

    response = client.models.generate_content(
        model=MODEL_NAME,
        contents=prompt
    )

    if not response.text:
        raise RuntimeError("Gemini returned an empty response")

    return response.text.strip()





def generate_readmission_insights(patient_data):

    prompt = f"""
You are the GLUCOAI Hospital Readmission Assessment Assistant.

Analyze the supplied hospital encounter information.

PATIENT INFORMATION:
{json.dumps(patient_data, indent=2)}

Estimate whether the patient may be readmitted within
30 days after discharge.

Return a JSON object with exactly these fields:

{{
    "predicted_readmission": "YES or NO",
    "assessment_explanation": "Clear explanation",
    "relevant_factors": [
        "Factor 1",
        "Factor 2"
    ],
    "preventive_suggestions": [
        "Suggestion 1",
        "Suggestion 2"
    ],
    "follow_up_guidance": [
        "Guidance 1",
        "Guidance 2"
    ]
}}

INSTRUCTIONS:

- Choose only YES or NO.
- YES means the supplied information suggests a
  possibility of readmission within 30 days.
- NO means the supplied information suggests a
  comparatively lower possibility.
- Consider previous inpatient visits, emergency visits,
  hospital stay, diagnoses and medication information.
- Explain the reasoning in simple language.
- Use only the supplied patient information.
- Never invent medical history.
- Do not invent a percentage or confidence score.
- Do not prescribe medicines or treatments.
- Do not claim clinical validation.
- Do not use this assessment to make discharge decisions.
- Do not include Gemini branding in the report.
- Return valid JSON only.
"""

    response = client.models.generate_content(
        model=MODEL_NAME,
        contents=prompt,
        config={
            "response_mime_type": "application/json"
        },
    )

    if not response.text:
        raise RuntimeError("Empty readmission response")

    return json.loads(response.text)




def generate_chat_response(message, history=None, prediction_context=None):

    history = history or []

    system_prompt = """
You are the GLUCOAI Help Assistant, an AI-powered
healthcare education assistant.

YOUR RESPONSIBILITIES:
- Answer general healthcare education questions.
- Explain diabetes and diabetes screening.
- Explain hospital readmission concepts.
- Explain hospital length-of-stay predictions.
- Explain GLUCOAI features and how to use them.
- Help users understand prediction results when context is provided.

MEDICAL SAFETY:
- You are not a doctor.
- Never diagnose a medical condition.
- Never prescribe medicines or treatments.
- Never recommend changing prescribed medication.
- Do not claim that an AI estimate is a clinical diagnosis.
- Encourage professional medical advice for personal concerns.
- For urgent or severe symptoms, advise seeking urgent medical care.
- Never invent patient information or prediction results.

PREDICTION CONTEXT:
- Only use prediction information if it is explicitly provided.
- Do not assume that the user has completed a prediction.
- Never invent a missing prediction result.
- Clearly distinguish model output from AI explanations.

RESPONSE STYLE:
- Friendly, supportive and professional.
- Use simple language.
- Keep answers concise, normally 80-150 words.
- Use bullet points when helpful.
- Avoid unnecessarily long medical explanations.
- Do not repeat greetings in every response.
- Do not claim that your answers are clinically validated.
"""

    contents = []

    for item in history[-10:]:
        role = item.get("role")
        text = item.get("text")

        if role in ("user", "model") and isinstance(text, str):
            contents.append({
                "role": role,
                "parts": [{"text": text[:3000]}]
            })

    context_text = ""

    if prediction_context:
        context_text = f"""
LATEST PREDICTION INFORMATION:
{prediction_context}

Use this information only to explain the prediction
when relevant to the user's question.
"""

    contents.append({
        "role": "user",
        "parts": [{
            "text": f"""
{context_text}

USER QUESTION:
{message}
"""
        }]
    })

    response = client.models.generate_content(
        model=MODEL_NAME,
        contents=contents,
        config={
            "system_instruction": system_prompt,
            "temperature": 0.5,
            "max_output_tokens": 700
        }
    )

    if not response.text:
        raise RuntimeError("Gemini returned an empty response")

    return response.text.strip()
