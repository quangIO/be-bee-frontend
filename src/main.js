import Vue from 'vue'
import { LMap, LTileLayer, LMarker, LPopup } from 'vue2-leaflet';
import { Icon } from 'leaflet'
import Vue2LeafletMarkerCluster from 'vue2-leaflet-markercluster'
import Buefy from 'buefy'
import App from './App.vue'
import router from './router'
import 'leaflet/dist/leaflet.css'
import 'leaflet.markercluster/dist/MarkerCluster.css';
import "leaflet.markercluster/dist/MarkerCluster.Default.css";
import 'buefy/dist/buefy.css';

Vue.config.productionTip = false;

Vue.component('l-map', LMap);
Vue.component('l-tile-layer', LTileLayer);
Vue.component('l-marker', LMarker);
Vue.component('l-popup', LPopup);
Vue.component('l-marker-cluster', Vue2LeafletMarkerCluster);
Vue.use(Buefy);

delete Icon.Default.prototype._getIconUrl;

Icon.Default.mergeOptions({
  iconRetinaUrl: require('leaflet/dist/images/marker-icon-2x.png'),
  iconUrl: require('leaflet/dist/images/marker-icon.png'),
  shadowUrl: require('leaflet/dist/images/marker-shadow.png')
});

new Vue({
  router,
  render: h => h(App)
}).$mount('#app');
