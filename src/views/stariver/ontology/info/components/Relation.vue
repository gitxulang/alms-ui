<template>
  <div id="graph"></div>
</template>

<script>
import { getNodeSelfPath, setLinkGroup, getNodesLine } from "./deviceRelation";
import { listNodesLinks } from "@/api/ontology/ontologylist";
import bus from "./eventBus";
export default {
  data() {
    return {
      // data
    };
  },
  mounted() {
    var id = this.$route.params.id;
    this.getOntologyNodesLinks(id);
    var self = this;
    bus.$on("treeClickEvent", function(param) {
      self.showSelect(param);
    });
  },
  methods: {
    renderGraph(data) {
      var self = this;
      let d3 = require("./d.js");
      let { links, nodes } = data;
      let labelColor = new Map();
      let labelIndex = 0;
      let colorList = [
        "#2d39af",
        "#3c4ae7",
        "#1f287b",
        "#C477E9",
        "#3399FF",
        "#FF9933",
        "#01B394",
        "#5470c6",
        "#FF3333",
        "#8033FF",
        "#FF6D33",
        "#91cc75",
        "#fac858",
        "#ee6666",
        "#73c0de",
        "#3ba272",
        "#fc8452",
        "#9a60b4",
        "#ea7ccc"
      ];

      // 数据转换
      let arr = [];
      links.forEach(function(e) {
        // let relation = e.relation
        // e.relation =  {
        //     "relationshipId": 60,
        //     "relationship":relation,
        // }
        let sourceNode = nodes.filter(function(n) {
          return n.id === +e.from;
        })[0];

        let targetNode = nodes.filter(function(n) {
          return n.id === +e.to;
        })[0];

        e.source = sourceNode;
        e.target = targetNode;
        arr.push(e);
      });
      //关系分组
      links = arr;
      setLinkGroup(links);

      //点击节点后弹出的灰色圆圈以及图标的定义，分为三组【1.删除、2.联系、3.解除位置锁定】
      let [
        removePath,
        remove_rect1,
        remove_rect2,
        remove_line1,
        remove_line2,
        remove_line3
      ] = [null];
      let [unlockPath, unlock_path1, unlock_rect1, unlock_line1] = [null];
      let [
        hidePath,
        hide_path1,
        hide_path2,
        hide_path3,
        hide_path4,
        hide_circle1,
        hide_line1
      ] = [null];
      let rightArc = d3.svg
        .arc()
        .outerRadius(60)
        .innerRadius(30)
        .startAngle(0)
        .endAngle(1.85);
      let leftArc = d3.svg
        .arc()
        .outerRadius(60)
        .innerRadius(30)
        .startAngle(4.5)
        .endAngle(6.23);
      let bottomArc = d3.svg
        .arc()
        .outerRadius(60)
        .innerRadius(30)
        .startAngle(1.9)
        .endAngle(4.45);

      d3.select("#graph").html("");

      const force = d3.layout
        .force() //layout将json格式转化为力学图可用的格式
        .nodes(nodes) //设定节点数组
        .links(links) //设定连线数组
        .linkDistance(150) //连接线长度
        .charge(-1500) //顶点的电荷数。该参数决定是排斥还是吸引，数值越小越互相排斥
        .on("tick", tick) //指时间间隔，隔一段时间刷新一次画面
        .start(); //开始转换

      // var paramScale= 0.1;//初始时缩放倍数
      // var paramTransform= [442,500];//初始时标签移动大小
      let zoom = d3.behavior
        .zoom()
        .scaleExtent([0.4, 2])
        .on("zoom", zoomed);
      const svg = d3
        .select("#graph")
        .append("svg")
        .attr("pointer-event", "all")
        .attr("preserveAspectRatio", "xMidYMid meet") //自适应容器大小
        .attr("viewBox", "-500 -300 1000 1000")
        .call(zoom);
      // zoom.translate(paramTransform)
      // zoom.scale(paramScale);
      //设置连接线
      const edges_line = svg
        .append("g")
        .selectAll(".edgepath")
        .data(force.links())
        .enter()
        .append("path")
        .attr("marker-end", function(d, i) {
          return getMarkerArrow(i);
        }) //根据箭头标记的id号标记箭头
        .style("stroke", "#f7b500")
        .style("stroke-width", 1) //线条粗细
        .style("fill-opacity", 0)
        .style("cursor", "pointer")
        .attr("id", function(d, i) {
          return "edgepath" + i;
        })
        .on("mouseover", function(d) {
          return getStrokeWidth(d);
        })
        .on("mouseout", function() {
          edges_line.style("stroke-width", 1);
        })
        .on("click", (d, i) => {
          //deleteLine(d, i);
        });
      const edges_text = svg
        .append("g")
        .selectAll(".edgetext")
        .data(links)
        .enter()
        .append("text")
        .style("pointer-events", "none")
        .attr("class", "linetext")
        .attr("text-anchor", "middle")
        .attr("fill-opacity", 1)
        .style("cursor", "pointer")
        .attr({
          class: "edgelabel",
          id: function(d, i) {
            return "edgepath" + i;
          },
          dx: 50,
          dy: 0,
          fill: "#f7b500"
        });

      //设置线条上的文字
      edges_text
        .append("textPath")
        .attr("xlink:href", function(d, i) {
          return "#edgepath" + i;
        })
        .attr("pointer-events", "none")
        .attr("font-size", 9)
        .text(function(d) {
          return d.relation;
        });

      const circle_g = svg
        .selectAll("circle")
        .data(force.nodes()) //表示使用force.nodes数据
        .enter()
        .append("g")
        .attr("class", function(node, i) {
          return "g_circle_" + node.id;
        }) //标记circle的父节点
        .style("cursor", "pointer")
        .call(drag()) //将当前选中的元素传到drag函数中，使顶点可以被拖动
        .on("click", (node, i) => {
          if (d3.d3event.defaultPrevented) return; //阻止click事件和拖拽事件冲突
          circleClick(node, i, this);
        })
        .on("mouseover", node => {
          if (d3.d3event.defaultPrevented) return;
          showNodeInfo(node, this);
        });

      svg.on("dblclick.zoom", null); //取消svg和圆圈的双击放大事件（d3中默认开启7个事件，关闭防止与上面的双击事件冲突）
      circle_g.on("dblclick.zoom", null);

      //圆圈
      const circle = circle_g
        .append("circle")
        .style("stroke-width", "2px")
        .attr("r", 25) //设置圆圈半径
        .style("fill", function(node) {
          return getCircleColor(node);
        });

      let text = circle_g
        .append("text")
        .attr("dy", ".35em")
        .attr("text-anchor", "middle") //在圆圈中加上数据
        .style("fill", "#FFFFFF")
        .attr("x", function(d) {
          appendCircleText(d, this);
        });

      //圆圈的提示文字
      circle.append("svg:title").text(function(node) {
        // switch (node.label) {
        //     case 'Device': return node.name;
        //     case 'Application': return node.name;
        //     case 'Position': return node.name;
        // }
        return node.label;
      });
      text.append("svg:title").text(function(node) {
        // switch (node.label) {
        //     case 'Device': return node.name;
        //     case 'Application': return node.name;
        //     case 'Position': return node.name;
        // }
        return node.label;
      });

      function zoomed() {
        //svg下的g标签移动大小

        svg
          .selectAll("g")
          .attr(
            "transform",
            "translate(" +
              d3.d3event.translate +
              ")scale(" +
              d3.d3event.scale +
              ")"
          );
      }

      function getMarkerArrow(i) {
        svg
          .append("defs")
          .append("marker") //箭头
          .attr("id", "arrow" + i)
          .attr("markerUnits", "strokeWidth") //设置为strokeWidth箭头会随着线的粗细发生变化
          .attr("markerUnits", "userSpaceOnUse")
          .attr("markerWidth", 10) //标识的大小
          .attr("markerHeight", 10)
          .attr("viewBox", "0 -4 12 15") //坐标系的区域
          .attr("refX", 0) //箭头坐标
          .attr("refY", 0)
          .attr("orient", "auto") //绘制方向，可设定为：auto（自动确认方向）和 角度值
          .append("svg:path")
          .attr("stroke-width", 1) //箭头宽度
          .attr("d", "M0,-5L10,0L0,5") //箭头的路径
          .attr("fill", "rgba(247,181,0,1)"); //箭头颜色
        return "url(#arrow" + i + ")";
      }

      function getStrokeWidth(d) {
        edges_line.style("stroke-width", function(edge) {
          return edge.relation === d.relation ? 3 : 1;
        });
      }

      function drag() {
        //拖拽函数
        return force.drag().on("dragstart", function(d) {
          d3.d3event.sourceEvent.stopPropagation(); //取消默认事件
          d.fixed = true; //拖拽开始后设定被拖拽对象为固定
        });
      }

      function circleClick(node, i, _this) {
        //获取当前节点是否包含圆环
        let existedRing = svg
          .select(".g_circle_" + node.id)
          .selectAll(".g_circle_path");

        self.$options.methods.sentMessage(node);
        // sentMessage(node);
        //清除上个节点的圆圈以及图标
        svg.selectAll(".g_circle_path").remove();
        svg.selectAll(".remove_a").remove();
        svg.selectAll(".hide_a").remove();
        svg.selectAll(".unlock_a").remove();

        circle_g.style("opacity", function(nodes) {
          return 1;
        });
        if (existedRing && existedRing[0].length === 0) {
          //showCircleBorderOuterArc(node, i);
          //绘制灰色可点击圆圈，分为三部分分别绘制
          // showRemove(node, i, _this);
          // showUnlock(node, i, _this);
          // showHide(node, i, _this);
          circle_g.style("opacity", function(nodes) {
            if (nodes.id === node.id) {
              return 1;
            } else {
              return 0.2;
            }
          });
        }
      }

      function getCircleColor(node) {
        if (!labelColor.has(node.label)) {
          labelColor.set(node.label, colorList[labelIndex] || "#C477E9");
        }
        labelIndex++;
        let color = {
          Device: "#2d39af",
          Position: "#3c4ae7",
          Application: "#1f287b"
        }; //圆圈背景色
        return color[node.label] || "#2d39af";
        // return labelColor
      }

      function appendCircleText(d, _this) {
        let circleText = "";
        circleText = d.name;
        // if(d.label === 'Device' && d.name) {
        //     circleText = d.name;
        // } else if(d.label === 'Position') {
        //     circleText = d.name;
        // } else if (d.label === 'Application') {
        //     circleText = d.name;
        // }
        //如果小于四个字符，不换行
        if (circleText && circleText.length > 7) {
          circleText = circleText.substring(0, 7) + "...";
          d3.select(_this).text(function() {
            return "";
          });
        }
        d3.select(_this)
          .append("tspan")
          .attr("x", 0)
          .attr("y", 0)
          .attr("font-size", 10)
          .text(function() {
            return circleText;
          });
      }

      function deleteLine(d, i) {
        alert("delete this " + d + "," + i);
      }

      function tick() {
        circle.attr("transform", transform1); //圆圈
        text.attr("transform", transform2); //顶点文字
        edges_line.attr("d", function(d) {
          //绘制自己指向自己的路径
          if (d.relation.isSelf) {
            return getNodeSelfPath(d);
          }
          //绘制两个节点之间的路径
          return getNodesLine(d); //曲线路径
        });

        // if(circleBorderOuterArcObj !== null) {
        //   circleBorderOuterArcObj.attr("transform", function (d){ return "translate("+d.x+","+d.y+")" });
        // }

        //绘制节点删除功能半圆环
        if (removePath !== null) {
          removePath.attr("transform", function(d) {
            return "translate(" + d.x + "," + d.y + ")";
          });

          let r1 = null;
          remove_rect1
            .attr("d", function(d) {
              r1 = d;
            })
            .attr("x", r1.x + 33 + 6.75)
            .attr("y", r1.y - 36 + 9.75)
            .attr("width", 5)
            .attr("height", 3)
            .attr("rx", 1.5)
            .attr("ry", 1.5);

          let r2 = null;
          remove_rect2
            .attr("d", function(d) {
              r2 = d;
            })
            .attr("x", r2.x + 30 + 6.75)
            .attr("y", r2.y - 33 + 9.75)
            .attr("width", 12)
            .attr("height", 14)
            .attr("rx", 1.5)
            .attr("ry", 1.5);

          let l1 = null;
          remove_line1
            .attr("d", function(d) {
              l1 = d;
            })
            .attr("x1", l1.x + 28 + 6.75)
            .attr("y1", l1.y - 33 + 9.75)
            .attr("x2", l1.x + 45 + 6.75)
            .attr("y2", l1.y - 33 + 9.75);

          let l2 = null;
          remove_line2
            .attr("d", function(d) {
              l2 = d;
            })
            .attr("x1", l2.x + 34 + 6.75)
            .attr("y1", l2.y - 30 + 9.75)
            .attr("x2", l2.x + 34 + 6.75)
            .attr("y2", l2.y - 23 + 9.75);

          let l3 = null;
          remove_line3
            .attr("d", function(d) {
              l3 = d;
            })
            .attr("x1", l3.x + 38 + 6.75)
            .attr("y1", l3.y - 30 + 9.75)
            .attr("x2", l3.x + 38 + 6.75)
            .attr("y2", l3.y - 23 + 9.75);
        }

        //绘制解除节点位置锁定半圆环
        if (unlockPath !== null) {
          unlockPath.attr("transform", function(d) {
            return "translate(" + d.x + "," + d.y + ")";
          });
          unlock_path1.attr("transform", function(d) {
            return "translate(" + (d.x - 45) + "," + (d.y - 23) + ")";
          });

          let r1 = null;
          unlock_rect1
            .attr("d", function(d) {
              r1 = d;
            })
            .attr("x", r1.x - 52 + 6.75)
            .attr("y", r1.y - 30 + 9.75)
            .attr("width", 15)
            .attr("height", 12)
            .attr("rx", 1.5)
            .attr("ry", 1.5);

          let l1 = null;
          unlock_line1
            .attr("d", function(d) {
              l1 = d;
            })
            .attr("x1", l1.x - 52 + 15)
            .attr("y1", l1.y - 30 + 15)
            .attr("x2", l1.x - 52 + 15)
            .attr("y2", l1.y - 30 + 18);
        }

        //绘制隐藏节点和关系半圆环
        if (hidePath !== null) {
          hidePath.attr("transform", function(d) {
            return "translate(" + d.x + "," + d.y + ")";
          });

          hide_path1.attr("d", function(d) {
            return (
              "M" +
              (d.x - 13) +
              "," +
              (d.y + 42) +
              "A15,15,0,0,1" +
              (d.x + 13) +
              "," +
              (d.y + 42)
            );
          });
          hide_path2.attr("d", function(d) {
            return (
              "M" +
              (d.x - 12 + 10.4) +
              "," +
              (d.y + 34 + 10.937) +
              "A" +
              3.749 +
              "," +
              3.749 +
              ",0,1,1," +
              (d.x - 12 + 15.338) +
              "," +
              (d.y + 33 + 9)
            );
          });
          hide_path3.attr("d", function(d) {
            return (
              "M" +
              (d.x - 12) +
              "," +
              (d.y + 42) +
              "A20,20,0,0,0" +
              (d.x - 4) +
              "," +
              (d.y + 47)
            );
          });
          hide_path4.attr("d", function(d) {
            return (
              "M" +
              (d.x + 11) +
              "," +
              (d.y + 44) +
              "A20,20,0,0,0" +
              (d.x + 13) +
              "," +
              (d.y + 42)
            );
          });

          let c1 = null;
          hide_circle1
            .attr("d", function(d) {
              c1 = d;
            })
            .attr("cx", c1.x - 12 + 17.15)
            .attr("cy", c1.y + 33 + 17.25)
            .attr("r", 6);

          let l1 = null;
          hide_line1
            .attr("d", function(d) {
              l1 = d;
            })
            .attr("x1", l1.x - 12 + 14.15)
            .attr("y1", l1.y + 33 + 17.25)
            .attr("x2", l1.x - 12 + 20.15)
            .attr("y2", l1.y + 33 + 17.25);
        }
      }

      //设置圆圈和文字的坐标
      function transform1(d) {
        return "translate(" + d.x + "," + d.y + ")";
      }

      function transform2(d) {
        return "translate(" + d.x + "," + d.y + ")";
      }
      function showRemove(node, i, _this) {
        removePath = d3
          .select(".g_circle_" + node.id)
          .append("path")
          .attr("class", "g_circle_path")
          .attr("transform", "translate(" + node.x + "," + node.y + ")")
          .attr("d", rightArc)
          .attr("fill", "rgb(210, 213, 218)")
          .style("cursor", "pointer")
          .on("click", () => {
            removeNodeAndPath(node, _this);
          })
          .on("mouseover", function() {
            removePath.attr("fill", "rgb(185, 185, 185)");
          })
          .on("mouseout", function() {
            removePath.attr("fill", "rgb(210, 213, 218)");
          });

        d3.select(".g_circle_" + node.id)
          .append("g")
          .attr("class", "remove_a")
          .attr(
            "transform",
            "translate(" + (node.x + 33) + "," + (node.y - 24) + ") scale(0.7)"
          )
          .append("defs")
          .append("style")
          .text(
            ".remove_a{fill:none;stroke:#FFFFFF;stroke-linecap:round;stroke-linejoin:round;stroke-width:1.5px;}"
          );

        removePath
          .append("title")
          .attr("class", "remove_a")
          .text("Remove");
        remove_rect1 = d3
          .select(".g_circle_" + node.id)
          .append("rect")
          .attr("class", "remove_a")
          .attr("x", node.x + 33 + 6.75)
          .attr("y", node.y - 36 + 9.75)
          .attr("width", 5)
          .attr("height", 3)
          .attr("rx", 1.5)
          .attr("ry", 1.5);
        remove_rect2 = d3
          .select(".g_circle_" + node.id)
          .append("rect")
          .attr("class", "remove_a")
          .attr("x", node.x + 30 + 6.75)
          .attr("y", node.y - 33 + 9.75)
          .attr("width", 12)
          .attr("height", 14)
          .attr("rx", 1.5)
          .attr("ry", 1.5);
        remove_line1 = d3
          .select(".g_circle_" + node.id)
          .append("line")
          .attr("class", "remove_a")
          .attr("x1", node.x + 28 + 6.75)
          .attr("y1", node.y - 33 + 9.75)
          .attr("x2", node.x + 45 + 6.75)
          .attr("y2", node.y - 33 + 9.75);
        remove_line2 = d3
          .select(".g_circle_" + node.id)
          .append("line")
          .attr("class", "remove_a")
          .attr("x1", node.x + 34 + 6.75)
          .attr("y1", node.y - 30 + 9.75)
          .attr("x2", node.x + 34 + 6.75)
          .attr("y2", node.y - 23 + 9.75);
        remove_line3 = d3
          .select(".g_circle_" + node.id)
          .append("line")
          .attr("class", "remove_a")
          .attr("x1", node.x + 38 + 6.75)
          .attr("y1", node.y - 30 + 9.75)
          .attr("x2", node.x + 38 + 6.75)
          .attr("y2", node.y - 23 + 9.75);

        d3.selectAll(".remove_a").on("click", () => {
          removeNodeAndPath(node, _this);
        });
      }

      function showHide(node, i) {
        hidePath = d3
          .select(".g_circle_" + node.id)
          .append("path")
          .attr("class", "g_circle_path")
          .attr("transform", "translate(" + node.x + "," + node.y + ")")
          .attr("d", bottomArc)
          .attr("fill", "rgb(210, 213, 218)")
          .style("cursor", "pointer")
          .on("click", function() {
            hideNodeAndLinks(node);
          })
          .on("mouseover", function() {
            hidePath.attr("fill", "rgb(185, 185, 185)");
          })
          .on("mouseout", function() {
            hidePath.attr("fill", "rgb(210, 213, 218)");
          });

        d3.select(".g_circle_" + node.id)
          .append("g")
          .attr("class", "hide_a")
          .attr(
            "transform",
            "translate(" + (node.x - 8) + "," + (node.y + 38) + ") scale(0.7)"
          )
          .append("defs")
          .append("style")
          .text(
            ".hide_a{fill:none;stroke:#FFFFFF;stroke-linecap:round;stroke-linejoin:round;stroke-width:1.5px;}"
          );

        hidePath
          .append("title")
          .attr("class", "hide_a")
          .text("Hide");

        hide_path1 = d3
          .select(".g_circle_" + node.id)
          .append("path")
          .attr("class", "hide_a")
          .attr("d", function(d) {
            return (
              "M" +
              (d.x - 13) +
              "," +
              (d.y + 42) +
              "A15,15,0,0,1" +
              (d.x + 13) +
              "," +
              (d.y + 42)
            );
          });
        hide_path2 = d3
          .select(".g_circle_" + node.id)
          .append("path")
          .attr("class", "hide_a")
          .attr("d", function(d) {
            return (
              "M" +
              (d.x - 12 + 10.4) +
              "," +
              (d.y + 34 + 10.937) +
              "A" +
              3.749 +
              "," +
              3.749 +
              ",0,1,1," +
              (d.x - 12 + 15.338) +
              "," +
              (d.y + 33 + 9)
            );
          });
        hide_path3 = d3
          .select(".g_circle_" + node.id)
          .append("path")
          .attr("class", "hide_a")
          .attr("d", function(d) {
            return (
              "M" +
              (d.x - 12) +
              "," +
              (d.y + 42) +
              "A20,20,0,0,0" +
              (d.x - 4) +
              "," +
              (d.y + 47)
            );
          });
        hide_path4 = d3
          .select(".g_circle_" + node.id)
          .append("path")
          .attr("class", "hide_a")
          .attr("d", function(d) {
            return (
              "M" +
              (d.x + 11) +
              "," +
              (d.y + 44) +
              "A20,20,0,0,0" +
              (d.x + 13) +
              "," +
              (d.y + 42)
            );
          });
        hide_circle1 = d3
          .select(".g_circle_" + node.id)
          .append("circle")
          .attr("class", "hide_a")
          .attr("cx", node.x - 12 + 17.15)
          .attr("cy", node.y + 33 + 17.25)
          .attr("r", 6);
        hide_line1 = d3
          .select(".g_circle_" + node.id)
          .append("line")
          .attr("class", "hide_a")
          .attr("x1", node.x - 12 + 14.15)
          .attr("y1", node.y + 33 + 17.25)
          .attr("x2", node.x - 12 + 20.15)
          .attr("y2", node.y + 33 + 17.25);
        d3.selectAll(".hide_a").on("click", d => {
          hideNodeAndLinks(d);
        });
      }
      function showUnlock(node, i) {
        unlockPath = d3
          .select(".g_circle_" + node.id)
          .append("path")
          .attr("class", "g_circle_path")
          .attr("transform", "translate(" + node.x + "," + node.y + ")")
          .attr("d", leftArc)
          .attr("fill", "rgb(210, 213, 218)")
          .style("cursor", "pointer")
          .on("click", function(d) {
            unlockNodeFixed(d);
          })
          .on("mouseover", function() {
            unlockPath.attr("fill", "rgb(185, 185, 185)");
          })
          .on("mouseout", function() {
            unlockPath.attr("fill", "rgb(210, 213, 218)");
          });

        d3.select(".g_circle_" + node.id)
          .append("g")
          .attr("class", "unlock_a")
          .attr(
            "transform",
            "translate(" + (node.x - 52) + "," + (node.y - 30) + ") scale(0.7)"
          )
          .append("defs")
          .append("style")
          .text(
            ".unlock_a{fill:none;stroke:#FFFFFF;stroke-linecap:round;stroke-linejoin:round;stroke-width:1.5px;}"
          );

        unlockPath
          .append("title")
          .attr("class", "unlock_a")
          .text("Unlock");
        unlock_path1 = d3
          .select(".g_circle_" + node.id)
          .append("path")
          .attr("class", "unlock_a")
          .attr(
            "transform",
            "translate(" + (node.x - 45) + "," + (node.y - 23) + ")"
          )
          .attr(
            "d",
            d3.svg
              .arc()
              .outerRadius(5.3)
              .innerRadius(5)
              .startAngle(-1.8)
              .endAngle(1.8)
          )
          .attr("fill", "#FFFFFF");

        unlock_rect1 = d3
          .select(".g_circle_" + node.id)
          .append("rect")
          .attr("class", "unlock_a")
          .attr("x", node.x - 52 + 6.75)
          .attr("y", node.y - 30 + 9.75)
          .attr("width", 15)
          .attr("height", 12)
          .attr("rx", 1.5)
          .attr("ry", 1.5);
        unlock_line1 = d3
          .select(".g_circle_" + node.id)
          .append("line")
          .attr("class", "unlock_a")
          .attr("x1", node.x - 52 + 15)
          .attr("y1", node.y - 30 + 15)
          .attr("x2", node.x - 52 + 15)
          .attr("y2", node.y - 30 + 18);

        d3.selectAll(".unlock_a").on("click", d => {
          unlockNodeFixed(d);
        });
      }
      function hideNodeAndLinks(node) {
        d3.d3event.stopPropagation();
        circle_g.attr("node", function(n) {
          if (n.id === node.id) {
            d3.select(this).remove();
          }
        });
        edges_line.attr("d", function(d) {
          if (d.source.id === node.id || d.target.id === node.id) {
            d3.select(this).remove();
          }
        });
      }
      function removeNodeAndPath(node, _this) {
        d3.d3event.stopPropagation();
        // alert('delete this '+ node + ',' + _this );
      }
      function showNodeInfo(node, _this) {
        // window.console.log(node);
        // window.console.log(_this);
      }
      function unlockNodeFixed(d) {
        d3.d3event.stopPropagation();
        d3.select(this).classed("fixed", (d.fixed = false)); //解除节点位置锁定
        //清除上个节点的圆圈以及图标
        svg.selectAll(".g_circle_path").remove();
        svg.selectAll(".remove_a").remove();
        svg.selectAll(".hide_a").remove();
        svg.selectAll(".unlock_a").remove();
      }
    },
    getOntologyNodesLinks(id) {
      listNodesLinks(id).then(response => {
        let datas = response.data;
        console.log("data=", datas);
        this.renderGraph(datas);
      });
    },
    sentMessage(node) {
      bus.$emit("ontologyClickEvent", { id: node.id, label: node.label });
    },
    showSelect(id) {
      const svg = d3.select("#graph").select("svg");

      const circle_change = svg.selectAll("circle");

      const force = d3.layout
        .force();
        force.nodes()
        .forEach(function(d) {
             console.log("d=============",d);
          if (d.id == id) {
             
            d.fixed = true;
          } else {
            d.fixed = false;
          }
        });

      circle_change.style("opacity", function(nodes) {
        if (nodes.id === id) {
          document.getElementsByClassName(
            "g_circle_" + nodes.id
          )[0].style.opacity = "1";
          //   svg.attr(
          //     "transform",
          //     "translate(" + nodes.x  + "," + nodes.y  + ")"
          //   );
          console.log("nodes=", nodes);
        } else {
          document.getElementsByClassName(
            "g_circle_" + nodes.id
          )[0].style.opacity = "0.2";
        }
      });
    }
  }
};
</script>

<style>
#graph {
  width: 100%;
  height: 100%;
  overflow: hidden;
  background-color: #17181c;
}
</style>
