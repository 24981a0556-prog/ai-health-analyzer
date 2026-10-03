/**
 * Rule-based symptom analyzer for educational & informational triage
 */

export function analyzeSymptoms(symptomsText, duration = '', severity = 'Mild') {
  if (!symptomsText || typeof symptomsText !== 'string' || symptomsText.trim().length === 0) {
    return {
      hasSymptoms: false,
      summary: 'No specific symptoms entered.',
      findings: [],
      isUrgent: false,
      urgencyReason: null,
      recommendation: 'Maintaining a healthy lifestyle and routine health checkups is advised.'
    };
  }

  const text = symptomsText.toLowerCase();
  const findings = [];
  let isUrgent = false;
  let urgencyReason = null;

  // 1. Emergency / Urgent red flags
  const urgentKeywords = [
    { phrase: 'severe chest pain', reason: 'Severe chest discomfort' },
    { phrase: 'chest pain', reason: 'Chest pain or tightness' },
    { phrase: 'difficulty breathing', reason: 'Shortness of breath or breathing difficulty' },
    { phrase: 'shortness of breath', reason: 'Breathing difficulty' },
    { phrase: 'fainting', reason: 'Loss of consciousness or syncope' },
    { phrase: 'passed out', reason: 'Loss of consciousness' },
    { phrase: 'numbness on one side', reason: 'Sudden focal neurological symptoms' },
    { phrase: 'slurred speech', reason: 'Speech impairment' },
    { phrase: 'coughing blood', reason: 'Hemoptysis (coughing blood)' }
  ];

  for (const item of urgentKeywords) {
    if (text.includes(item.phrase)) {
      isUrgent = true;
      urgencyReason = item.reason;
      break;
    }
  }

  // 2. Specific rule-based combinations
  const hasFever = text.includes('fever') || text.includes('temperature') || text.includes('chills');
  const hasCough = text.includes('cough') || text.includes('sore throat') || text.includes('cold');
  const hasHeadache = text.includes('headache') || text.includes('head ache') || text.includes('migraine');
  const hasDizziness = text.includes('dizziness') || text.includes('dizzy') || text.includes('lightheaded');
  const hasChestPain = text.includes('chest pain') || text.includes('pressure in chest');
  const hasBreathingDifficulty = text.includes('breath') || text.includes('breathing') || text.includes('wheezing');
  const hasStomachPain = text.includes('stomach') || text.includes('abdominal') || text.includes('nausea') || text.includes('vomit') || text.includes('cramps');
  const hasFatigue = text.includes('fatigue') || text.includes('tired') || text.includes('exhaustion') || text.includes('weakness');

  if (hasChestPain) {
    findings.push({
      category: 'Cardiovascular / Thoracic Sensation',
      interpretation: 'Chest pain can require urgent medical evaluation. If the pain is severe, sudden, or accompanied by difficulty breathing, fainting, sweating, or radiation to the arm/jaw, seek emergency medical care immediately.',
      priority: 'high'
    });
  }

  if (hasBreathingDifficulty && !hasChestPain) {
    findings.push({
      category: 'Respiratory Function',
      interpretation: 'Shortness of breath can have several causes. Severe or sudden breathing difficulty requires urgent medical attention.',
      priority: 'high'
    });
  }

  if (hasFever && hasCough) {
    findings.push({
      category: 'Respiratory / Infectious Manifestation',
      interpretation: 'These symptoms may be associated with a respiratory-related illness. Monitor your symptoms and consider professional evaluation if they persist, worsen, or if high fevers develop.',
      priority: 'medium'
    });
  } else if (hasFever) {
    findings.push({
      category: 'Thermoregulation / Immune Response',
      interpretation: 'Fever commonly reflects an immune reaction to infection or inflammation. Ensure adequate hydration, rest, and monitor body temperature.',
      priority: 'medium'
    });
  } else if (hasCough) {
    findings.push({
      category: 'Upper / Lower Airway',
      interpretation: 'A persistent cough can stem from viral exposure, environmental allergies, post-nasal drip, or bronchial sensitivity.',
      priority: 'low'
    });
  }

  if (hasHeadache && hasDizziness) {
    findings.push({
      category: 'Neurological / General Health',
      interpretation: 'Headache and dizziness can have multiple causes, including dehydration, tension, lack of sleep, or blood pressure fluctuations. If symptoms are persistent, severe, or worsening, consider consulting a healthcare professional.',
      priority: 'medium'
    });
  } else if (hasHeadache) {
    findings.push({
      category: 'Neurological / Cranial Discomfort',
      interpretation: 'Headaches are commonly triggered by tension, eye strain, poor sleep, or dehydration. Medical evaluation is warranted if headaches are sudden, unusually intense, or accompanied by visual changes.',
      priority: 'low'
    });
  } else if (hasDizziness) {
    findings.push({
      category: 'Vestibular & Hydration',
      interpretation: 'Dizziness can relate to postural changes, inner ear balance, or inadequate fluid intake. Rest and hydration are advised.',
      priority: 'low'
    });
  }

  if (hasStomachPain) {
    findings.push({
      category: 'Gastrointestinal System',
      interpretation: 'Abdominal discomfort or digestive symptoms can result from dietary sensitivities, gastritis, or viral gastroenteritis. Seek professional evaluation if pain is localized, persistent, or accompanied by prolonged vomiting or high fever.',
      priority: 'medium'
    });
  }

  if (hasFatigue) {
    findings.push({
      category: 'Systemic / Energy Levels',
      interpretation: 'Mild fatigue is often multifactorial, linked to sleep hygiene, daily stress, nutrition, or mild viral recovery.',
      priority: 'low'
    });
  }

  // If no predefined pattern matched but text was provided
  if (findings.length === 0) {
    findings.push({
      category: 'General Symptom Description',
      interpretation: 'The reported symptoms have been documented. Since symptoms can stem from varied non-specific causes, observe their progression and discuss with a doctor if they do not resolve.',
      priority: 'low'
    });
  }

  // General recommendation based on severity and duration
  let recommendation = 'Monitor symptoms closely. If they persist beyond a few days or worsen in intensity, consult a primary care physician.';
  if (severity === 'Severe' || isUrgent) {
    recommendation = 'Given the reported severity, prompt medical evaluation by a licensed healthcare provider is strongly recommended.';
  } else if (duration && (duration.toLowerCase().includes('week') || duration.toLowerCase().includes('month'))) {
    recommendation = 'Because these symptoms have persisted for an extended duration, a comprehensive in-person medical consultation is advisable.';
  }

  return {
    hasSymptoms: true,
    symptomsText,
    duration,
    severity,
    findings,
    isUrgent,
    urgencyReason,
    recommendation
  };
}
