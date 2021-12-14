<template>
  <div>
    <!-- 卡片视图区域 -->
    <el-card>
      <!-- 搜索与添加区域 -->
      <el-row :gutter="20">
        <div class="search">
          <el-col :span="3">
            <el-input
              placeholder="请输入名称"
              v-model="queryInfo.query.name"
              clearable
              @clear="getClasses"
            ></el-input
          ></el-col>
          <el-col :span="3">
            <el-select
              v-model="queryInfo.query.depar_id"
              placeholder="选择所属学院"
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
              v-model="queryInfo.query.stage"
              placeholder="选择现处阶段"
            >
              <el-option
                v-for="item in stageoptions1"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              >
              </el-option>
            </el-select>
          </el-col>
          <el-col :span="3">
            <el-input
              placeholder="请输入宿舍号"
              v-model="queryInfo.query.room_number"
              clearable
              @clear="getClasses"
            ></el-input
          ></el-col>
          <!-- 此功能不能使用 -->
          <el-col :span="3">
            <el-input
              placeholder="请输入班级人数"
              v-model="queryInfo.query.sum"
              clearable
              @clear="getClasses"
              disabled
            ></el-input
          ></el-col>
          <el-col :span="1">
            <el-button
              type="primary"
              icon="el-icon-search"
              circle
              @click="getClasses"
            ></el-button>
          </el-col>
          <el-col :span="2">
            <el-button type="danger" @click="clearsearch">重置</el-button>
          </el-col>
        </div>

        <el-col :span="4">
          <el-button type="primary" @click="addClasses1">添加班级</el-button>
        </el-col>
      </el-row>
    </el-card>
    <!-- 班级列表区域 -->
    <el-table
      ref="multipleTable"
      style="margin-top: 40px"
      :data="classlist"
      border
      stripe
    >
      <el-table-column type="selection" width="55"> </el-table-column>
      <el-table-column type="index"></el-table-column>
      <el-table-column label="班级名称" prop="name"></el-table-column>
      <el-table-column label="所属学院" prop="depar_id">
        <template slot-scope="scope">
          <span>{{ scope.row.depar_id.name }}</span>
        </template>
      </el-table-column>
      <el-table-column label="现处阶段" prop="stage"></el-table-column>
      <el-table-column label="班级人数" prop="number"> </el-table-column>
      <el-table-column label="操作">
        <template slot-scope="scope">
          <!-- 修改按钮 -->
          <el-button
            type="primary"
            icon="el-icon-edit"
            size="mini"
            @click="showEditDialog(scope.row._id)"
          ></el-button>
          <!-- 删除按钮 -->
          <el-button
            type="danger"
            icon="el-icon-delete"
            size="mini"
            @click="removeClassById(scope.row._id)"
          ></el-button>
        </template>
      </el-table-column>
    </el-table>

    <!-- 分页区域 -->
    <el-pagination
      style="margin-top: 20px"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="queryInfo.pagenum"
      :page-sizes="[5, 10, 15]"
      :page-size="queryInfo.pagesize"
      layout="total, sizes, prev, pager, next, jumper"
      :total="total"
    >
    </el-pagination>

    <!-- 添加班级的对话框 -->
    <el-dialog
      title="添加班级"
      :visible.sync="addDialogVisible"
      width="50%"
      @close="addDialogClosed"
    >
      <!-- 内容主体区域 -->
      <el-form
        :model="addForm"
        :rules="addFormRules"
        ref="addFormRef"
        label-width="100px"
      >
        <el-form-item label="班级" prop="name">
          <el-input v-model="addForm.name"></el-input>
        </el-form-item>
        <el-form-item label="所属学院" prop="depar_id">
          <el-select v-model="addForm.depar_id" placeholder="选择所属学院">
            <el-option
              v-for="item in deparoptions"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            >
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="现处阶段" prop="stage">
          <el-select v-model="addForm.stage" placeholder="选择现处阶段">
            <el-option
              v-for="item in stageoptions"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            >
            </el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <!-- 底部区域 -->
      <span slot="footer" class="dialog-footer">
        <el-button @click="addDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addClasses">确 定</el-button>
      </span>
    </el-dialog>

    <!-- 修改班级的对话框 -->
    <el-dialog
      title="修改班级信息"
      :visible.sync="editDialogVisible"
      width="50%"
      @close="editDialogClosed"
    >
      <!-- 内容主体区域 -->
      <el-form
        :model="editForm"
        :rules="editFormRules"
        ref="editFormRef"
        label-width="100px"
      >
        <el-form-item label="班级" prop="name">
          <el-input v-model="editForm.name"></el-input>
        </el-form-item>
        <el-form-item label="所属学院" prop="depar_id">
          <el-select v-model="editForm.depar_id" placeholder="选择所属学院">
            <el-option
              v-for="item in deparoptions"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            >
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="现处阶段" prop="stage">
          <el-select v-model="editForm.stage" placeholder="选择现处阶段">
            <el-option
              v-for="item in stageoptions"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            >
            </el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="editClasses">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import {
  getClasses,
  addClasses,
  removeClasses,
  getClassesItem,
  editClassesItem,
} from "network/nodeapi/classes";

import { getallDepartment } from "network/nodeapi/department";
export default {
  name: "departmentlist",
  data() {
    return {
      //添加学生对话框
      addDialogVisible: false,

      // 获取用户列表的参数对象
      queryInfo: {
        query: {
          name: "",
          depar_id: "",
          stage: "",
          room_number: "",
          sum: "",
        },
        // 当前的页数
        pagenum: 1,
        // 当前每页显示多少条数据
        pagesize: 5,
      },
      classlist: [],
      total: 0,

      // 添加班级的表单数据
      addForm: {
        name: "",
        depar_id: null,
        stage: "",
      },
      //所有学院下拉数据
      deparoptions: [{ value: "", label: "请选择学院" }],
      //现处阶段下拉数据
      stageoptions: [
        {
          value: "语文",
          label: "语文",
        },
        {
          value: "数学",
          label: "数学",
        },
        {
          value: "英语",
          label: "英语",
        },
        {
          value: "专基",
          label: "专基",
        },
        {
          value: "专业",
          label: "专业",
        },
        {
          value: "专高",
          label: "专高",
        },
        {
          value: "实训",
          label: "实训",
        },
      ],
      //现处阶段下拉数据  多全部
      stageoptions1: [
        {
          value: "",
          label: "全部",
        },
        {
          value: "语文",
          label: "语文",
        },
        {
          value: "数学",
          label: "数学",
        },
        {
          value: "英语",
          label: "英语",
        },
        {
          value: "专基",
          label: "专基",
        },
        {
          value: "专业",
          label: "专业",
        },
        {
          value: "专高",
          label: "专高",
        },
        {
          value: "实训",
          label: "实训",
        },
      ],
      // 添加、修改表单的验证规则对象
      addFormRules: {
        name: [
          { required: true, message: "请输入班级", trigger: "blur" },
          {
            min: 4,
            max: 5,
            message: "姓名的长度在4~5个字符之间",
            trigger: "blur",
          },
        ],
        depar_id: [{ required: true, message: "请输入学院", trigger: "blur" }],
        stage: [{ required: true, message: "请输入阶段", trigger: "blur" }],
      },
      editFormRules: {
        name: [
          { required: true, message: "请输入班级", trigger: "blur" },
          {
            min: 4,
            max: 5,
            message: "姓名的长度在4~5个字符之间",
            trigger: "blur",
          },
        ],
        depar_id: [{ required: true, message: "请输入学院", trigger: "blur" }],
        stage: [{ required: true, message: "请输入阶段", trigger: "blur" }],
      },
      // 控制修改部门对话框的显示与隐藏
      editDialogVisible: false,
      // 修改的班级信息对象
      editid: null,
      editForm: {
        name: "",
        depar_id: "",
        stage: "",
        room_number: "",
        sum: "",
      },
    };
  },
  async created() {
    await this.getClasses();
    this.getallDepartment();
  },
  methods: {
    //获取所有学院
    async getallDepartment() {
      const res = await getallDepartment();
      const content = res.data;
      this.deparoptions = [{ value: "", label: "请选择学院" }];
      content.forEach((item) => {
        if (item.label == 1) {
          let obj = {};
          console.log(item);
          obj.value = item._id;
          obj.label = item.name;
          this.deparoptions.push(obj);
        }
      });
    },
    //获取班级信息
    async getClasses() {
      const result = await getClasses({
        search: this.queryInfo.query,
        page: this.queryInfo.pagenum,
        page_size: this.queryInfo.pagesize,
      });
      if (result) {
        this.classlist = result.data; //列表中展示的数据内容
        this.total = result.count; //数据总条数
        this.addDialogVisible = false;
      } else {
        return this.$message.error("获取班级列表失败！");
      }
    },
    // 监听添加学生对话框的关闭事件
    addDialogClosed() {
      this.$refs.addFormRef.resetFields();
    },
    //展示添加数据对话框展示
    addClasses1() {
      this.addDialogVisible = true;
    },
    // 点击按钮，添加新学生用户
    addClasses() {
      this.$refs.addFormRef.validate(async (valid) => {
        if (!valid) return;
        // 可以发起添加用户的网络请求
        const res = await addClasses(this.addForm);
        if (res) {
          this.$message.success("添加班级成功！");
          // 重新获取用户列表数据
          this.getClasses();
        } else {
          this.$message.error("添加班级失败！");
        }

        // 隐藏添加用户的对话框
        this.addDialogVisible = false;
      });
    },

    // 监听 pagesize 改变的事件
    handleSizeChange(newSize) {
      this.queryInfo.pagesize = newSize;
      this.getClasses();
    },
    // 监听 页码值 改变的事件
    handleCurrentChange(newPage) {
      this.queryInfo.pagenum = newPage;
      this.getClasses();
    },
    // 展示编辑学生信息的对话框
    async showEditDialog(id) {
      this.editid = id;
      const result = await getClassesItem(id);
      console.log(result);
      const { data } = result;
      if (result) {
        this.editForm = data[0];
        this.editDialogVisible = true;
      }
    },
    // 监听修改学生对话框的关闭事件
    editDialogClosed() {
      this.$refs.editFormRef.resetFields();
    },
    // 修改学生信息并提交
    editClasses() {
      this.$refs.editFormRef.validate(async (valid) => {
        if (!valid) return;
        // 发起修改用户信息的数据请求
        const result = await editClassesItem(this.editid, this.editForm);
        console.log(result, 222);
        if (result) {
          // 关闭对话框
          this.editDialogVisible = false;
          // 刷新数据列表
          this.getClasses();
          // 提示修改成功
          this.$message.success("更新班级信息成功！");
        }
      });
    },
    // 根据Id删除对应的用户信息
    async removeClassById(id) {
      // 弹框询问用户是否删除数据
      const confirmResult = await this.$confirm(
        "此操作将永久删除该班级, 是否继续?",
        "提示",
        {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
        }
      ).catch((err) => err);

      // 如果用户确认删除，则返回值为字符串 confirm
      // 如果用户取消了删除，则返回值为字符串 cancel
      // console.log(confirmResult)
      if (confirmResult !== "confirm") {
        return this.$message.info("已取消删除");
      }
      removeClasses(id).then((value) => {
        console.log(value);
        this.$message.success("删除用户成功！");
        this.getClasses();
      });
    },

    //清空搜索的内容
    clearsearch() {
      this.queryInfo.query = {
        name: "",
        market: "",
        cls: "",
        sex: "",
        dormnumber: "",
      };
    },
  },
};
</script>

<style lang="less" scoped></style>
