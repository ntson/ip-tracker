import mapboxgl from 'mapbox-gl';

const token = process.env.MAP_BOX_ACCESS_TOKEN;
const apiKey = process.env.IPIFY_API_KEY;

const baseURL = `https://geo.ipify.org/api/v2/country,city?apiKey=${apiKey}&ipAddress=`;

mapboxgl.accessToken = token;

const map = new mapboxgl.Map({
  container: 'map',
  style: 'mapbox://styles/mapbox/streets-v11',
  center: [-74.5, 40],
  zoom: 10,
});

const marker = new mapboxgl.Marker().setLngLat([-74.5, 40]).addTo(map);

const displayError = function (message) {
  const error = document.createElement('span');
  error.classList.add('error');
  error.textContent = message;

  const headerEl = document.querySelector('.header');
  headerEl.appendChild(error);
};

const form = document.querySelector('.header-form');
form.addEventListener('submit', function (e) {
  e.preventDefault();

  const formData = new FormData(e.target);
  const { ip } = Object.fromEntries(formData);

  fetch(`${baseURL}${ip}`)
    .then((res) => {
      return res.json();
    })
    .then((data) => {
      map.flyTo({
        center: [data.location.lng, data.location.lat],
        essential: true,
      });

      marker.remove();

      new mapboxgl.Marker()
        .setLngLat([data.location.lng, data.location.lat])
        .addTo(map);

      const input = document.getElementById('ip');
      input.value = '';
    })
    .catch((error) => {
      displayError(error.message);
    });
});
