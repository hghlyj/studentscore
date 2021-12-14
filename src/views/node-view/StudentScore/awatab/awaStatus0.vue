<template>
  <div class="studentedit">
    <el-table
      :data="rdedMarksLists"
      style="margin: 0 auto; margin-top: 30px"
      border
    >
      <el-table-column prop="name" label="姓名" width="100" align="center">
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
      <el-table-column prop="depar" label="学院" width="130" align="center">
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

      <el-table-column
        prop="createTime"
        label="发布时间"
        align="center"
        width="150"
      >
        <template slot-scope="scope">
          {{ scope.row.createTime | showDate }}
        </template>
      </el-table-column>
      <el-table-column
        prop="updateTime"
        label="批改时间"
        align="center"
        width="150"
      >
        <template slot-scope="scope">
          {{ scope.row.updateTime | showDate }}
        </template>
      </el-table-column>
      <el-table-column prop="status" label="状态" align="center" width="100">
        <template slot-scope="scope">
          <span v-if="scope.row.status == 0">待处理</span>
          <span v-if="scope.row.status == 1">通过</span>
          <span v-if="scope.row.status == 2">导员再审</span>
          <span v-if="scope.row.status == 3">作废</span>
        </template>
      </el-table-column>

      <el-table-column fixed="right" label="操作" width="200" align="center">
        <template slot-scope="scope">
          <span v-permission="['admin', 'dc']">
            <el-link type="primary" @click="status1(scope.row)">通过</el-link
            ><el-link type="danger" @click="opposeDialoghand(scope.row)"
              >不通过</el-link
            >
          </span>
          <span v-permission="['fdy']">
            <el-link type="success" @click="status1(scope.row)"
              >等待督察审核</el-link
            >
          </span>
        </template>
      </el-table-column>
    </el-table>
    <!--拒绝对话框-->
    <el-dialog
      :title="opposeDialogtitle"
      :visible.sync="opposeDialogVisible"
      width="30%"
      @close="opposeDialogClosed"
    >
      <span slot="footer" class="dialog-footer">
        <el-form
          :model="tratqueryInfo"
          :rules="opposeFormRules"
          ref="opposeFormRef"
          label-width="140px"
          class="sub-form"
        >
          <el-form-item label="拒绝加分原因:" prop="fdyoppose">
            <el-input
              v-model="tratqueryInfo.fdyoppose"
              placeholder="请输入内容"
            ></el-input>
          </el-form-item>
        </el-form>
        <el-button @click="opposeDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="opposesubmit">确 定</el-button>
      </span>
    </el-dialog>
    <!--图片放大-->
    <el-dialog :visible.sync="dialogVisibleImg">
      <img width="100%" :src="dialogImageUrl" alt="" />
    </el-dialog>
  </div>
</template>

<script>
import permission from "@/directive/permission/index.js"; // 权限判断指令
import { mapGetters } from "vuex";
export default {
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
      tratqueryInfo: {
        fdyoppose:'',
      },
      AwaSelectoptions: [
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
    //    审核违纪率
    async status1(row) {
      const confirmResult = await this.$confirm(
        "此操作将给该同学加分, 是否继续?",
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
      if (res) {
        this.$message.success("加分成功！");
        this.GettratMarksLists();
      }
    },

    //拒绝
    async opposeDialoghand(row) {
      this.opposeid = row._id;
      this.opposeDialogtitle = "拒绝加分";
      this.opposeDialogVisible = true;
    },

    opposesubmit() {
      this.$refs.opposeFormRef.validate(async (valid) => {
        if (!valid) return;
        const content = this.tratqueryInfo.fdyoppose;
        const res = await this.$store.dispatch("scorelist/EditMarksLists", {
          id: this.opposeid,
          status: 2,
          fdyoppose: content,
        });
        if (res.code == 200) {
          this.opposeDialogVisible = false;
          this.GettratMarksLists();
          this.$message.success("拒绝加分成功！");
        }
      });
    },
    opposeDialogClosed() {
      console.log(111111);
      // this.$refs.hisFormRef.resetFields();
    },

    //图片放大
    awahandlePreview(url) {
      this.dialogImageUrl = url;
      this.dialogVisibleImg = true;
    },
  },
};
</script>

<style scoped lang="less"></style>
