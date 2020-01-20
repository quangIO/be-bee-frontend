<template>
  <div>
    <div class="container">
      <div class="columns">
        <div class="column">
          <h2 class="title is-2">{{totalStatLastHour.honey.toFixed(1)}}g</h2>
          <h5 class="subtitle is-5">honey last hour</h5>
        </div>
        <div class="column">
          <h2 class="title is-2">{{Math.round(100 * totalStatLastHour.honey / totalStatLastHour.nectar || 0)}}%</h2>
          <h5 class="subtitle is-5">conversion rate last hour</h5>
        </div>
        <div class="column">
          <h2 class="title is-2">{{totalStat.honey.toFixed(1)}}g</h2>
          <h5 class="subtitle is-5">honey total</h5>
        </div>
        <div class="column">
          <h2 class="title is-2">{{Math.round(100 * totalStat.honey / totalStat.nectar || 0)}}%</h2>
          <h5 class="subtitle is-5">conversion rate total</h5>
        </div>
      </div>
    </div>
    <b-table :data="bees" :columns="columns" per-page="10" paginated>
    </b-table>

    <div class="container" style="height: 60vh;">
      <l-map :zoom="3" :center="center">
        <l-tile-layer :url="url" :attribution="attribution"/>
        <l-marker-cluster>
          <l-marker v-for="c in bees" v-bind:key="c.coordinate" v-if="c.latitude !== null" :lat-lng="c.coordinate">
            <l-popup :content="c.beeId"/>
          </l-marker>
        </l-marker-cluster>

      </l-map>
    </div>
  </div>
</template>

<script>
// @ is an alias to /src
const API = (window.location.port === '8080') ? '//localhost:8888' : '//takehomex.herokuapp.com';
function makeOption(_method = 'POST', _body = {}) {
  return {
    method: _method,
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json;charset=UTF-8'
    },
    body: JSON.stringify(_body)
  };
}

function getLastHour() {
  return new Date().getTime() - 1000 * 60 * 60;
}

const socket = new WebSocket('ws://' + API);

export default {
  name: 'home',
  data() {
    return {
      center: L.latLng(47.413220, -3.219482),
      url:'http://{s}.tile.osm.org/{z}/{x}/{y}.png',
      attribution:'&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors',
      marker: L.latLng(47.413220, -1.219482),

      columns: [
        {field: 'beeId', label: 'id', numeric: true, searchable: true, width: 200},
        {field: 'speed', label: 'speed', numeric: true},
        {field: 'latitude', label: 'latitude', numeric: true},
        {field: 'longitude', label: 'longitude', numeric: true},
        {field: 'fuel', label: 'fuel', numeric: true},
        {field: 'damage', label: 'damage', numeric: true},
      ].map(e => ({...e, sortable: true})),
      totalStat: { "nectar": 0, "honey": 0, "inDangerBees": 0 },
      totalStatLastHour: { "nectar": 0, "honey": 0, "inDangerBees": 0 },
      bees: []
    }
  },
  methods: {
    loadData: async function() {
      fetch(API + '/bee').then(data => data.json())
              .then(data => this.bees = data.map(e => ({...e, 'coordinate': L.latLng(e.latitude, e.longitude)})));
      fetch(API + '/stats?from=' + getLastHour().toString()).then(data => data.json())
              .then(data => this.totalStatLastHour = data);
      fetch(API + '/stats?from=0').then(data => data.json())
              .then(data => this.totalStat = data);
    }
  },
  created() {
    this.loadData();
    socket.addEventListener('message', (event) => {
      console.log('Message from server ', event.data);
      this.loadData();
    });
  }
}
</script>
