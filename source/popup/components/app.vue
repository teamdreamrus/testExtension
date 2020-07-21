<template>
  <div class="main">
    <ul v-if="data.length>0">
      <li v-for="(el,index) in data" :key="index">
        <a @click="openInNewTab(el.domain)">{{el.name}}</a>
      </li>
    </ul>
  </div>
</template>
<script>
export default {
  name: "app",
  data: () => ({
    hi: "qqqq",
    data: []
  }),
  methods: {
    getData() {
      chrome.storage.local.get(["data"], result => {
        this.data = result.data;
        console.log(result.data);
      });
    },
    openInNewTab(domain) {
      console.log(new URL(`http://${domain}`));
      chrome.tabs.create({ active: true, url: `http://${domain}` });
    }
  },
  mounted: function() {
    this.getData();
  },
  watch: {
    data: function() {}
  }
};
</script>
<style lang="scss" scoped>
.main {
  width: auto;
  padding: 10px;
  background-color: rgba(76, 175, 80, 0.42);
  ul {
    list-style-type: none;
    padding: 0;
    margin: 0;
    li {
      margin-top: 5px;
      display: flex;
      justify-content: center;
      a {
        text-decoration: none;
        cursor: pointer;
        font-size: 16px;
        font-style: italic;
      }
    }
  }
}
</style>
