// GET /api/reviews — returns the latest Google Business Profile rating + reviews.
// Uses the Google Places API (Place Details). Results are cached in-memory for 6 hours
// per warm function instance to stay well inside the API free tier.
//
// Env vars required:
//   GOOGLE_PLACES_API_KEY – Google Cloud key with "Places API" enabled
//   GOOGLE_PLACE_ID       – your business's Place ID (find it at
//                           https://developers.google.com/maps/documentation/places/web-service/place-id)
//
// Note: the Places API returns up to 5 of the most relevant reviews — the standard,
// ToS-compliant way to display Google reviews on your own site. For the full review
// history you'd use the Google Business Profile API (requires owner OAuth).

let cache = { at: 0, data: null };
const TTL = 6 * 60 * 60 * 1000;

exports.handler = async () => {
  const headers = { 'Content-Type': 'application/json', 'Cache-Control': 'public, max-age=3600', 'Access-Control-Allow-Origin': '*' };

  if (cache.data && Date.now() - cache.at < TTL) {
    return { statusCode: 200, headers, body: JSON.stringify(cache.data) };
  }

  const key = process.env.GOOGLE_PLACES_API_KEY;
  const placeId = process.env.GOOGLE_PLACE_ID;
  if (!key || !placeId) {
    return { statusCode: 503, headers, body: JSON.stringify({ error: 'Reviews API not configured' }) };
  }

  try {
    const url = `https://maps.googleapis.com/maps/api/place/details/json?place_id=${encodeURIComponent(placeId)}&fields=rating,user_ratings_total,reviews,url&reviews_sort=newest&key=${key}`;
    const res = await fetch(url);
    const json = await res.json();
    if (json.status !== 'OK') throw new Error(json.status);

    const r = json.result;
    const data = {
      rating: r.rating || 0,
      total: r.user_ratings_total || 0,
      mapsUrl: r.url || null,
      reviews: (r.reviews || []).map(rv => ({
        author: rv.author_name,
        rating: rv.rating,
        when: rv.relative_time_description,
        text: (rv.text || '').slice(0, 400)
      }))
    };
    cache = { at: Date.now(), data };
    return { statusCode: 200, headers, body: JSON.stringify(data) };
  } catch (e) {
    return { statusCode: 502, headers, body: JSON.stringify({ error: 'Failed to fetch reviews' }) };
  }
};
