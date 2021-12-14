import {
    GetAdminUser,
} from "network/api/adminuser";
import { getFilterRoleList } from "network/api/role";
import { getAllDepartment } from "network/api/department";
export const AdminUserlMixin = {
    data: function() {
        return {
            queryInfo: {
                query: "",
                // 当前的页数
                pagenum: 1,
                // 当前每页显示多少条数据
                pagesize: 5,
            },
            total: 0,

            roleOptions: [{
                label: "请先选择部门",
                value: 0,
                disabled: true,
            }, ],
        }
    },
    methods: {
        //获取教职工列表
        async getUserList() {
            const params = {
                page: this.queryInfo.pagenum,
                page_size: this.queryInfo.pagesize,
            };
            const result = await GetAdminUser(params);
            if (!result) {
                return this.$message.error("获取用户列表失败！");
            }
            this.userlist = result.data;
            this.total = result.count; //数据总条数
            this.queryInfo.pagenum = result.current_page; //当前的页码
            //result.total_page //总页数
            this.pagesize = 5; //每页显示的条数
            this.getunfold()
        },
        //表格展开获取部门和角色
        getunfold() {
            this.userlist.forEach(async(item, index) => {
                let obj = {};
                obj.zname = item.first_name + item.last_name;
                const roles = await getFilterRoleList(
                    "role_ids",
                    JSON.stringify(item.Role)
                );
                const departmentList = [];
                const roleList = [];
                roles.forEach((item) => {
                    if (!departmentList.includes(item.department)) {
                        departmentList.push(item.department);
                        //筛选这个部门的角色信息
                        let departRole = roles.filter((role) => {
                            return role.department == item.department;
                        });
                        roleList.push(departRole);
                    }
                });
                obj.zroleList = roleList;
                obj.zdepartmentList = departmentList;
                this.userlist[index].unfold = obj;
            })
        },

        //获取部门信息
        async getDepartmentList() {
            const departments = await getAllDepartment();
            if (departments) {
                departments.forEach((item) => {
                    this.departmentOptions.push({
                        value: item.id,
                        label: item.name,
                    });
                });
            }
        },
    }
}