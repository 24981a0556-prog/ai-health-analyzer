import { analyzeSymptoms } from './symptomAnalyzer';
import { analyzeReportText } from './reportAnalyzer';

/**
 * Calculates BMI and category
 */
export function calculateBmi(heightCm, weightKg) {
  if (!heightCm || !weightKg || isNaN(heightCm) || isNaN(weightKg)) {
    return null;
  }
  const heightM = parseFloat(heightCm) / 100;
  const weight = parseFloat(weightKg);
  
  if (heightM <= 0.5 || heightM > 2.6 || weight <= 10 || weight > 350) {
    return null;
  }

  const bmiValue = parseFloat((weight / (heightM * heightM)).toFixed(1));
  let category = 'Normal Weight';
  let categoryColor = 'text-emerald-700 bg-emerald-50 border-emerald-200';

  if (bmiValue < 18.5) {
    category = 'Underweight';
    categoryColor = 'text-amber-700 bg-amber-50 border-amber-200';
  } else if (bmiValue >= 18.5 && bmiValue <= 24.9) {
    category = 'Normal Weight';
    categoryColor = 'text-emerald-700 bg-emerald-50 border-emerald-200';
  } else if (bmiValue >= 25.0 && bmiValue <= 29.9) {
    category = 'Overweight';
    categoryColor = 'text-amber-700 bg-amber-50 border-amber-200';
  } else {
    category = 'Obese';
    categoryColor = 'text-rose-700 bg-rose-50 border-rose-200';
  }

  return {
    value: bmiValue,
    category,
    categoryColor,
    disclaimer: 'BMI is an informational screening ratio and does not directly measure body fat or individual metabolic composition.'
  };
}

/**
 * Evaluates vital signs
 */
export function evaluateVitals(vitals = {}) {
  const evaluations = [];

  if (vitals.systolicBp && vitals.diastolicBp) {
    const sys = parseFloat(vitals.systolicBp);
    const dia = parseFloat(vitals.diastolicBp);
    let status = 'Normal';
    let note = 'Within standard adult resting blood pressure range (systolic < 120 and diastolic < 80 mmHg).';

    if (sys >= 140 || dia >= 90) {
      status = 'Elevated (Stage 2 Hypertension Range)';
      note = 'Systolic >= 140 or diastolic >= 90 mmHg. Re-check in a calm resting state and consult a clinician.';
    } else if (sys >= 130 || dia >= 80) {
      status = 'Elevated (Stage 1 Hypertension Range)';
      note = 'Systolic 130–139 or diastolic 80–89 mmHg.';
    } else if (sys >= 120 && dia < 80) {
      status = 'Elevated Systolic';
      note = 'Systolic 120–129 mmHg with normal diastolic.';
    } else if (sys < 90 || dia < 60) {
      status = 'Lower than typical resting range';
      note = 'May cause occasional lightheadedness or fatigue.';
    }

    evaluations.push({
      metric: 'Blood Pressure',
      value: `${sys}/${dia} mmHg`,
      status,
      note,
      isAbnormal: status !== 'Normal'
    });
  }

  if (vitals.heartRate) {
    const hr = parseFloat(vitals.heartRate);
    let status = 'Normal';
    let note = 'Resting heart rate within 60–100 beats per minute.';
    if (hr > 100) {
      status = 'Elevated (Tachycardia)';
      note = 'Resting pulse above 100 bpm. Can be triggered by stress, fever, dehydration, or stimulants.';
    } else if (hr < 60) {
      status = 'Low (Bradycardia)';
      note = 'Common in athletic individuals; if accompanied by dizziness, evaluation is suggested.';
    }
    evaluations.push({
      metric: 'Resting Heart Rate',
      value: `${hr} bpm`,
      status,
      note,
      isAbnormal: status !== 'Normal'
    });
  }

  if (vitals.temperature) {
    const temp = parseFloat(vitals.temperature);
    let status = 'Normal';
    let note = 'Core body temperature within standard 36.1°C – 37.2°C (97.0°F – 99.0°F).';
    if (temp >= 37.8) {
      status = 'Fever';
      note = 'Body temperature elevated above 37.8°C (100°F), indicating active thermoregulatory immune response.';
    } else if (temp < 35.5) {
      status = 'Low Body Temperature';
      note = 'Below typical adult range.';
    }
    evaluations.push({
      metric: 'Body Temperature',
      value: `${temp} °C`,
      status,
      note,
      isAbnormal: status !== 'Normal'
    });
  }

  return evaluations;
}

/**
 * Determines overall informational health status
 */
export function determineOverallStatus(reportSummary, symptomAnalysis, vitalsEval, bmiInfo) {
  if (symptomAnalysis.isUrgent) {
    return {
      statusText: 'Further Evaluation Recommended',
      badgeColor: 'bg-rose-50 text-rose-700 border-rose-300',
      reason: 'Urgent symptom flags detected that require clinical consultation.'
    };
  }

  const abnormalCount = (reportSummary ? (reportSummary.above + reportSummary.below) : 0);
  const abnormalVitals = vitalsEval.filter(v => v.isAbnormal).length;
  const isBmiAbnormal = bmiInfo && (bmiInfo.category === 'Obese' || bmiInfo.category === 'Underweight');

  if (abnormalCount >= 3 || abnormalVitals >= 2 || (abnormalCount >= 1 && symptomAnalysis.severity === 'Severe')) {
    return {
      statusText: 'Further Evaluation Recommended',
      badgeColor: 'bg-rose-50 text-rose-700 border-rose-300',
      reason: 'Multiple laboratory parameters or clinical metrics are outside standard reference intervals.'
    };
  }

  if (abnormalCount > 0 || abnormalVitals > 0 || symptomAnalysis.hasSymptoms || isBmiAbnormal) {
    return {
      statusText: 'Needs Attention',
      badgeColor: 'bg-amber-50 text-amber-700 border-amber-300',
      reason: 'One or more informational parameters deviate mildly from reference intervals.'
    };
  }

  return {
    statusText: 'No Significant Finding in Provided Data',
    badgeColor: 'bg-emerald-50 text-emerald-700 border-emerald-300',
    reason: 'Reported parameters and vital metrics are within general reference limits.'
  };
}

/**
 * Combines all inputs into unified analysis payload
 */
export function buildHealthAnalysisPayload({
  personalInfo,
  symptoms,
  symptomDuration,
  symptomSeverity,
  vitals,
  reportText,
  reportFileName
}) {
  const bmi = calculateBmi(personalInfo.height, personalInfo.weight);
  const vitalsEvaluations = evaluateVitals(vitals);
  const symptomResults = analyzeSymptoms(symptoms, symptomDuration, symptomSeverity);
  const reportResults = reportText ? analyzeReportText(reportText, personalInfo) : null;
  const overallStatus = determineOverallStatus(
    reportResults ? reportResults.summary : null,
    symptomResults,
    vitalsEvaluations,
    bmi
  );

  return {
    timestamp: new Date().toISOString(),
    personalInfo,
    bmi,
    vitals,
    vitalsEvaluations,
    symptomResults,
    reportResults,
    reportFileName,
    overallStatus
  };
}
