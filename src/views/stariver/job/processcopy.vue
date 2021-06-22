<template>
  <div>
    <!-- 头部 -->
    <div class="navs">
      <div class="formwarp">
        <el-form
          ref="form"
          :inline="true"
          :model="form"
          size="mini"
          label-width="80px"
        >
          <el-form-item label="任务名称">
            <el-input v-model="form.name"></el-input>
          </el-form-item>
          <el-form-item label="任务描述">
            <el-input v-model="form.description"></el-input>
          </el-form-item>
        </el-form>
      </div>
      <div>
        <el-row>
          <el-button size="mini" type="primary">删除</el-button>
          <el-button size="mini" type="success">撤销</el-button>
          <el-button size="mini" type="success">保存</el-button>
          <el-button size="mini" type="success" @click="$router.go(-1)"
            >退出</el-button
          >
        </el-row>
      </div>
    </div>
    <!-- X6 -->
    <el-dialog :title="title" :visible.sync="open" width="500px" append-to-body>
      <!-- 数据源 -->
      <el-form
        :rules="rules"
        label-width="80px"
        :model="formLabelAlign"
        ref="ruleForm"
        v-if="types == '1'"
      >
        <el-form-item prop="region" label="数据源">
          <el-select
            @change="selectChanged"
            v-model="formLabelAlign.datasourceId"
            placeholder="请选择数据源"
          >
            <el-option
              v-for="(item, i) in btname"
              :key="i"
              :label="item.name"
              :value="item.id"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="索引" prop="suoyin">
          <template>
            <el-select
              v-model="formLabelAlign.tableName"
              @change="selectChangeds"
              placeholder="请选择索引"
            >
              <el-option
                v-for="(item, i) in indexname"
                :key="i"
                :label="item"
                :value="item"
              ></el-option>
            </el-select>
          </template>
        </el-form-item>

        <el-form-item prop="name" label="导入的列">
          <el-input
            size="small"
            required
            v-model="formLabelAlign.importCloumn"
          ></el-input>
        </el-form-item>
        <el-form-item prop="name" label="限制条数">
          <el-input
            size="small"
            required
            v-model="formLabelAlign.limitCount"
          ></el-input>
        </el-form-item>
        <el-form-item prop="name" label="SQL">
          <el-input
            size="small"
            required
            v-model="formLabelAlign.sql"
          ></el-input>
        </el-form-item>
      </el-form>
      <!-- 实体映射 -->
      <el-form
        :rules="rules"
        label-width="80px"
        :model="formLabelAlign"
        ref="ruleForm"
        v-if="types == '2'"
      >
        <el-form-item prop="region" label="概念">
          <el-select
            @change="selectshiti"
            v-model="formLabelAlign.classId"
            placeholder="索引"
          >
            <el-option
              v-for="(item, i) in ontologyidea"
              :key="i"
              :label="item.name"
              :value="item.id"
            ></el-option>
          </el-select>
        </el-form-item>

        <el-table border :data="tableDataObj[tableDataNodeId]">
          <el-table-column label="列字段" align="center" prop="name">
          </el-table-column>

          <el-table-column label="概念属性" align="center">
            <template slot-scope="scope">
              <el-select
                v-model="scope.row.classPropertyId"
                placeholder="请选择"
              >
                <el-option
                  v-for="(item, i) in ontologydata"
                  :key="i"
                  :label="item.name"
                  :value="item.id"
                ></el-option>
              </el-select>
            </template>
          </el-table-column>
          <el-table-column
            label="操作"
            align="center"
            class-name="small-padding fixed-width"
          >
            <template slot-scope="scope">
              <el-button
                size="mini"
                type="text"
                icon="el-icon-delete"
                @click="del(scope.row)"
              >
                删除</el-button
              >
            </template>
          </el-table-column>
        </el-table>

        <el-row>
          <el-col :span="10">
            <el-select v-model="lieziduan" placeholder="请选择">
              <el-option
                v-for="(item, i) in addliezid"
                :key="i"
                :label="item"
                :value="item"
              ></el-option>
            </el-select>
          </el-col>
          <el-col :span="10">
            <el-select v-model="concept" placeholder="请选择">
              <el-option
                v-for="(item, i) in ontologydata"
                :key="i"
                :label="item.name"
                :value="item.id"
              ></el-option>
            </el-select>
          </el-col>
          <el-col :span="4">
            <el-button @click="add">新增</el-button>
          </el-col>
        </el-row>
      </el-form>
      <!-- 关系映射 -->
      <el-form
        :rules="rules"
        label-width="80px"
        :model="formLabelAlign"
        ref="ruleForm"
        v-if="types == '3'"
        label-position="top"
      >
        <el-form-item prop="region" label="关系属性">
          <el-select
            @change="changerelation"
            v-model="formLabelAlign.propertyId"
            placeholder="索引"
          >
            <el-option
              v-for="(item, i) in relationname"
              :key="i"
              :label="item.name"
              :value="item.id"
            ></el-option>
          </el-select>
        </el-form-item>

        <el-row>
          <el-col :span="12">
            <el-form-item prop="region" label="原概念">
              <el-select
                v-model="formLabelAlign.sourceClassId"
                placeholder="索引"
              >
                <el-option
                  v-for="(item, i) in sourcelist"
                  :key="i"
                  :label="item.name"
                  :value="item.id"
                ></el-option>
              </el-select> </el-form-item
          ></el-col>
          <el-col :span="12"
            ><el-form-item prop="region" label="列表">
              <el-select
                v-model="formLabelAlign.sourceTableCloumn"
                placeholder="索引"
              >
                <el-option
                  v-for="(item, i) in relationship"
                  :key="i"
                  :label="item"
                  :value="item"
                ></el-option>
              </el-select> </el-form-item
          ></el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item prop="region" label="目标概念">
              <el-select
                v-model="formLabelAlign.targetClassId"
                placeholder="索引"
              >
                <el-option
                  v-for="(item, i) in targetlist"
                  :key="i"
                  :label="item.name"
                  :value="item.id"
                ></el-option>
              </el-select> </el-form-item
          ></el-col>
          <el-col :span="12"
            ><el-form-item prop="region" label="列表">
              <el-select
                v-model="formLabelAlign.targetTableCloumn"
                placeholder="索引"
              >
                <el-option
                  v-for="(item, i) in relationship"
                  :key="i"
                  :label="item"
                  :value="item"
                ></el-option>
              </el-select> </el-form-item
          ></el-col>
        </el-row>
      </el-form>
      <!-- 保存 -->
      <el-form
        :rules="rules"
        label-width="80px"
        :model="formLabelAlign"
        ref="ruleForm"
        v-if="types == '5'"
      >
        <el-form-item prop="region" label="选择图谱">
          <el-select v-model="formLabelAlign.graphId" placeholder="索引">
            <el-option
              v-for="(item, i) in graphname"
              :key="i"
              :label="item.name"
              :value="item.id"
            ></el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitForm">确 定</el-button>
        <el-button @click="cancel">取 消</el-button>
      </div>
    </el-dialog>
    <div class="content">
      <div class="app-stencil" ref="stencilContainer"></div>
      <div class="app-content" ref="container"></div>
    </div>
    <!-- 弹框 -->
  </div>
</template>

<script>
import { Graph, Shape, Addon } from "@antv/x6";
import { getDatasourceList } from "@/api/datasource/datasourcelist";
import {
  getIndexname,
  getJobid,
  getOntologyes,
  getOntologydata,
  exportExcel,
  getRelation,
  getTarget,
  saveGraph
} from "@/api/job/joblist";
import { getGraphList } from "@/api/graph/graphlist";
const { Stencil } = Addon;
const { Rect, Circle } = Shape;

export default {
  name: "Process",

  mounted() {},
  created() {
    this.$nextTick(() => {
      this.init(this);
      this.backfill(this);
    });
  },
  data() {
    return {
      //对话框标题
      title: "",
      //对话框控制
      open: false,
      // 头部修改表单
      form: {},
      //对话框种类
      types: "",
      // 数据源
      routerid: "", //路由传参id
      btname: [], // 数据源
      indexname: [], // 索引
      formLabelAlign: {}, //表单数据
      dataSourceTables: [], //表单数组
      rules: {
        region: [{ required: true, message: "请输入名称", trigger: "blur" }],
        suoyin: [{ required: true, message: "请输入名称", trigger: "blur" }]
      },
      ontologyidea: [], // 本体下概念
      // 实体映射表格
      tableData: [],
      tableDataObj: {},
      tableDataNodeId: null,
      tablename: "",
      tabletype: "",
      addliezid: "",
      lieziduan: "",
      concept: "",
      instanceMappings: [],
      //关系映射
      relationid: "",
      relationname: [],
      sourcelist: [],
      targetlist: [],
      relationship: [],
      relationMappings: [], //关系映射数组
      //图谱名称
      graphname: [],
      ontologydata: [],
      datasourceId: "",
      tableName: "",
      graph: null,
      steps: [] //所有节点信息
    };
  },
  methods: {
    add() {
      this.tableDataObj[this.tableDataNodeId].push({
        name: this.lieziduan,
        classPropertyId: this.concept
      });
    },
    del(val) {
      this.tableDataObj[this.tableDataNodeId].splice(
        this.tableDataObj[this.tableDataNodeId].indexOf(
          this.tableDataObj[this.tableDataNodeId].find(a => a.name == val.name)
        ),
        1
      );
    },
    cancel() {
      this.formLabelAlign = {};
      this.open = false;
    },
    //根据数据源Id查询索引
    selectChanged(val) {
      this.datasourceId = val;
      getIndexname(val).then(res => {
        this.indexname = res.data;
      });
    },
    //关系映射
    changerelation(val) {
      getTarget(val).then(res => {
        this.sourcelist = res.data.source;
        this.targetlist = res.data.target;
      });
    },
    //实体映射
    selectshiti(val) {
      getOntologydata(val).then(res => {
        this.ontologydata = res.data;
      });
    },
    // 选择索引
    selectChangeds(val) {
      this.tableName = val;
    },
    handleEdit() {},
    handleDelete() {},
    // 回显数据
    backfill() {
      getJobid(this.$route.query.msg).then(res => {
        console.log(res, "回显的数据");
        let arr1 = res.data.stepRelations;
        let arr2 = res.data.steps;
        let newarr1 = arr1.map(a => ({
          id: a.id,
          source: a.source,
          target: a.target,
          shape: "edge"
        }));
        let newarr2 = arr2.map(a => ({
          id: a.id,
          x: a.x,
          y: a.y,
          shape: "rect",
          width: 100,
          height: 40,
          type: a.type,
          attrs: {
            rect: { fill: "#31D0C6", stroke: "#4B4A67", strokeWidth: 1 },
            text: { text: a.label, fill: "white" },
            type: a.type
          },
          ports: {
            items: [
              {
                id: "port1",
                group: "in"
              },
              {
                id: "port2",
                group: "out"
              }
            ],
            groups: {
              // 输入链接桩群组定义
              in: {
                position: "left",
                attrs: {
                  circle: {
                    r: 3,
                    magnet: true,
                    stroke: "#31d0c6", //边框颜色
                    strokeWidth: 2,
                    fill: "#fff" //填充颜色
                  }
                }
              },
              // 输出链接桩群组定义
              out: {
                position: "right",
                attrs: {
                  circle: {
                    r: 3,
                    magnet: true,
                    stroke: "#31d0c6",
                    strokeWidth: 2,
                    fill: "#fff"
                  }
                }
              }
            }
          }
        }));
        this.graph.fromJSON(newarr2.concat(newarr1));
        this.dataSourceTables = res.data.dataSourceTables;
        this.relationMappings = res.data.relationMappings;
        this.formLabelAlign.graphId = res.data.graphId;
        this.instanceMappings = res.data.instanceMappings;
      });
    },
    submitForm() {
      // 数据源
      if (this.title == "数据源 - 从Elasticsearch索引导入") {
        this.dataSourceTables.push(this.formLabelAlign);
        this.formLabelAlign = {};
      } else if (this.title == "实体抽取") {       
        let arr = this.tableDataObj[this.tableDataNodeId].filter(
          a => a.classPropertyId
        );
        let arr1 = arr.map(a => ({
          tableColumn: a.name,
          classPropertyId: a.classPropertyId,
          stepId: this.formLabelAlign.stepId,
          classId: this.formLabelAlign.classId
        }));
        this.instanceMappings = this.instanceMappings.concat(arr1);
        console.log(this.instanceMappings,"累加数据")
      } else if (this.title == "关系映射") {
        this.relationMappings.push(this.formLabelAlign);
        this.formLabelAlign = {};

      } else if (this.title == "保存至图谱") {
        let arr1 = this.graph.toJSON().cells.filter(a => a.shape == "edge"); //边
        let stepRelations = arr1.map(a => ({
          id: a.id,
          source: a.source.cell,
          target: a.target.cell
        }));

        let arr2 = this.graph.toJSON().cells.filter(a => a.shape == "rect"); //节点
        let steps = arr2.map(a => ({
          id: a.id,
          label: a.attrs.text.text,
          type: a.type,
          x: a.position.x,
          y: a.position.y
        }));
        saveGraph({
          dataSourceTables: this.dataSourceTables,
          relationMappings: this.relationMappings,
          graphId: this.formLabelAlign.graphId,
          stepRelations,
          steps,
          projectId: this.$route.query.msg,
          instanceMappings: this.instanceMappings
        }).then(res => {
          if (res.code == "200") {
            this.$message.success("保存成功");
          }
        });
      }
      this.open = false;
    },

    // 拖曳
    init(v) {
      // 画布
      const graph = new Graph({
        container: this.$refs.container,
        // grid: true,
        // 对齐线
        snapline: {
          enabled: true,
          sharp: true
        },
        //连线规则
        connecting: {
          allowBlank: false,
          highlight: true,
          snap: {
            radius: 50
          }
        },
        history: true
      });

      const stencil = new Stencil({
        target: graph,
        stencilGraphWidth: 200,
        stencilGraphHeight: 160,
        groups: [
          {
            name: "group1",
            title: "数据源",
            layoutOptions: { columns: 1 }
          },
          {
            name: "group2",
            title: "映射",
            layoutOptions: { columns: 1 }
          },
          {
            name: "group3",
            title: "实体属性",
            layoutOptions: { columns: 1 }
            // collapsable: false
          },
          {
            name: "group4",
            title: "保存",
            layoutOptions: { columns: 1 }

            // collapsable: false
          }
        ]
      });

      this.$refs.stencilContainer.appendChild(stencil.container);

      const r = new Rect({
        width: 100,
        height: 40,
        type: 1,
        attrs: {
          rect: { fill: "#31D0C6", stroke: "#4B4A67", strokeWidth: 1 },
          text: { text: "ES数据源", fill: "white" },
          type: 1
        },

        ports: {
          items: [
            {
              id: "port1",
              group: "out"
            }
          ],
          groups: {
            out: {
              position: "right",
              attrs: {
                circle: {
                  r: 3,
                  magnet: true,
                  stroke: "#31d0c6",
                  strokeWidth: 2,
                  fill: "#fff"
                }
              }
            }
          }
        }
      });

      const c = new Rect({
        width: 100,
        height: 40,
        type: 2,
        attrs: {
          rect: { fill: "#31D0C6", stroke: "#4B4A67", strokeWidth: 1 },
          text: { text: "实体映射", fill: "white" },
          type: 2
        },
        ports: {
          items: [
            {
              id: "port1",
              group: "in"
            },
            {
              id: "port2",
              group: "out"
            }
          ],
          groups: {
            // 输入链接桩群组定义
            in: {
              position: "left",
              attrs: {
                circle: {
                  r: 3,
                  magnet: true,
                  stroke: "#31d0c6", //边框颜色
                  strokeWidth: 2,
                  fill: "#fff" //填充颜色
                }
              }
            },
            // 输出链接桩群组定义
            out: {
              position: "right",
              attrs: {
                circle: {
                  r: 3,
                  magnet: true,
                  stroke: "#31d0c6",
                  strokeWidth: 2,
                  fill: "#fff"
                }
              }
            }
          }
        }
      });

      const c2 = new Rect({
        width: 100,
        height: 40,
        type: 3,
        attrs: {
          rect: { fill: "#31D0C6", stroke: "#4B4A67", strokeWidth: 1 },
          text: { text: "关系映射", fill: "white" },
          type: 3
        },
        ports: {
          items: [
            {
              id: "port1",
              group: "in"
            },
            {
              id: "port2",
              group: "out"
            }
          ],
          groups: {
            // 输入链接桩群组定义
            in: {
              position: "left",
              attrs: {
                circle: {
                  r: 3,
                  magnet: true,
                  stroke: "#31d0c6",
                  strokeWidth: 2,
                  fill: "#fff"
                }
              }
            },
            // 输出链接桩群组定义
            out: {
              position: "right",
              attrs: {
                circle: {
                  r: 3,
                  magnet: true,
                  stroke: "#31d0c6",
                  strokeWidth: 2,
                  fill: "#fff"
                }
              }
            }
          }
        }
      });

      const r2 = new Rect({
        width: 100,
        height: 40,
        type: 4,
        attrs: {
          rect: { fill: "#31D0C6", stroke: "#4B4A67", strokeWidth: 1 },
          text: { text: "使用固定值\n新增属性", fill: "white" }
        },
        ports: {
          items: [
            {
              id: "port1",
              group: "in"
            },
            {
              id: "port2",
              group: "out"
            }
          ],
          groups: {
            // 输入链接桩群组定义
            in: {
              position: "left",
              attrs: {
                circle: {
                  r: 3,
                  magnet: true,
                  stroke: "#31d0c6",
                  strokeWidth: 2,
                  fill: "#fff"
                }
              }
            },
            // 输出链接桩群组定义
            out: {
              position: "right",
              attrs: {
                circle: {
                  r: 3,
                  magnet: true,
                  stroke: "#31d0c6",
                  strokeWidth: 2,
                  fill: "#fff"
                }
              }
            }
          }
        }
      });

      const r3 = new Rect({
        width: 100,
        height: 40,
        type: 5,
        attrs: {
          rect: { fill: "#31D0C6", stroke: "#4B4A67", strokeWidth: 1 },
          text: { text: "保存", fill: "white" },
          type: 5
        },
        ports: {
          items: [
            {
              id: "port1",
              group: "in"
            }
          ],
          groups: {
            // 输入链接桩群组定义
            in: {
              position: "left",
              attrs: {
                circle: {
                  r: 3,
                  magnet: true,
                  stroke: "#31d0c6",
                  strokeWidth: 2,
                  fill: "#fff"
                }
              }
            }
          }
        }
      });

      stencil.load([r], "group1");
      stencil.load([c, c2], "group2");
      stencil.load([r2], "group3");
      stencil.load([r3], "group4");
      //右单击事件
      graph.on("cell:contextmenu", ({ e, x, y, cell, node }) => {
        this.$confirm("确认删除节点", "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
          center: true
        })
          .then(() => {
            node.remove();

            this.$message({
              type: "success",
              message: "删除成功!"
            });
          })
          .catch(() => {
            this.$message({
              type: "info",
              message: "已取消删除"
            });
          });
      });
      // 左单击事件
      graph.on("cell:click", ({ e, x, y, cell, view }) => {
        this.types = cell.attrs.type;
        this.formLabelAlign.stepId = cell.id;
        this.open = true;
        if (cell.attrs.type == "1") {
          this.title = "数据源 - 从Elasticsearch索引导入";
          getDatasourceList().then(res => {
            this.btname = res.rows;
          });
          for (let item of this.dataSourceTables) {
            if (item.stepId == cell.id) {
              this.formLabelAlign = JSON.parse(JSON.stringify(item));
              break;
            }
          }
        } else if (cell.attrs.type == "2") {          
          const sourceEdges = this.graph.getIncomingEdges(cell);
          if(sourceEdges && sourceEdges.length > 0){
            const sourceId = sourceEdges[0].getSourceCellId();
            const forms = this.dataSourceTables.filter(item => item.stepId == sourceId);
            if (forms.length > 0 && forms[0].datasourceId !== "" && forms[0].tableName !== "") {
              exportExcel({
                datasourceId: forms[0].datasourceId,
                tableName: forms[0].tableName
              }).then(res => {
                this.addliezid = res.data;
                let arr = res.data.map(a => ({ name: a }));
                this.tableData = arr;
                this.tableDataObj[cell.id] = arr;
              });
            } else {
              this.$message.error("请填写数据源数据");
            }
          }

          this.title = "实体抽取";
          getJobid(this.$route.query.msg).then(res => {
            getOntologyes(res.data.project.ontologyId).then(res => {
              this.ontologyidea = res.data;
            });
            this.relationid = res.data.project.ontologyId;
          });
          this.tableDataNodeId = cell.id;
          this.tableDataObj[this.tableDataNodeId] = this.instanceMappings.filter(item => item.stepId == this.tableDataNodeId).map(
            a => ({
              classId: a.classId,
              name: a.tableColumn,
              classPropertyId: a.classPropertyId
            }));
          this.formLabelAlign.classId = this.tableDataObj[this.tableDataNodeId].length > 0 ?this.tableDataObj[this.tableDataNodeId][0].classId : "";
          
          if (this.formLabelAlign.classId != "") {
            getOntologydata(this.formLabelAlign.classId).then(res => {
              this.ontologydata = res.data;
            });
          }
        } else if (cell.attrs.type == "3") {
          this.title = "关系映射";
          const sourceEdges = this.graph.getIncomingEdges(cell);
          if(sourceEdges && sourceEdges.length > 0){
            const sourceId = sourceEdges[0].getSourceCellId();
            const forms = this.dataSourceTables.filter(item => item.stepId == sourceId);
            if (forms.length > 0 && forms[0].datasourceId !== "" && forms[0].tableName !== "") {
              exportExcel({
                datasourceId: forms[0].datasourceId,
                tableName: forms[0].tableName
              }).then(res => {
                this.relationship = res.data;
                console.log(this.relationship,"这是一个什么")
              });
            } else {
              this.$message.error("请填写数据源数据");
            }
          }

          getJobid(this.$route.query.msg).then(res => {
            // 查询本体下概念
            getRelation(res.data.project.ontologyId).then(res => {
              this.relationname = res.data;
            });
          });
          for (let item of this.relationMappings) {
            if (item.stepId == cell.id) {
              this.formLabelAlign = JSON.parse(JSON.stringify(item));
              break;
            }
          }

          if(this.formLabelAlign.propertyId){
            getTarget(this.formLabelAlign.propertyId).then(res => {
              this.sourcelist = res.data.source;
              this.targetlist = res.data.target;
            });
          }
          
        } else if (cell.attrs.type == "5") {
          this.title = "保存至图谱";
          getGraphList().then(res => {
            this.graphname = res.rows;
          });
        } else {
          this.open = false;
        }
      });
      //连线事件
      graph.on("edge:connected", ({ isNew, edge }) => {
        const source = edge.getSourceCell();
        console.log(edge,"连接线")
        if (source.label == "ES数据源") {
          // if (this.datasourceId !== "" && this.tableName !== "") {
          //   exportExcel({
          //     datasourceId: this.datasourceId,
          //     tableName: this.tableName
          //   }).then(res => {
          //     this.addliezid = res.data;
          //     let arr = res.data.map(a => ({ name: a }));
          //     this.tableData = arr;
          //     this.tableDataObj[edge.getTargetCell().id] = arr;
          //   });
          // } else {
          //   this.$message.error("请填写数据源数据");
          // }
        } else if (source.label == "实体映射") {
          this.relationship = this.addliezid;
        }
      });
      v.graph = graph;
    }
  }
};
</script>

<style scoped lang="scss">
.navs {
  display: flex;
  justify-content: space-between;
  padding: 12px 12px 0 6px;
  box-sizing: border-box;
}
.content {
  font-family: sans-serif;
  display: flex;
}

.app-stencil {
  width: 250px;
  border: 1px solid #f0f0f0;
  position: relative;
  height: 800px;
}

.app-content {
  flex: 1;
  height: 520px;
  margin-left: 8px;
  margin-right: 8px;
  box-shadow: 0 0 10px 1px #e9e9e9;
  height: 800px;
}

/* .x6-graph-scroller {
  border: 1px solid #f0f0f0;
  margin-left: -1px;
} */
.theme-dark {
  .app-stencil {
    border: 1px solid #a2a2a4;
  }

  .app-content {
    box-shadow: 0 0 10px 1px rgba(0, 0, 0, 0);
  }
}
</style>
