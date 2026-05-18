import publicApi from './publicApi'

const getResponseValue = (responseData) => {
  if (responseData == null) {
    return responseData
  }

  if (Array.isArray(responseData)) {
    return responseData
  }

  return responseData?.data ?? responseData
}

export const getParkingByToken = async (token) => {
  const tokenValue = String(token || '').trim()
  if (!tokenValue) {
    throw new Error('Missing parking token.')
  }

  // Primary API (as provided): POST /parking/details { token }
  try {
    const response = await publicApi.post('/parking/details', {
      token: tokenValue,
    })

    const normalized = getResponseValue(response.data)
    if (Array.isArray(normalized)) {
      return normalized[0] || null
    }

    return normalized
  } catch (error) {
    // Fall back to legacy GET routes below
  }

  // NOTE: Backend route naming can vary. Keep a small fallback list.
  const candidateUrls = [
    `/parking/token/${encodeURIComponent(tokenValue)}`,
    `/parking/by-token/${encodeURIComponent(tokenValue)}`,
    `/parking/token?token=${encodeURIComponent(tokenValue)}`,
  ]

  let lastError
  for (const url of candidateUrls) {
    try {
      const response = await publicApi.get(url)
      const normalized = getResponseValue(response.data)

      if (Array.isArray(normalized)) {
        return normalized[0] || null
      }

      return normalized
    } catch (error) {
      lastError = error
    }
  }

  throw lastError || new Error('Unable to load parking details.')
}

export const getAdditionalParkingPackages = async () => {
  const candidateUrls = ['/aditionalparking', '/additionalparking', '/additional-parking']

  let lastError
  for (const url of candidateUrls) {
    try {
      const response = await publicApi.get(url)
      return getResponseValue(response.data) || []
    } catch (error) {
      lastError = error
    }
  }

  throw lastError || new Error('Unable to load additional parking packages.')
}

export const addAdditionalPackageToParking = async (parkingId, additionalPackageId) => {
  const normalizedParkingId = Number(parkingId)
  const normalizedPackageId = Number(additionalPackageId)

  if (!normalizedParkingId) {
    throw new Error('Missing parking id.')
  }
  if (!normalizedPackageId) {
    throw new Error('Missing additional package id.')
  }

  const candidatePayloads = [
    { additionalPackageId: normalizedPackageId },
    { additionalFeePackageId: normalizedPackageId },
    { additionalParkingPackageId: normalizedPackageId },
  ]

  let lastError
  for (const payload of candidatePayloads) {
    try {
      const response = await publicApi.patch(
        `/parking/${normalizedParkingId}/additional-package`,
        payload
      )
      return getResponseValue(response.data)
    } catch (error) {
      lastError = error
    }
  }

  throw lastError || new Error('Unable to add additional package.')
}
