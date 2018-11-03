<template>
    <el-card class="box-card">
    
    
      <!-- 头部 -->
        <el-breadcrumb separator="/">
    
            <el-breadcrumb-item>首页</el-breadcrumb-item>
    
            <el-breadcrumb-item>用户管理</el-breadcrumb-item>
    
            <el-breadcrumb-item>用户列表</el-breadcrumb-item>
    
        </el-breadcrumb>
      <!-- 搜索 添加 -->
        <el-row class="searchArea">
    
            <el-col :span='24'>
    
                <el-input placeholder="请输入内容" class="searchInput" clearable v-model="searchVal">
    
                    <el-button slot="append" icon="el-icon-search" @click="checkUser()"></el-button>
    
                </el-input>
    
                <el-button type="warning" @click="showAddUser()">添加用户</el-button>
    
            </el-col>
    
        </el-row>
      <!-- 添加用户 -->

      <el-dialog title="添加用户" :visible.sync="dialogFormVisibleAdd">
        <el-form :model="formData">
          <el-form-item label="用户名" :label-width="formLabelWidth">
            <el-input v-model="formData.username" autocomplete="off"></el-input>
          </el-form-item>
          <el-form-item label="密码" :label-width="formLabelWidth">
             <el-input v-model="formData.password" autocomplete="off"></el-input>
          </el-form-item>
          <el-form-item label="邮箱" :label-width="formLabelWidth">
             <el-input v-model="formData.email" autocomplete="off"></el-input>
          </el-form-item>
          <el-form-item label="电话" :label-width="formLabelWidth">
             <el-input v-model="formData.mobile" autocomplete="off"></el-input>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button  @click="closeAddUser()">取 消</el-button>
          <el-button type="primary" @click="AddUser()">确 定</el-button>
        </div>
      </el-dialog>

     



      <!--  表格 -->
        <el-table :data="list" style="width: 100%" v-loading='loading'>

            <el-table-column type='index' label="#" width="100">
    
            </el-table-column>
    
            <el-table-column prop="username" label="姓名" width="120">
              
            </el-table-column>
    
            <el-table-column prop="email" label="邮箱" width="180">
    
            </el-table-column>
    
            <el-table-column prop="mobile" label="电话" width="150">
    
            </el-table-column>
    
            <el-table-column label="创建日期" width="180">

              <template slot-scope="scope">
                {{scope.row.create_time | formTime}}
              </template>
              
            </el-table-column>
    
            <el-table-column label="用户状态" width="100">

              <template slot-scope="scope">
                <el-switch
                  @change="changeSwitchMgstate(scope.row)"
                  v-model="scope.row.mg_state"
                  active-color="#13ce66"
                  inactive-color="#ff4949">
                </el-switch>   
              </template>

            </el-table-column>
    
            <el-table-column label="操作" width="180">
              <template slot-scope="scope">
                <el-row>
                  <el-button type="primary" icon="el-icon-edit" size='mini' plain circle @click='edituser(scope.row.id)'></el-button>
                  <el-button type="success" icon="el-icon-check" size='mini' plain circle @click='coluser(scope.row)'></el-button>
                  <el-button type="danger" icon="el-icon-delete" size='mini' plain circle @click="deluser(scope.row.id)"></el-button>
                </el-row>   
              </template>
            </el-table-column>
        </el-table>

         <!-- 编辑用户页面 -->
      <el-dialog title="编辑用户" :visible.sync="dialogFormVisibleEdit">
        <el-form :model="formData">
          <el-form-item label="用户名" :label-width="formLabelWidth">
            {{formData.username}}
          </el-form-item>
          <el-form-item label="邮箱" :label-width="formLabelWidth">
             <el-input v-model="formData.email" autocomplete="off"></el-input>
          </el-form-item>
          <el-form-item label="电话" :label-width="formLabelWidth">
             <el-input v-model="formData.mobile" autocomplete="off"></el-input>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button  @click="closeEditUser()">取 消</el-button>
          <el-button type="primary" @click="EditUser()">确 定</el-button>
        </div>
      </el-dialog>
      
      <!-- 分配角色页面 -->
      <el-dialog title="分配角色" :visible.sync="dialogFormVisibleSetrole">
        <el-form :model="formData">
          <el-form-item label="用户名" :label-width="formLabelWidth">
             {{currUserName}} 
          </el-form-item>
          <el-form-item label="角色" :label-width="formLabelWidth">

            <el-select v-model="currRoleId">
              
            <el-option disabled label="请选择" :value="-1">

               </el-option>
                  <!-- 遍历数组 -->
                    <el-option v-for="(item,index) in roles"
                    :label="item.roleName"
                    :key="index"
                    :value="item.id">
                    </el-option> 
                </el-select>
          
          </el-form-item> 
          </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="dialogFormVisibleSetrole = false">取 消</el-button>
                <el-button type="primary" @click="setRole()">确 定</el-button>
            </div>
        </el-dialog>


      <!-- 分页  -->
        <el-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="currentPage"
          :page-sizes="[2, 4, 6, 8]"
          :page-size="pagesize"
          layout="total, sizes, prev, pager, next, jumper"
          :total="total">
        </el-pagination>

    </el-card>
</template>

<script>
export default {
  data() {
    return {
      list: [],
      loading: false,
      // 分页变量
      currentPage: 1,
      total: 0,
      pagesize: 2,
      pagenum: 1,
      //搜索变量
      searchVal: "",
      dialogFormVisibleAdd:false,
      formData:{
        username:'',
        password:'',
        email:'',
        mobile:'',
      },
      currUserName:'',
      currUserId:-1 ,
      currRoleId:-1,
      roles:[],
      formLabelWidth:'140px', 
      dialogFormVisibleEdit:false,
      dialogFormVisibleSetrole:false
    };
  },

  created() {
    this.LoadtableData();
  },

  methods: {
    //分配角色
    async setRole(){
      const res = await this.$http.put(`users/${this.currUserId}/role`,{rid:this.currRoleId})
      console.log(res)

      this.dialogFormVisibleSetrole=false
      this.$message.success(res.data.meta.msg)
      this.currRoleId=-1
    },
    //打开分配角色页面
    async coluser(user){
    
      //打开角色页面给一个属性赋值
      this.currUserId=user.id
      this.currUserName=user.username

      console.log(this.currUserName)
      this.dialogFormVisibleSetrole=true
      const res = await this.$http.get('roles')
      this.roles=res.data.data
      const res2= await this.$http.get(`users/${user.id}`) 
      this.currRoleId=res2.data.data.rid
      console.log(res2)
    },
    //关闭分配角色页面
    // closeColUser(){
    //  this.dialogFormVisibleSetrole=false
    // },
    //编辑用户
    async EditUser(){
      this.dialogFormVisibleEdit=false
      const res = await this.$http.put(`users/${this.formData.id}`,this.formData)
      this.$message.success(res.data.meta.msg);
      console.log(res)
      this.LoadtableData();
    },
    //显示编辑用户页面
    async edituser(userId){
      this.dialogFormVisibleEdit=true
      const res = await this.$http.get(`users/${userId}`)
      this.formData=res.data.data
      console.log(res)
    },
    //关闭编辑页面
    closeEditUser(){
      this.dialogFormVisibleEdit=false,
      this.$message.success('关闭编辑页面');
    },
    //添加用户
    async AddUser(){
      this.dialogFormVisibleAdd=false
      const res = await this.$http.post('users',this.formData)
      console.log(res)
      this.LoadtableData();
      const {meta:{msg,status}}=res.data
      if(status===201){
        this.$message.success(msg)
        this.formData={}
      }
    },
    //关闭添加用户
    closeAddUser(){
       this.dialogFormVisibleAdd=false
       this.$message.success('取消添加用户');
    },
    // 显示添加用户
    showAddUser(){
      this.dialogFormVisibleAdd=true
    },
    //删除用户
    deluser(userId) {
      this.$confirm("此操作将永久删除该文件, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(async () => {
          const res = await this.$http.delete(`users/${userId}`);
          // console.log(res)
          this.$message.success(res.data.meta.msg);
          this.LoadtableData();
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除"
          });
        });
    },
    //改变用户状态
    async changeSwitchMgstate(user) {
      const res = await this.$http.put(
        `users/${user.id}/state/${user.mg_state}`
      );
      console.log(res);
      this.$message.success(res.data.meta.msg);
    },
    //查询用户
    checkUser() {
      this.LoadtableData();
    },
    //返回分页条和页面
    handleSizeChange(val) {
      // console.log(`每页 ${val} 条`);
      this.pagesize = val;
      this.LoadtableData();
    },
    handleCurrentChange(val) {
      // console.log(`当前页: ${val}`);
      this.pagenum = val;
      this.LoadtableData();
    },
    //渲染list
    async LoadtableData() {
      this.loading = true;
      //给请求header添加token
      const AUTH_TOKEN = sessionStorage.getItem("token");

      this.$http.defaults.headers.common["Authorization"] = AUTH_TOKEN;

      const res = await this.$http.get(
        `users?pagenum=${this.pagenum}&pagesize=${this.pagesize}&query=${
          this.searchVal
        }`
      );
      // console.log(res);
      const { meta: { msg, status }, data: { users } } = res.data;
      this.total = res.data.data.total;
      this.loading = false;
      if (status === 200) {
        this.list = users;
        this.pagenum = 1;
      }
    }
  }
};
</script>

<style>
.box-card {
  height: 100%;
}

.searchArea {
  margin-top: 10px;

  margin-bottom: 10px;
}

.searchArea .searchInput {
  width: 350px;
}
</style>
