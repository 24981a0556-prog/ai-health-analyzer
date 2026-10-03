/**
 * AI Health Explanation Service
 * Provides AI-assisted explanations with guaranteed local rule-based fallback.
 */

/**
 * Robust Local Rule-Based Engine
 * Generates structured, cautious, clinical-quality informational insights
 * without requiring any external network or API keys.
 */
export function generateLocalRuleBasedInsights(analysisPayload) {
  const { personalInfo, bmi, vitalsEvaluations, symptomResults, reportResults } = analysisPayload;

  const abnormalParams = reportResults ? reportResults.abnormalParameters : [];
  const abnormalVitals = vitalsEvaluations ? vitalsEvaluations.filter(v => v.isAbnormal) : [];
  const isUrgent = symptomResults && symptomResults.isUrgent;

  // 1. Overall Summary
  let summary = '';
  const paramCount = reportResults ? reportResults.parameters.length : 0;

  if (paramCount > 0) {
    const withinCount = reportResults.summary.within;
    const outsideCount = abnormalParams.length;

    summary = `A total of ${paramCount} health parameter${paramCount === 1 ? '' : 's'} were analyzed for ${personalInfo.name || 'the user'}. `;
    if (outsideCount === 0) {
      summary += `All ${withinCount} detected parameter${withinCount === 1 ? '' : 's'} fall within typical clinical reference ranges. `;
    } else {
      summary += `${withinCount} parameter${withinCount === 1 ? '' : 's'} are within standard limits, while ${outsideCount} parameter${outsideCount === 1 ? '' : 's'} show values outside standard reference intervals. `;
    }
  } else {
    summary = `Personal baseline health metrics and symptom report were reviewed for ${personalInfo.name || 'the user'}. `;
  }

  if (symptomResults && symptomResults.hasSymptoms) {
    summary += `Reported symptoms (${symptomResults.symptomsText}) of ${symptomResults.severity.toLowerCase()} severity were contextualized alongside the physical data.`;
  } else {
    summary += `No acute active symptoms were specified.`;
  }

  // 2. Important Findings
  const findings = [];

  // Check laboratory parameters
  abnormalParams.forEach(param => {
    let text = `${param.name} is measured at ${param.value} ${param.unit}, which is ${param.status.toLowerCase()} the reference interval (${param.referenceRange}).`;
    if (param.id === 'glucose_fasting' && param.status === 'Above Range') {
      text += ' This fasting blood sugar measurement is slightly elevated above standard baseline (70–100 mg/dL).';
    } else if (param.id === 'cholesterol_ldl' && param.status === 'Above Range') {
      text += ' LDL cholesterol is higher than the optimal threshold of 100 mg/dL.';
    } else if (param.id === 'vitamin_d' && param.status === 'Below Range') {
      text += ' Serum 25-OH Vitamin D falls into the insufficient/sub-optimal bracket (<30 ng/mL).';
    } else if (param.id === 'hemoglobin' && param.status === 'Below Range') {
      text += ' Lower hemoglobin may reduce blood oxygen capacity.';
    }
    findings.push({
      title: `${param.name} (${param.status})`,
      description: text,
      category: param.category || 'Laboratory Analysis'
    });
  });

  // Check vitals
  abnormalVitals.forEach(vital => {
    findings.push({
      title: `${vital.metric} (${vital.status})`,
      description: `Reported as ${vital.value}. ${vital.note}`,
      category: 'Vital Signs'
    });
  });

  // Check BMI
  if (bmi && bmi.category !== 'Normal Weight') {
    findings.push({
      title: `Body Mass Index: ${bmi.value} kg/m² (${bmi.category})`,
      description: `Calculated from height (${personalInfo.height} cm) and weight (${personalInfo.weight} kg). General health guidelines recommend maintaining BMI between 18.5 and 24.9 through balanced nutrition and physical activity.`,
      category: 'Anthropometrics'
    });
  }

  // Check Symptoms
  if (symptomResults && symptomResults.hasSymptoms) {
    symptomResults.findings.forEach(sf => {
      findings.push({
        title: sf.category,
        description: sf.interpretation,
        category: 'Symptom Review'
      });
    });
  }

  if (findings.length === 0) {
    findings.push({
      title: 'Stable Baseline Parameters',
      description: 'All submitted laboratory values and vital metrics align with expected general population reference intervals.',
      category: 'General Baseline'
    });
  }

  // 3. Possible Reasons (General possibilities, explicitly non-diagnostic)
  const possibleReasons = [];
  if (abnormalParams.some(p => p.id === 'glucose_fasting')) {
    possibleReasons.push('Mildly elevated fasting glucose can be influenced by pre-test fasting duration, carbohydrate intake the preceding evening, acute stress, sleep disruption, or early metabolic insulin resistance.');
  }
  if (abnormalParams.some(p => p.id === 'cholesterol_ldl' || p.id === 'cholesterol_total')) {
    possibleReasons.push('Elevated lipid markers (cholesterol/LDL) are commonly associated with dietary saturated fat intake, genetic predispositions, physical activity levels, and metabolic factors.');
  }
  if (abnormalParams.some(p => p.id === 'vitamin_d')) {
    possibleReasons.push('Sub-optimal vitamin D levels are very common and often stem from limited sunlight exposure, sunscreen usage, dietary patterns, or seasonal climate factors.');
  }
  if (symptomResults && symptomResults.hasSymptoms && symptomResults.symptomsText.toLowerCase().includes('fatigue')) {
    possibleReasons.push('Fatigue is a non-specific indicator that can correlate with nutritional status (e.g., vitamin D or B12, iron), hydration, sleep quality, workload, or recovery from subclinical viral illnesses.');
  }
  if (symptomResults && symptomResults.hasSymptoms && symptomResults.symptomsText.toLowerCase().includes('headache')) {
    possibleReasons.push('Occasional headaches can be provoked by muscle tension, eye strain, dehydration, stress, caffeine variation, or atmospheric changes.');
  }

  if (possibleReasons.length === 0) {
    possibleReasons.push('Variations in human physiology, diurnal rhythms, recent meal timing, hydration status, and laboratory measurement variance can all contribute to individual results.');
  }

  // Mandatory non-diagnostic framing
  possibleReasons.push('Note: These results can have several possible causes and should always be interpreted together with your full medical history, clinical symptoms, and formal repeat laboratory tests under medical supervision.');

  // 4. Suggested Next Steps
  const nextSteps = [];

  if (isUrgent) {
    nextSteps.push('Urgent Priority: Because severe symptoms were reported, seek prompt emergency or urgent medical evaluation at the nearest healthcare facility.');
  }

  if (abnormalParams.length > 0) {
    nextSteps.push('Schedule a follow-up consultation with your primary healthcare provider to review these laboratory findings in person.');
  }

  if (abnormalParams.some(p => p.id === 'glucose_fasting')) {
    nextSteps.push('Consider repeating a fasting blood glucose test along with an HbA1c test as advised by your doctor to assess average blood sugar regulation over time.');
  }

  if (abnormalParams.some(p => p.id === 'vitamin_d')) {
    nextSteps.push('Discuss safe sun exposure guidelines and potential vitamin D3 supplementation with a physician or dietitian.');
  }

  if (abnormalParams.some(p => p.id.includes('cholesterol') || p.id === 'triglycerides')) {
    nextSteps.push('Explore heart-healthy dietary habits rich in dietary fiber, vegetables, and omega-3 fatty acids, and maintain regular aerobic exercise.');
  }

  nextSteps.push('Keep a written log of your symptoms (timing, triggers, severity) to share with your clinician at your next appointment.');
  nextSteps.push('Avoid altering prescription medications or starting high-dose health supplements without professional medical guidance.');

  return {
    source: 'Rule-Based Local Clinical Engine (Fallback)',
    isFallback: true,
    summary,
    findings,
    possibleReasons,
    nextSteps
  };
}

/**
 * Main AI analysis dispatcher
 * Tries serverless/remote AI API if configured, otherwise falls back gracefully
 */
export async function generateHealthInsights(analysisPayload) {
  // Check if AI API is available via environment variable or backend endpoint
  const apiKey = import.meta.env.VITE_AI_API_KEY || (typeof process !== 'undefined' && process.env?.AI_API_KEY);

  // If no API key configured, seamlessly use the local rule-based analysis
  if (!apiKey) {
    // Simulate brief realistic processing delay for demo polish
    await new Promise(resolve => setTimeout(resolve, 600));
    return generateLocalRuleBasedInsights(analysisPayload);
  }

  try {
    // If backend proxy endpoint or direct API is configured:
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 10000);

    const response = await fetch('/api/analyze', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        payload: analysisPayload,
        apiKey: apiKey
      }),
      signal: controller.signal
    });

    clearTimeout(timeoutId);

    if (response.ok) {
      const data = await response.json();
      if (data && data.summary && data.findings) {
        return {
          source: 'AI-Assisted Model',
          isFallback: false,
          summary: data.summary,
          findings: data.findings,
          possibleReasons: data.possibleReasons || [],
          nextSteps: data.nextSteps || []
        };
      }
    }

    // If API responded with error or unexpected structure, fall back
    console.warn('AI API response was incomplete or non-200. Falling back to local clinical rules.');
    return generateLocalRuleBasedInsights(analysisPayload);
  } catch (err) {
    console.warn('AI API call failed or timed out. Gracefully activating local rule-based engine:', err);
    return generateLocalRuleBasedInsights(analysisPayload);
  }
}
