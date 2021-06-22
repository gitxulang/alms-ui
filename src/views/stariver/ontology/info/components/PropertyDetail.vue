<template>
<transition name="fade">
  <div id="propertyDetail" v-if="drawer">
    <div class="el-icon-close close" @click="close"></div>
    <el-container>
      <el-header class="header_info" style="text-align: left;padding:20px">
        概念：{{ classProperty.label }}
      </el-header>
      
      <el-main>
        <el-table :data="tableData" :border=true style="width: 100%" class="customer-table">
          <el-table-column
            align="center"
            prop="name"
            label="属性名"
          ></el-table-column>
          <el-table-column
            align="center"
            prop="propertyFieldType"
            label="类型"
          ></el-table-column>
        </el-table>
      </el-main>
    </el-container>
    <div class="leftwrap"></div>
  </div>
  </transition >
</template>

<script>
import bus from "./eventBus";
import { listClassesDataProperties } from "@/api/ontology/ontologylist";
export default {
  data() {
    return {
      // data
      drawer: false,
      classProperty: {
        id: "",
        label: ""
      },
      direction: "rtl",
      tableData: []
    };
  },
  mounted() {
    var self = this;
    bus.$on("ontologyClickEvent", function(param) {
      self.drawer = true;
      self.classProperty.id = param.id;
      self.classProperty.label = param.label;
      self.getProperties();
    });
  },
  methods: {
    /**通过概念Id获取属性 */
    getProperties() {
      listClassesDataProperties(this.classProperty.id).then(response => {
        this.tableData = response.data;
      });
    },
    close(){
      this.drawer =false
    }
  }
};
</script>
<style lang="scss" scoped>
::v-deep .el-table>td{
  border:0;
  border-bottom: 0px solid #3a3b40
}
.header_info{
  color:#a2a2a4;
  font-size:16px;
}
#propertyDetail {
  width: 280px;
  height: 780px;
  background-color: #202125;
  right: 20px;
  top:140px;
  position: fixed;
  .close{
    position: absolute;
    right: 10px;
    top: 10px;
    font-size: 20px;
    color:#287bf9 ;
    cursor:pointer;
  }
}
.fade-enter-active,
.fade-leave-active {
  transition: all 0.6s ease;
}
.fade-enter,
.fade-leave-to {
  transform: translateX(300px);
}

</style>
