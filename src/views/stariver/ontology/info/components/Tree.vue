<template>
  <div id="treeSide" class="info-left" >
    <el-input placeholder="输入关键字进行过滤" v-model="filterText" style="width:200px" suffix-icon="el-icon-search"></el-input>

    <el-tree
      class="filter-tree"
      :data="treeData"
      :props="defaultProps"
      default-expand-all
      :filter-node-method="filterNode"
      @node-click="nodeClick"
      ref="tree"
    ></el-tree>
  </div>
</template>


<script>
import { listClassesByLevel } from "@/api/ontology/ontologylist";
import bus from "./eventBus";
export default {
  data() {
    return {
      treeData: [],
      filterText: "",
      id: "",
      defaultProps: {
        id: "",
        children: "children",
        label: "label"
      },
      // 显示搜索条件
      showSearch: true,
      xlsxFile: "",
      // 遮罩层
      loading: true,
      // 查询参数
      queryParams: {
        name: ""
      }
    };
  },
  mounted() {
    var ontologyid = this.$route.params.id;
    console.log("ontologyid = ", ontologyid);
    this.id = ontologyid;
    this.list();
  },
  watch: {
    filterText(val) {
      this.$refs.tree.filter(val);
    }
  },
  methods: {
    /** 树列表 */
    list() {
      this.loading = true;
      listClassesByLevel(this.id).then(response => {
        this.treeData = response.data;
      });
    },

    filterNode(value, data) {
      if (!value) return true;
      return data.label.indexOf(value) !== -1;
    },
    nodeClick(data, checked, node) {
       bus.$emit("treeClickEvent", data.id);
    }
  }
};
</script>
<style rel="stylesheet/scss" lang="scss" scoped>

.info-left {
  .tsearch {
    cursor: pointer;
  }
  .el-tree-node__label{
     color:#a2a2a4;
  }
}
</style>

