function getBaseUrl() {
  const url = document.getElementById('baseUrl').value.trim();
  return url.replace(/\/$/, '');
}

function toPayload(form) {
  const data = new FormData(form);
  return Object.fromEntries(data.entries());
}

function showResponse(path, status, body) {
  const meta = document.getElementById('responseMeta');
  const box = document.getElementById('responseBox');
  meta.textContent = `${status} - ${path}`;
  box.textContent = JSON.stringify(body, null, 2);
}

async function postJson(path, payload) {
  const url = `${getBaseUrl()}${path}`;
  const response = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  });

  let body;
  try {
    body = await response.json();
  } catch (_) {
    body = { message: 'No JSON body returned.' };
  }

  showResponse(path, response.status, body);

  if (!response.ok) {
    throw new Error(body.message || `Request failed with status ${response.status}`);
  }

  return body;
}

document.getElementById('registerForm').addEventListener('submit', async (event) => {
  event.preventDefault();
  const payload = toPayload(event.target);
  try {
    const data = await postJson('/api/v1/vehicles/register', payload);
    if (data.userId) {
      document.getElementById('userId').value = data.userId;
    }
  } catch (error) {
    console.error(error);
  }
});

document.getElementById('identifyForm').addEventListener('submit', async (event) => {
  event.preventDefault();
  const payload = toPayload(event.target);
  try {
    const data = await postJson('/api/v1/vehicles/identify', payload);
    if (data.verificationId) {
      document.getElementById('verificationId').value = data.verificationId;
    }
  } catch (error) {
    console.error(error);
  }
});

document.getElementById('verifyForm').addEventListener('submit', async (event) => {
  event.preventDefault();
  const payload = toPayload(event.target);
  try {
    await postJson('/api/v1/vehicles/verify', payload);
  } catch (error) {
    console.error(error);
  }
});

document.getElementById('sendOtpForm').addEventListener('submit', async (event) => {
  event.preventDefault();
  const payload = toPayload(event.target);
  try {
    const data = await postJson('/api/v1/sms/send-otp', payload);
    if (data.otpSessionId) {
      document.getElementById('otpSessionId').value = data.otpSessionId;
    }
  } catch (error) {
    console.error(error);
  }
});

document.getElementById('verifyOtpForm').addEventListener('submit', async (event) => {
  event.preventDefault();
  const payload = toPayload(event.target);
  try {
    await postJson('/api/v1/sms/verify-otp', payload);
  } catch (error) {
    console.error(error);
  }
});

