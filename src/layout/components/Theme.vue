<template>
<div></div>
  <!-- <el-radio-group v-model="themeV" size="mini" class="theme-radio">
    <el-radio label="theme-dark">深灰</el-radio>
    <el-radio label="default">浅灰</el-radio>
  </el-radio-group> -->
</template>
<script>
import { themeList } from "@/assets/styles/theme/setTheme.js";
import { mapGetters } from "vuex";

export default {
  data() {
    return {
      themeV: "",
      options: themeList,
    };
  },
  computed: {
    ...mapGetters(["theme"]),
  },
  created() {
    this.themeV = this.theme;
  },
  watch: {
    themeV(d) {
      console.log({d})
      this.changeTheme(d);
    },
  },
  mounted() {},
  methods: {
    changeTheme(d) {
      this.$store.dispatch("settings/changeTheme", d);
    },
  },
};
</script>
<style scoped>
.theme-radio {
  line-height: 50px !important;
  height: 100%;
  padding: 0;
  margin: 0;
  box-sizing: content-box;
  float: left;
  margin-right: 20px;
}
</style>