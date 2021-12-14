<template>
  <div class="app-container">
    <div class="filter-container">
      <el-row :gutter="24">
        <el-col :span="3"
          ><el-input
            v-model="queryInfo.query.content"
            placeholder="请输入内容"
            clearable
            @clear="GetSubtractMarks"
          ></el-input
        ></el-col>
        <el-col :span="3"
          ><el-select
            v-model="queryInfo.query.Disciplinetype"
            placeholder="违纪类型"
            clearable
            style="width: 190px"
            class="filter-item"
          >
            <el-option
              v-for="item in Disciplinetypeslist"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            /> </el-select
        ></el-col>
        <el-col :span="3"
          ><el-select
            v-model="queryInfo.query.expel"
            clearable
            placeholder="选择违纪程度"
          >
            <el-option
              v-for="item in expeloptions"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            >
            </el-option> </el-select
        ></el-col>
        <el-col :span="3"
          ><el-button
            v-waves
            class="filter-item"
            type="primary"
            icon="el-icon-search"
            @click="GetSubtractMarks"
          >
            搜索
          </el-button></el-col
        >
        <el-col :span="3"
          ><el-button
            class="filter-item"
            style="margin-left: 10px"
            type="primary"
            icon="el-icon-edit"
            @click="handleCreate"
            v-permission="['admin']"
          >
            添加
          </el-button></el-col
        >
        <el-col :span="3"
          ><el-button
            v-waves
            :loading="downloadLoading"
            class="filter-item"
            type="primary"
            icon="el-icon-download"
            @click="handleDownload"
          >
            导出
          </el-button></el-col
        >
      </el-row>
    </div>

    <el-table
      :key="tableKey"
      v-loading="listLoading"
      :data="SubtractMarkslist"
      border
      fit
      highlight-current-row
      style="width: 100%"
    >
      <el-table-column label="违纪类型" prop="Disciplinetype">
      </el-table-column>
      <el-table-column label="扣分原因" prop="content"> </el-table-column>
      <el-table-column label="备注" prop="remark"> </el-table-column>
      <el-table-column label="添加时间" prop="createTime" width="180">
        <template slot-scope="scope">
          <div>
            {{ scope.row.createTime | showDate }}
          </div>
        </template>
      </el-table-column>
      <el-table-column label="修改时间" prop="updateTime" width="180">
        <template slot-scope="scope">
          <div>
            {{ scope.row.updateTime | showDate }}
          </div>
        </template></el-table-column
      >
      <el-table-column label="分数" prop="Marks" width="150">
        <template slot-scope="scope">
          <span v-if="!scope.row.Marks">
            <el-button type="danger" plain disabled>开除处理</el-button></span
          >
          <span v-else>{{ scope.row.Marks }}</span>
        </template>
      </el-table-column>
      <el-table-column
        label="操作"
        align="center"
        width="230"
        class-name="small-padding fixed-width"
      >
        <template slot-scope="{ row }">
          <el-button
            type="primary"
            size="mini"
            @click="handleUpdate(row)"
            v-permission="['admin']"
          >
            修改
          </el-button>
          <el-button
            v-if="row.status != 'deleted'"
            size="mini"
            type="danger"
            @click="handleDelete(row)"
            v-permission="['admin']"
          >
            删除
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <!-- 分页区域 -->
    <el-pagination
      style="margin-top: 20px"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="queryInfo.page"
      :page-sizes="[5, 10, 15]"
      :page-size="queryInfo.page_size"
      layout="total, sizes, prev, pager, next, jumper"
      :total="total"
    >
    </el-pagination>

    <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible">
      <el-form
        ref="dataForm"
        :rules="rules"
        :model="temp"
        label-position="left"
        label-width="130px"
        style="width: 400px; margin-left: 50px"
      >
        <el-form-item label="违纪类型" prop="content">
          <el-select
            v-model="temp.Disciplinetype"
            placeholder="违纪类型"
            clearable
            style="width: 190px"
            class="filter-item"
          >
            <el-option
              v-for="item in Disciplinetypeslist"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="减分项" prop="content">
          <el-input v-model="temp.content" />
        </el-form-item>
        <el-form-item label="备注" prop="remark">
          <el-input v-model="temp.remark" />
        </el-form-item>
        <el-form-item label="分数" prop="Marks" v-if="!temp.expel">
          <el-input v-model="temp.Marks" />
        </el-form-item>

        <el-form-item label="是否构成开除" prop="expel">
          <el-switch
            v-model="temp.expel"
            active-color="#13ce66"
            inactive-color="#ff4949"
          >
          </el-switch>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false"> 取消 </el-button>
        <el-button
          type="primary"
          @click="dialogStatus === 'create' ? createData() : updateData()"
        >
          确定
        </el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import waves from "@/directive/waves"; // waves directive
import { parseTime } from "@/utils";

import {
  GetSubtractMarks,
  CreateSubtractMarks,
  UpdateSubtractMarks,
  DeleteSubtractMarks,
  GetSubtractMarksOne,
} from "network/nodeapi/studentscore";
import permission from "@/directive/permission/index.js"; // 权限判断指令
export default {
  name: "ComplexTable",
  directives: { waves, permission },
  data() {
    return {
      tableKey: 0,
      SubtractMarkslist: null,
      Disciplinetypeslist: [
        { value: "宿舍违纪", label: "宿舍违纪" },
        { value: "学院违纪", label: "学院违纪" },
      ],
       expeloptions: [
        { value: true, label: '构成开出'},
        { value: false, label: "未构成开除" },
      ],
      organizationlist: [],
      total: 0,
      listLoading: true,
      // 获取用户列表的参数对象
      queryInfo: {
        query: {
          Disciplinetype: null,
          content: "",
          expel:null,
        },
        // 当前的页数
        page: 1,
        // 当前每页显示多少条数据
        page_size: 5,
      },
      editid: "",
      temp: {
        content: "",
        Marks: "",
        Disciplinetype: "",
        expel: 0,
        remark: "",
      },
      dialogFormVisible: false,
      dialogStatus: "",
      textMap: {
        update: "Edit",
        create: "Create",
      },
      rules: {
        Disciplinetype: [
          { required: true, message: "违纪类型必填", trigger: "blur" },
        ],
        content: [{ required: true, message: "扣分项为必填", trigger: "blur" }],
        Marks: [{ required: true, message: "分数为必填", trigger: "blur" }],
        expel: [
          { required: true, message: "是否构成开除必填", trigger: "blur" },
        ],
        remark: [{ required: true, message: "备注为必填", trigger: "blur" }],
      },
      downloadLoading: false,
    };
  },
  async created() {
    this.GetSubtractMarks();
  },
  filters: {
    showDate: function (value) {
      var moment = require("moment");
      let date = moment(value);
      return date.format("YYYY-MM-DD  h:mm:ss");
    },
  },
  methods: {
    async GetSubtractMarks() {
      this.listLoading = true;
      const res = await GetSubtractMarks(this.queryInfo);
      console.log(res.data, 21321412412412412412412421);
      if (res) {
        this.SubtractMarkslist = res.data;
        this.total = res.count;
        setTimeout(() => {
          this.listLoading = false;
        }, 1 * 100);
      }
    },

    resetTemp() {
      this.temp = {
        content: "",
        Marks: null,
        Disciplinetype: "",
        expel: null,
        remark: "",
      };
    },

    handleCreate() {
      this.resetTemp();
      this.dialogStatus = "create";
      this.dialogFormVisible = true;
      this.$nextTick(() => {
        this.$refs["dataForm"].clearValidate();
      });
    },

    createData() {
      this.$refs["dataForm"].validate(async (valid) => {
        if (valid) {
          if (this.temp.expel == true) {
            this.temp.Marks = "";
          }
          const res = await CreateSubtractMarks(this.temp);
          if (res) {
            this.GetSubtractMarks();
            this.dialogFormVisible = false;
            this.$notify({
              title: "Success",
              message: "添加成功",
              type: "success",
            });
          }
        }
      });
    },

    async handleUpdate(row) {
      this.editid = row._id;
      this.resetTemp();
      const res = await GetSubtractMarksOne(row._id);
      if (res.code != 200) {
        this.$notify({
          title: "error",
          message: "获取单条数据失败",
          type: "success",
        });
        return;
      }
      this.temp = {
        content: res.data[0].content,
        Marks: res.data[0].Marks,
        Disciplinetype: res.data[0].Disciplinetype,
        expel: res.data[0].expel,
        remark: res.data[0].remark,
      };
      this.dialogStatus = "update";
      this.dialogFormVisible = true;
      this.$nextTick(() => {
        this.$refs["dataForm"].clearValidate();
      });
    },

    updateData() {
      this.$refs["dataForm"].validate(async (valid) => {
        if (valid) {
          if (this.temp.expel == true) {
            this.temp.Marks = "";
          }
          const res = await UpdateSubtractMarks(this.editid, this.temp);
          if (res) {
            this.GetSubtractMarks();
            this.dialogFormVisible = false;
            this.$notify({
              title: "Success",
              message: "修改数据成功",
              type: "success",
            });
          }
        }
      });
    },

    async handleDelete(row) {
      const res = await DeleteSubtractMarks(row._id);
      if (res.code == 200) {
        this.GetSubtractMarks();
        this.$notify({
          title: "Success",
          message: "删除成功",
          type: "success",
        });
      }
    },

    // 监听 pagesize 改变的事件
    handleSizeChange(newSize) {
      this.queryInfo.page_size = newSize;
      this.GetSubtractMarks();
    },

    // 监听 页码值 改变的事件
    handleCurrentChange(newPage) {
      this.queryInfo.page = newPage;
      this.GetSubtractMarks();
    },

    handleDownload() {
      this.downloadLoading = true;
      import("@/vendor/Export2Excel").then((excel) => {
        const tHeader = [
          "扣分类型",
          "扣分原因",
          "分数",
          "是否构成开除",
          "备注",
          "添加时间",
          "修改时间",
        ];
        const filterVal = [
          "Disciplinetype",
          "content",
          "Marks",
          "expel",
          "remark",
          "create_data",
          "update_data",
        ];
        const data = this.formatJson(filterVal);
        excel.export_json_to_excel({
          header: tHeader,
          data,
          filename: "SubtractMarks-list",
        });
        this.downloadLoading = false;
      });
    },

    formatJson(filterVal) {
      return this.SubtractMarkslist.map((v) =>
        filterVal.map((j) => {
          if (j === "timestamp") {
            return parseTime(v[j]);
          } else {
            return v[j];
          }
        })
      );
    },
  },
};
</script>

<style scoped lang="scss">
.organization {
  .item {
    line-height: 40px;
    padding-right: 250px;
    border-bottom: 1px solid black;
    .content {
      padding-left: 100px;
    }
  }
}
.xiang {
  margin-top: 20px;
}
.el-timeline {
  margin-top: 40px;
}
</style>
