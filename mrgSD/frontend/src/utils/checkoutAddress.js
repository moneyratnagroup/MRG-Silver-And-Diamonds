const addressFields = ['address_line_1', 'address_line_2', 'landmark', 'city', 'state', 'zip_code', 'country'];
const normalize = value => String(value ?? '').trim().replace(/\s+/g, ' ').toLowerCase();

export async function saveCheckoutAddress(formData, request) {
  const address = {
    title: 'Home',
    address_line_1: formData.addressLine1.trim(),
    address_line_2: formData.addressLine2.trim(),
    landmark: formData.landmark.trim(),
    city: formData.city.trim(),
    state: formData.state,
    zip_code: formData.zip,
    country: formData.country || 'India',
    is_default: false,
  };
  const existingResponse = await request('/api/v1/auth/me/addresses');
  if (!existingResponse.ok) throw new Error('Unable to check saved addresses. Please retry, or untick Save this address to continue without saving.');
  const existing = await existingResponse.json();
  const match = existing.find(saved => addressFields.every(field => normalize(saved[field]) === normalize(address[field])));
  if (match) return match;

  const response = await request('/api/v1/auth/me/addresses', {
    method: 'POST',
    body: JSON.stringify(address),
  });
  if (!response.ok) throw new Error('Unable to save your address. Please retry, or untick Save this address to continue without saving.');
  return response.json();
}
