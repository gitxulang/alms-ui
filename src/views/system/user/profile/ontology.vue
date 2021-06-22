<template>
  <div class="warp">
    <div class="content">
      <div class="title">安天知识图谱平台 v1.0 Alpha</div>
      <div class="content_warp">
        <div class="navs">
          <el-row class="tac">
            <el-col>
              <el-menu
                default-active="2"
                unique-opened="true"
                class="el-menu-vertical-demo"
                @open="handleOpen"
                @close="handleClose"
                background-color="rgb(231, 241, 235)"
              >
                <el-submenu index="1">
                  <template slot="title">
                    <i class="el-icon-location"></i>
                    <span>本体管理</span>
                  </template>
                  <el-menu-item-group>
                    <el-menu-item index="1-2">本体</el-menu-item>
                  </el-menu-item-group>
                </el-submenu>
                <el-submenu index="2">
                  <template slot="title">
                    <i class="el-icon-location"></i>
                    <span>图谱管理</span>
                  </template>
                  <el-menu-item-group>
                    <el-menu-item index="2-2">图谱</el-menu-item>
                  </el-menu-item-group>
                </el-submenu>
                <el-submenu index="3">
                  <template slot="title">
                    <i class="el-icon-location"></i>
                    <span>数据源管理</span>
                  </template>
                  <el-menu-item-group>
                    <el-menu-item index="3-2">数据源</el-menu-item>
                  </el-menu-item-group>
                </el-submenu>
                <el-submenu index="4">
                  <template slot="title">
                    <i class="el-icon-location"></i>
                    <span>构建任务管理</span>
                  </template>
                  <el-menu-item-group>
                    <el-menu-item index="4-1">构建任务</el-menu-item>
                    <el-menu-item index="4-2">构建记录</el-menu-item>
                  </el-menu-item-group>
                </el-submenu>
              </el-menu>
            </el-col>
          </el-row>
        </div>
        <div class="right">
          <div>本体管理>本体列表</div>
          <div class="search">
            <el-row>
              <el-button size="small" type="primary">导入</el-button>
              <el-button size="small" type="primary">删除</el-button>
            </el-row>
            <div>
              <el-input v-model="input" placeholder="请输入内容"></el-input>
              <el-button size="small" type="primary">搜索</el-button>
            </div>
          </div>
          <div>
            <el-table
              ref="multipleTable"
              :data="tableData"
              tooltip-effect="dark"
              style="width: 100%"
              @selection-change="handleSelectionChange"
            >
              <el-table-column type="selection" width="55"> </el-table-column>
              <el-table-column prop="name" label="名称" width="120">
              </el-table-column>
              <el-table-column prop="gainian" label="概念（个）" width="120">
              </el-table-column>
              <el-table-column prop="time" label="创建时间（条）" width="220">
              </el-table-column>
              <el-table-column prop="name" label="操作" width="340">
                  <el-row>
                       <el-button size="small">修改</el-button>
                       <el-button size="small">导出</el-button>
                       <el-button size="small">删除</el-button>
                       <el-button size="small">查看</el-button>

                  </el-row>
              </el-table-column>
             
            </el-table>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      input: "输入本地名称搜索",
      tableData: [
        {
          gainian:"2",
          name: "网空领域",
          time:"2016-05-04"
          
        },
         {
          gainian:"2",
          name: "网空领域",
          time:"2016-05-04"
          
        }, {
          gainian:"2",
          name: "网空领域",
          time:"2016-05-04"
          
        }
      ],
    };
  },
  methods: {
    handleOpen() {},
    handleClose() {},
    handleSelectionChange(val) {
      this.multipleSelection = val;
    },
  },
};
</script>
<style scoped lang="scss">
.warp {
  display: flex;
  justify-content: center;
  .content {
    width: 1100px;
    height: 800px;
    background-color: rgb(231, 241, 235);

    .title {
      margin-top: 20px;
      margin-left: 20px;
    }
    .content_warp {
      display: flex;
      margin-top: 20px;
      .navs {
        width: 200px;
        height: 800px;
      }
      .right {
        flex: 1;
        height: 800px;
        padding: 20px;
        box-sizing: border-box;
        border-top: 10px solid white;
        border-left: 10px solid white;
        .search {
          display: flex;
          justify-content: space-between;
          margin-top: 10px;
          margin-bottom: 20px;
          .el-input--medium .el-input__inner {
            width: 200px;
          }
          .el-input {
            width: 200px;
          }
        }
      }
    }
  }
}
</style>