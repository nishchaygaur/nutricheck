/**
 * Google Fit API Service (100% Client-Side OAuth 2.0 & REST API)
 */

export const GOOGLE_FIT_SCOPES = [
  'https://www.googleapis.com/auth/fitness.activity.read',
  'https://www.googleapis.com/auth/fitness.body.read',
  'https://www.googleapis.com/auth/fitness.nutrition.read',
].join(' ');

/**
 * Request OAuth 2.0 Access Token via Google Identity Services
 */
export function requestGoogleFitToken(clientId, onSuccess, onError) {
  if (typeof window === 'undefined' || !window.google?.accounts?.oauth2) {
    onError(new Error('Google Identity Services library is not loaded. Please check your internet connection.'));
    return;
  }

  try {
    const tokenClient = window.google.accounts.oauth2.initTokenClient({
      client_id: clientId,
      scope: GOOGLE_FIT_SCOPES,
      prompt: 'consent',
      callback: (response) => {
        if (response.error) {
          onError(new Error(response.error_description || response.error));
        } else if (response.access_token) {
          onSuccess(response.access_token, response.expires_in);
        }
      },
    });

    tokenClient.requestAccessToken();
  } catch (err) {
    onError(err);
  }
}

/**
 * Fetch Aggregated Activity & Health Data from Google Fit REST API for a given date
 */
export async function fetchGoogleFitDayMetrics(accessToken, dateKey) {
  const [year, month, day] = dateKey.split('-').map(Number);
  const startOfDay = new Date(year, month - 1, day, 0, 0, 0, 0).getTime();
  const endOfDay = new Date(year, month - 1, day, 23, 59, 59, 999).getTime();

  const requestBody = {
    aggregateBy: [
      { dataTypeName: 'com.google.calories.expended' },
      { dataTypeName: 'com.google.step_count.delta' },
      { dataTypeName: 'com.google.heart_minutes' },
      { dataTypeName: 'com.google.hydration' },
      { dataTypeName: 'com.google.distance.delta' },
    ],
    bucketByTime: { durationMillis: 86400000 }, // 1 day bucket
    startTimeMillis: startOfDay,
    endTimeMillis: endOfDay,
  };

  const response = await fetch('https://www.googleapis.com/fitness/v1/users/me/dataset:aggregate', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(requestBody),
  });

  if (!response.ok) {
    const errData = await response.json().catch(() => ({}));
    throw new Error(errData.error?.message || `Google Fit API request failed with status ${response.status}`);
  }

  const data = await response.json();
  const result = {
    caloriesExpended: 0,
    steps: 0,
    heartMinutes: 0,
    hydrationMl: 0,
    distanceMeters: 0,
  };

  const bucket = data.bucket?.[0];
  if (bucket && Array.isArray(bucket.dataset)) {
    bucket.dataset.forEach((ds) => {
      const type = ds.dataSourceId || '';
      const points = ds.point || [];

      points.forEach((point) => {
        const values = point.value || [];
        values.forEach((val) => {
          if (type.includes('calories.expended') && val.fpVal) {
            result.caloriesExpended += val.fpVal;
          } else if (type.includes('step_count') && val.intVal) {
            result.steps += val.intVal;
          } else if (type.includes('heart_minutes') && val.fpVal) {
            result.heartMinutes += val.fpVal;
          } else if (type.includes('hydration') && val.fpVal) {
            result.hydrationMl += Math.round(val.fpVal * 1000); // Fit stores in Liters
          } else if (type.includes('distance') && val.fpVal) {
            result.distanceMeters += val.fpVal;
          }
        });
      });
    });
  }

  return {
    caloriesBurned: Math.round(result.caloriesExpended),
    steps: Math.round(result.steps),
    heartMinutes: Math.round(result.heartMinutes),
    hydrationMl: Math.round(result.hydrationMl),
    distanceKm: Number((result.distanceMeters / 1000).toFixed(2)),
  };
}

/**
 * Generate Realistic Mock Google Fit Data for Sandbox Testing & Instant Demo
 */
export function getMockGoogleFitData(dateKey) {
  const [y, m, d] = dateKey.split('-').map(Number);
  const seed = (y * 31 + m * 12 + d) % 7;

  const mockCalories = [420, 360, 510, 480, 290, 560, 410];
  const mockSteps = [8420, 7150, 10240, 9460, 6200, 11800, 8930];
  const mockHeartMins = [45, 32, 58, 48, 25, 65, 42];
  const mockDistance = [6.1, 5.2, 7.8, 7.1, 4.5, 8.9, 6.5];

  return {
    caloriesBurned: mockCalories[seed],
    steps: mockSteps[seed],
    heartMinutes: mockHeartMins[seed],
    hydrationMl: 2250,
    distanceKm: mockDistance[seed],
  };
}
