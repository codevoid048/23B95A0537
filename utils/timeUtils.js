export function isExpired(expiresAt) {
    return new Date() > new Date(expiresAt);
}

export function addMinutes(minutes) {
    return new Date(Date.now() + minutes * 60000);
}
