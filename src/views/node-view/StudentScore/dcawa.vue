<template>
      
  <div>
       
    <el-tabs v-model="awaactiveName" @tab-click="awahandleClick">
      <el-row :gutter="24">
        <el-col :span="3"
          ><el-input
            v-model="tratqueryInfo.query.name"
            placeholder="请输入姓名"
            clearable
            @clear="GettratMarksLists"
          ></el-input
        ></el-col>
        <el-col :span="3"
          ><el-input
            v-model="tratqueryInfo.query.market"
            placeholder="请输入市场部"
            clearable
            @clear="GettratMarksLists"
          ></el-input
        ></el-col>
        <el-col :span="3">
          <el-select
            v-model="tratqueryInfo.query.depar_id"
            placeholder="请选择学院"
            clearable
          >
            <el-option
              v-for="item in deparoptions"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            >
            </el-option> </el-select
        ></el-col>
        <el-col :span="3">
          <el-select
            v-model="tratqueryInfo.query.cls_id"
            placeholder="班级:请先选择学院"
            clearable
            :disabled="fdyjs"
          >
            <el-option
              v-for="item in sclsoptions"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            >
            </el-option> </el-select
        ></el-col>
        <el-col :span="3">
          <el-select
            v-model="tratqueryInfo.query.fdy_id"
            clearable
            :disabled="fdyjs"
            placeholder="导员:请先选择学院"
          >
            <el-option
              v-for="item in sfdyoptions"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            >
            </el-option>
          </el-select>
        </el-col>
        <el-col :span="3">
          <el-select
            v-model="tratqueryInfo.query.js_id"
            clearable
            :disabled="fdyjs"
            placeholder="讲师:请先选择学院"
          >
            <el-option
              v-for="item in sjsoptions"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            >
            </el-option>
          </el-select>
        </el-col>
      </el-row>
      <el-row :gutter="24" style="margin-top: 20px">
        <el-col :span="3">
          <el-select
            v-model="tratqueryInfo.query.sex"
            placeholder="选择性别"
            clearable
          >
            <el-option
              v-for="item in sexoptions"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            >
            </el-option> </el-select
        ></el-col>
        <el-col :span="3">
          <el-input
            placeholder="请输入宿舍号"
            v-model="tratqueryInfo.query.dormnumber"
            clearable
            @clear="GettratMarksLists"
          ></el-input
        ></el-col>
        <el-col :span="3">
          <el-autocomplete
            v-model="sstate"
            :fetch-suggestions="awaquerySearchAsync"
            placeholder="请输入加分项"
            @select="awahandleSelect"
            clearable
          ></el-autocomplete
        ></el-col>
        <el-col :span="3">
          <el-date-picker
              v-model="tratqueryInfo.query.data"
              align="right"
              type="date"
              placeholder="选择加分日期"
              value-format="yyyy-MM-dd"
              :picker-options="pickerOptions"
            >
            </el-date-picker
          ></el-col>
        <el-col :span="3"
          ><el-button
            class="filter-item"
            type="primary"
            icon="el-icon-search"
            @click="GettratMarksLists"
          >
            搜索
          </el-button></el-col
        ><el-col :span="3"
          ><el-button class="filter-item" type="primary" @click="resetInput">
            重置
          </el-button></el-col
        >
      </el-row>
      <el-tab-pane label="待审核" name="status0"
        ><awaStatus0></awaStatus0
      ></el-tab-pane>
      <el-tab-pane label="通过" name="status1"
        ><awaStatus1></awaStatus1
      ></el-tab-pane>
      <el-tab-pane label="导员再审" name="status2"
        ><awaStatus2></awaStatus2
      ></el-tab-pane>
      <el-tab-pane label="废弃" name="status3"
        ><awaStatus3></awaStatus3
      ></el-tab-pane>
      <el-tab-pane label="申诉无效" name="status4"
        ><awaStatus4></awaStatus4
      ></el-tab-pane>
    </el-tabs>
    <!-- 分页区域 -->
    <el-pagination
      style="width: 95%; margin: 0 auto; margin-top: 40px"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="tratqueryInfo.page"
      :page-sizes="[5, 10, 15]"
      :page-size="tratqueryInfo.page_size"
      layout="total, sizes, prev, pager, next, jumper"
      :total="total"
    >
    </el-pagination>
  </div>
</template>

<script>
import awaStatus0 from "./awatab/awaStatus0";
import awaStatus1 from "./awatab/awaStatus1";
import awaStatus2 from "./awatab/awaStatus2";
import awaStatus3 from "./awatab/awaStatus3";
import awaStatus4 from "./awatab/awaStatus4";
import { mapGetters } from "vuex";
import { getDeparcls } from "network/nodeapi/classes";
import { getallDepartment } from "network/nodeapi/department";
import { GetAwardedMarksall } from "network/nodeapi/studentscore";
export default {
  props: {},
  computed: {
    ...mapGetters(["rdedMarksLists", "total"]),
    // total() {
    //   return this.rdedMarksLists.length;
    // },
  },
  data() {
    return {
      pickerOptions: {
        disabledDate(time) {
          return time.getTime() > Date.now();
        },
        shortcuts: [
          {
            text: "今天",
            onClick(picker) {
              picker.$emit("pick", new Date());
            },
          },
          {
            text: "昨天",
            onClick(picker) {
              const date = new Date();
              date.setTime(date.getTime() - 3600 * 1000 * 24);
              picker.$emit("pick", date);
            },
          },
          {
            text: "前天",
            onClick(picker) {
              const date = new Date();
              date.setTime(date.getTime() - 3600 * 1000 * 24 * 2);
              picker.$emit("pick", date);
            },
          },
        ],
      },
      awaactiveName: "status0",
      tratqueryInfo: {
        query: {
          fdy_id: null,
          js_id: null,
          depar_id: null,
          cls_id: null,
          state: 1,
          name: "",
          sex: null,
          // depar: "",
          // cls: "",
          // lecturer: "",
          // counsellor: "",
          dormnumber: null,
          content: "",
          data: null,
          market: "",
          status: null,
        },
        // 当前的页数
        page: 1,
        // 当前每页显示多少条数据
        page_size: 5,
      },
      sexoptions: [
        {
          value: 1,
          label: "男",
        },
        {
          value: 0,
          label: "女",
        },
      ],
      deparoptions: [],
      fdyjs: true,
      sclsoptions: [],
      sjsoptions: [{ value: "", label: "请选择讲师" }],
      sfdyoptions: [{ value: "", label: "请选择导员" }],
      AwardedMarkslist: [],
      sstate: "",
    };
  },
  watch: {
    "tratqueryInfo.query.depar_id": function (val) {
      console.log("id", val);
      if (val) {
        this.sjsoptions = [];
        this.sfdyoptions = [];
        this.sgetDepartmentjs(val);
        this.sgetDepartmentfdy(val);
        this.sgetclassname(val);
        this.fdyjs = false;
      } else {
        this.tratqueryInfo.query.cls_id = "";
        this.tratqueryInfo.query.js_id = "";
        this.tratqueryInfo.query.fdy_id = "";
        this.fdyjs = true;
        this.jsoptions = [];
        this.fdyoptions = [];
      }
    },
    sstate: function (val) {
      if (!val) {
        this.tratqueryInfo.query.content = "";
      }
    },
  },
  components: {
    awaStatus0,
    awaStatus1,
    awaStatus2,
    awaStatus3,
    awaStatus4,
  },
  async created() {
    this.GetAwardedMarksall();
    if (this.awaactiveName == "status0") {
      this.tratqueryInfo.query.status = 0;
    } else if (this.awaactiveName == "status1") {
      this.tratqueryInfo.query.status = 1;
    } else if (this.awaactiveName == "status2") {
      this.tratqueryInfo.query.status = 2;
    } else if (this.awaactiveName == "status3") {
      this.tratqueryInfo.query.status = 3;
    } else if (this.awaactiveName == "status4") {
      this.tratqueryInfo.query.status = 4;
    }
    this.getallDepartment();
    await this.$store.dispatch(
      "scorelist/GettratMarksLists",
      this.tratqueryInfo
    );
  },
  methods: {
    GettratMarksLists() {
      this.$store.dispatch("scorelist/GettratMarksLists", this.tratqueryInfo);
    },
    //获取所有学院
    async getallDepartment() {
      const res = await getallDepartment();
      const content = res.data;
      this.deparoptions = [];
      content.forEach((item) => {
        if (item.label == 1) {
          let obj = {};
          obj.value = item._id;
          obj.label = item.name;
          this.deparoptions.push(obj);
        }
      });
    },

    //获取部门下的班级名称列表
    async sgetclassname(id) {
      const res = await getDeparcls(id);
      const { data } = res;
      this.sclsoptions = [];
      data.forEach((item) => {
        const obj = {};
        obj.value = item._id;
        obj.label = item.name;
        this.sclsoptions.push(obj);
      });

      console.log("版恶疾", data, this.sclsoptions);
    },
    async sgetDepartmentjs(id) {
      const res = await getallDepartment({ depar_id: id, role: "讲师" });
      console.log(res, 78978979, "讲师");
      if (res.code == 200) {
        res.data.forEach((item) => {
          const obj = {};
          obj.value = item._id;
          obj.label = item.name;
          this.sjsoptions.push(obj);
        });
      }
    },
    async sgetDepartmentfdy(id) {
      const res = await getallDepartment({ depar_id: id, role: "导员" });
      console.log(res, 78978979, "导员");
      if (res.code == 200) {
        res.data.forEach((item) => {
          const obj = {};
          obj.value = item._id;
          obj.label = item.name;
          this.sfdyoptions.push(obj);
        });
      }
    },
    resetInput() {
      const status = this.tratqueryInfo.query.status;
      this.tratqueryInfo = {
        query: {
          fdy_id: null,
          js_id: null,
          depar_id: null,
          cls_id: null,
          state: 0,
          name: "",
          sex: null,
          // depar: "",
          // cls: "",
          // lecturer: "",
          // counsellor: "",
          dormnumber: null,
          content: "",
          data: null,
          market: "",
          status: null,
        },
        // 当前的页数
        page: 1,
        // 当前每页显示多少条数据
        page_size: 5,
      };
      this.tratqueryInfo.query.status = status;
    },
    async awahandleClick(tab, event) {
      if (this.awaactiveName == "status0") {
        this.tratqueryInfo.query.status = 0;
      } else if (this.awaactiveName == "status1") {
        this.tratqueryInfo.query.status = 1;
      } else if (this.awaactiveName == "status2") {
        this.tratqueryInfo.query.status = 2;
      } else if (this.awaactiveName == "status3") {
        this.tratqueryInfo.query.status = 3;
      } else if (this.awaactiveName == "status4") {
        this.tratqueryInfo.query.status = 4;
      }
      await this.$store.dispatch(
        "scorelist/GettratMarksLists",
        this.tratqueryInfo
      );
    },
    //获取所有加分项
    async GetAwardedMarksall() {
      const res = await GetAwardedMarksall();
      if (res.code == 200) {
        res.data.forEach((item) => {
          const obj = {};
          obj.value = item.content;
          obj._id = item._id;
          obj.Marks = item.Marks;
          this.AwardedMarkslist.push(obj);
        });
        this.$message.success("获取加分项数据成功");
      }
    },
    awaquerySearchAsync(queryString, cb) {
      let AwardedMarkslist = this.AwardedMarkslist;
      let results = queryString
        ? AwardedMarkslist.filter(this.awacreateStateFilter(queryString))
        : AwardedMarkslist;

      clearTimeout(this.timeout);
      this.timeout = setTimeout(() => {
        cb(results);
      }, 100 * Math.random());
    },
    awacreateStateFilter(queryString) {
      return (sstate) => {
        return (
          sstate.value.toLowerCase().indexOf(queryString.toLowerCase()) === 0
        );
      };
    },
    awahandleSelect(item) {
      this.tratqueryInfo.query.content = item.value;
    },
    async handleSizeChange(newSize) {
      this.tratqueryInfo.page_size = newSize;
      await this.$store.dispatch(
        "scorelist/GettratMarksLists",
        this.tratqueryInfo
      );
    },

    async handleCurrentChange(newPage) {
      this.tratqueryInfo.page = newPage;
      await this.$store.dispatch(
        "scorelist/GettratMarksLists",
        this.tratqueryInfo
      );
    },
  },
};
</script>

<style scoped lang="scss"></style>
