<template>
      
  <div>
    <el-table
      :data="rdedMarksLists"
      style="margin: 0 auto; margin-top: 30px"
      border
    >
      <el-table-column prop="name" label="姓名" align="center" width="130">
      </el-table-column>
      <el-table-column prop="sex" label="性别" align="center" width="80">
        <template slot-scope="scope">
          <span v-if="scope.row.sex == 1">男</span>
          <span v-if="scope.row.sex == 0">女</span>
        </template>
      </el-table-column>
      <el-table-column label="宿舍号-床位" width="150">
        <template slot-scope="scope">
          {{ scope.row.dormnumber }}-{{ scope.row.bednumber }}
        </template>
      </el-table-column>
      <el-table-column prop="depar" label="学院" align="center" width="130">
      </el-table-column>
      <el-table-column prop="cls" label="班级" align="center" width="130">
      </el-table-column>
      <el-table-column prop="lecturer" label="讲师" align="center" width="130">
      </el-table-column>
      <el-table-column
        prop="counsellor"
        label="导员"
        align="center"
        width="130"
      >
      </el-table-column>
      <el-table-column prop="market" label="市场部" align="center" width="130">
      </el-table-column>

      <el-table-column
        prop="disciplinetype"
        label="违纪类型"
        align="center"
        width="130"
      >
      </el-table-column>
      <el-table-column prop="content" label="内容" align="center" width="130">
      </el-table-column>
      <el-table-column prop="Marks" label="分数" align="center" width="130">
      </el-table-column>
      <el-table-column prop="avatar" label="图片" align="center" width="130">
        <template slot-scope="scope">
           <span v-if="scope.row.avatar">
            <img
              :src="url + scope.row.avatar"
              alt=""
              width="50px"
              @click="awahandlePreview(url + scope.row.avatar)"
            />
          </span>
          <span v-else>无</span>
        </template>
      </el-table-column>
      <el-table-column prop="data" label="时间" align="center" width="130">
        <template slot-scope="scope">
          {{ scope.row.data | showDate2 }}
        </template>
      </el-table-column>
      <el-table-column prop="course" label="课节" align="center" width="130">
      </el-table-column>

      <el-table-column
        prop="createTime"
        label="发布时间"
        align="center"
        width="160"
      >
        <template slot-scope="scope">
          {{ scope.row.createTime | showDate }}
        </template>
      </el-table-column>
      <el-table-column
        prop="updateTime"
        label="批改时间"
        align="center"
        width="160"
      >
        <template slot-scope="scope">
          {{ scope.row.updateTime | showDate }}
        </template>
      </el-table-column>

      <el-table-column fixed="right" label="操作" align="center" width="200">
        <template slot-scope="scope">
          <span v-permission="['admin', 'fdy']">
            <el-link type="success" @click="status1(scope.row)">扣分</el-link>
          </span>
          <span v-permission="['dc']">
            <el-link type="success">不同意导员申诉</el-link>
          </span>
        </template>
      </el-table-column>
    </el-table>

    <!--图片放大-->
    <el-dialog :visible.sync="dialogVisibleImg">
      <img width="100%" :src="dialogImageUrl" alt="" /> </el-dialog
    >    
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import permission from "@/directive/permission/index.js"; // 权限判断指令
export default {
  name: "substates1",
  props: {},
  computed: {
    ...mapGetters(["rdedMarksLists"]),
  },
  data() {
    return {
      //拒绝  对话框
      opposeDialogVisible: false,
      opposeDialogtitle: "",
      opposeFormRules: {},
      opposeid: null,
      url: "http://127.0.0.1:3000/",
      dialogVisibleImg: false,
      dialogImageUrl: "",

      SubtratMarksLists: [],

      SubSelectoptions: [
        { value: "", label: "请选择" },
        { value: 0, label: "待处理" },
        { value: 1, label: "通过" },
        { value: 2, label: "不通过" },
        { value: 3, label: "作废" },
      ],
    };
  },
  directives: { permission },
  created() {},
  filters: {
    showDate: function (value) {
      var moment = require("moment");
      let date = moment(value);
      return date.format("YYYY-MM-DD  HH:mm:ss");
    },
    showDate2: function (value) {
      var moment = require("moment");
      let date = moment(value);
      return date.format("YYYY-MM-DD");
    },
  },
  methods: {
    GettratMarksLists() {
      this.$store.dispatch("scorelist/GettratMarksLists");
    },
    //    审核违纪
    async status1(row) {
      const confirmResult = await this.$confirm(
        "此操作将给该同学扣分, 是否继续?",
        "提示",
        {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
        }
      ).catch((err) => err);
      if (confirmResult !== "confirm") {
        return this.$message.info("已取消删除");
      }
      const res = await this.$store.dispatch("scorelist/EditMarksLists", {
        id: row._id,
        status: 1,
      });
      if (res.code == 200) {
        this.$message.success("扣分成功！");
        this.GettratMarksLists();
      }
    },
    //图片放大
    awahandlePreview(url) {
      this.dialogImageUrl = url;
      this.dialogVisibleImg = true;
    },
  },
};
</script>

<style scoped lang="scss"></style>
