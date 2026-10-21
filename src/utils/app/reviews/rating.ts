// FIXME: Replace with the real ratings once the API exposes them.
export function generateMockRating() {
  return {
    average: Math.round((3.8 + Math.random() * 1.2) * 10) / 10,
    count: Math.floor(Math.random() * 190) + 10,
  };
}
