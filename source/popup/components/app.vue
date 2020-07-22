<template>
  <div class="main">
    <ul v-if="data.length > 0">
      <li v-for="(el, index) in data" :key="index">
        <a @click="openInNewTab(el.domain)">{{ el.name }}</a>
      </li>
    </ul>
  </div>
</template>
<script>
export default {
  name: "app",
  props: ["data"],
  methods: {
    openInNewTab(domain) {
      chrome.tabs.create({ active: true, url: `http://${domain}` });
    }
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
