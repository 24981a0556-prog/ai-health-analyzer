import { MEDICAL_PARAMETERS } from '../data/referenceRanges';

/**
 * Extracts a numeric range from a string like "13.0 - 17.0", "70-100", "(0 - 150)", "< 200", "> 40"
 */
function parseReferenceRange(str) {
  if (!str) return null;
  const clean = str.replace(/[()[\]]/g, ' ').trim();

  // Pattern: "min - max" or "min to max"
  const rangeMatch = clean.match(/(\d+(?:\.\d+)?)\s*(?:-|–|—|to)\s*(\d+(?:\.\d+)?)/i);
  if (rangeMatch) {
    return {
      min: parseFloat(rangeMatch[1]),
      max: parseFloat(rangeMatch[2]),
      raw: `${rangeMatch[1]} – ${rangeMatch[2]}`
    };
  }

  // Pattern: "< max" or "<= max"
  const lessMatch = clean.match(/(?:<|<=|less than|up to)\s*(\d+(?:\.\d+)?)/i);
  if (lessMatch) {
    return {
      min: 0,
      max: parseFloat(lessMatch[1]),
      raw: `< ${lessMatch[1]}`
    };
  }

  // Pattern: "> min" or ">= min"
  const greaterMatch = clean.match(/(?:>|>=|greater than)\s*(\d+(?:\.\d+)?)/i);
  if (greaterMatch) {
    return {
      min: parseFloat(greaterMatch[1]),
      max: Infinity,
      raw: `> ${greaterMatch[1]}`
    };
  }

  return null;
}

/**
 * Determines status based on value and reference range
 */
function evaluateStatus(value, range) {
  if (value === null || value === undefined || isNaN(value) || !range) {
    return 'Unable to Determine';
  }

  if (range.min !== undefined && range.max !== undefined) {
    if (value < range.min) return 'Below Range';
    if (value > range.max) return 'Above Range';
    return 'Within Range';
  }

  return 'Unable to Determine';
}

/**
 * Parses raw text extracted from medical lab reports
 */
export function analyzeReportText(rawText, patientContext = {}) {
  if (!rawText || typeof rawText !== 'string') {
    return {
      parameters: [],
      summary: { total: 0, within: 0, above: 0, below: 0, undetermined: 0 },
      abnormalParameters: [],
      rawText: ''
    };
  }

  const lines = rawText.split(/\r?\n/).map(l => l.trim()).filter(l => l.length > 0);
  const detectedParameters = [];
  const processedKeys = new Set();

  const isFemale = patientContext.gender && patientContext.gender.toLowerCase().startsWith('f');

  // Loop through all defined medical parameters
  for (const [key, paramDef] of Object.entries(MEDICAL_PARAMETERS)) {
    // Check aliases
    for (const alias of paramDef.aliases) {
      if (processedKeys.has(key)) break;

      // Create regex for finding line with parameter
      // Word boundary or start of line
      const escapedAlias = alias.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      const aliasRegex = new RegExp(`(?:^|[^a-zA-Z0-9])${escapedAlias}(?:$|[^a-zA-Z0-9])`, 'i');

      for (let i = 0; i < lines.length; i++) {
        const line = lines[i];

        if (aliasRegex.test(line)) {
          // Special handling for Blood Pressure (format: 120/80)
          if (key === 'blood_pressure_systolic' || key === 'blood_pressure_diastolic') {
            const bpMatch = line.match(/(\d{2,3})\s*\/\s*(\d{2,3})/);
            if (bpMatch) {
              const sysVal = parseFloat(bpMatch[1]);
              const diaVal = parseFloat(bpMatch[2]);

              if (!processedKeys.has('blood_pressure_systolic')) {
                detectedParameters.push({
                  id: 'blood_pressure_systolic',
                  name: 'Systolic Blood Pressure',
                  value: sysVal,
                  unit: 'mmHg',
                  referenceRange: '90 – 120',
                  rangeMin: 90,
                  rangeMax: 120,
                  isCustomRange: false,
                  status: sysVal > 120 ? 'Above Range' : sysVal < 90 ? 'Below Range' : 'Within Range',
                  category: paramDef.category,
                  explanation: paramDef.explanation,
                  advice: sysVal > 120 ? paramDef.highExplanation : sysVal < 90 ? paramDef.lowExplanation : 'Normal systolic range.'
                });
                processedKeys.add('blood_pressure_systolic');
              }

              if (!processedKeys.has('blood_pressure_diastolic')) {
                detectedParameters.push({
                  id: 'blood_pressure_diastolic',
                  name: 'Diastolic Blood Pressure',
                  value: diaVal,
                  unit: 'mmHg',
                  referenceRange: '60 – 80',
                  rangeMin: 60,
                  rangeMax: 80,
                  isCustomRange: false,
                  status: diaVal > 80 ? 'Above Range' : diaVal < 60 ? 'Below Range' : 'Within Range',
                  category: paramDef.category,
                  explanation: paramDef.explanation,
                  advice: diaVal > 80 ? paramDef.highExplanation : diaVal < 60 ? paramDef.lowExplanation : 'Normal diastolic range.'
                });
                processedKeys.add('blood_pressure_diastolic');
              }
              break;
            }
          }

          // General parameter extraction
          // Look for numbers following the parameter name on this line
          const aliasIndex = line.toLowerCase().indexOf(alias);
          const remainderOfLine = line.substring(aliasIndex + alias.length);

          // Find numeric matches on this line
          // Supports decimals like 13.2, integers like 250000, 108
          const numberMatches = remainderOfLine.matchAll(/(?<![a-zA-Z0-9_.-])(\d+(?:\.\d+)?)(?![a-zA-Z0-9_.-])/g);
          const numbers = Array.from(numberMatches).map(m => parseFloat(m[1]));

          if (numbers.length > 0) {
            const resultVal = numbers[0];

            // Look for explicit reference range in remainder of line or parenthetical
            let extractedRange = null;
            let isCustomRange = false;

            // Check if there is a range format in remainder
            const rangeMatch = remainderOfLine.match(/(?:ref(?:erence)?\s*(?:range)?:?\s*)?(\(?\s*\d+(?:\.\d+)?\s*(?:-|–|—|to)\s*\d+(?:\.\d+)?\s*\)?)/i) ||
                               remainderOfLine.match(/([<>]?\s*=?\s*\d+(?:\.\d+)?\s*(?:-|–|—|to)\s*\d+(?:\.\d+)?)/i);

            if (rangeMatch) {
              const parsed = parseReferenceRange(rangeMatch[1]);
              if (parsed && (parsed.min !== undefined || parsed.max !== undefined)) {
                extractedRange = parsed;
                isCustomRange = true;
              }
            } else if (numbers.length >= 3) {
              // Sometimes format is: Parameter Value Min Max
              extractedRange = {
                min: numbers[1],
                max: numbers[2],
                raw: `${numbers[1]} – ${numbers[2]}`
              };
              isCustomRange = true;
            }

            // Fallback to default range if no report range was found
            if (!extractedRange) {
              let defaultMin = paramDef.defaultRange.min;
              let defaultMax = paramDef.defaultRange.max;
              if (isFemale && paramDef.defaultRange.female) {
                defaultMin = paramDef.defaultRange.female.min;
                defaultMax = paramDef.defaultRange.female.max;
              } else if (!isFemale && paramDef.defaultRange.male) {
                defaultMin = paramDef.defaultRange.male.min;
                defaultMax = paramDef.defaultRange.male.max;
              }

              extractedRange = {
                min: defaultMin,
                max: defaultMax,
                raw: `${defaultMin} – ${defaultMax}`
              };
              isCustomRange = false;
            }

            const status = evaluateStatus(resultVal, extractedRange);

            let advice = 'Value is within expected standard clinical reference parameters.';
            if (status === 'Above Range') {
              advice = paramDef.highExplanation;
            } else if (status === 'Below Range') {
              advice = paramDef.lowExplanation;
            }

            detectedParameters.push({
              id: paramDef.id,
              name: paramDef.name,
              category: paramDef.category,
              value: resultVal,
              unit: paramDef.unit,
              referenceRange: extractedRange ? extractedRange.raw : 'Unable to determine',
              rangeMin: extractedRange ? extractedRange.min : null,
              rangeMax: extractedRange ? extractedRange.max : null,
              isCustomRange: isCustomRange,
              status: status,
              explanation: paramDef.explanation,
              advice: advice
            });

            processedKeys.add(key);
            break;
          }
        }
      }
    }
  }

  // Summary counts
  const total = detectedParameters.length;
  const within = detectedParameters.filter(p => p.status === 'Within Range').length;
  const above = detectedParameters.filter(p => p.status === 'Above Range').length;
  const below = detectedParameters.filter(p => p.status === 'Below Range').length;
  const undetermined = detectedParameters.filter(p => p.status === 'Unable to Determine').length;
  const abnormal = detectedParameters.filter(p => p.status === 'Above Range' || p.status === 'Below Range');

  return {
    parameters: detectedParameters,
    summary: {
      total,
      within,
      above,
      below,
      undetermined
    },
    abnormalParameters: abnormal,
    rawText
  };
}
