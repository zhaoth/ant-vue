<template>
  <a-card title="组织管理" style="margin: unset">
    <a slot="extra">
      <a-space>
        <a-button type="primary" size="small" icon="plus" @click="handleAdd(1)">
          {{ $t('table.organization.createUnit') }}
        </a-button>
        <a-button type="primary" size="small" icon="plus" @click="handleAdd(2)" v-show="deptButton">
          {{ $t('table.organization.createDepartment') }}
        </a-button>
      </a-space>
    </a>
    <a-row :gutter="12">
      <a-col :span="6">
        <a-input-search style="margin-bottom: 8px" placeholder="Search" size="small" @change="onChange" />
        <a-spin size="small" :spinning="spinning">
          <a-tree
            v-if="treeData.length>0"
            :tree-data="treeData"
            :replaceFields="{children:'children', title:'label', key:'pk' }"
            :auto-expand-parent="autoExpandParent"
            :expanded-keys="expandedKeys"
            @expand="onExpand"
            @select="onSelect"
            showLine>
            <template slot="title" slot-scope="{ title }">
              <span v-if="title.indexOf(searchValue) > -1">
                {{ title.substr(0, title.indexOf(searchValue)) }}
                <span style="color: #f50">{{ searchValue }}</span>
                {{ title.substr(title.indexOf(searchValue) + searchValue.length) }}
              </span>
              <span v-else>{{ title }}</span>
            </template>
          </a-tree>
        </a-spin>
      </a-col>
      <a-col :span="18">
        <vxe-form
          ref="xForm"
          size="small"
          :data="formData"
          title-width="120"
          title-align="right"
          @submit="searchEvent"
          @reset="searchEvent">
          <vxe-form-item
            field="code"
            title="机构编码"
            span="8"
            :title-prefix="{ message: '机构编码', icon: 'fa fa-exclamation-circle' }"
            :item-render="{name: 'AInput', props: {size:'small'}}"></vxe-form-item>
          <vxe-form-item
            field="org_name"
            title="机构名称"
            span="8"
            :title-prefix="{ message: '机构名称', icon: 'fa fa-exclamation-circle' }"
            :item-render="{name: 'AInput', props: {size:'small'}}"></vxe-form-item>
          <vxe-form-item
            span="8"
            align="right"
            :item-render="{name: 'AButtons', children: [{ content: '查询', props: {type: 'primary',size:'small',icon:'search'},events:{click:onSubmit}}, { content: '重置', props: {htmlType: 'reset',size:'small',icon:'reload'} }]}"></vxe-form-item>
        </vxe-form>

        <vxe-toolbar custom ref="xToolbar" size="small">

        </vxe-toolbar>

        <div style="overflow: hidden;" :style="{ height: tableHeight}">
          <vxe-table
            resizable
            stripe
            size="small"
            border
            class="mytable-scrollbar"
            show-header-overflow
            show-overflow
            keep-source
            id="xTable-organization"
            :custom-config="{storage: true}"
            highlight-hover-row
            ref="xTable"
            max-height="85%"
            :export-config="{}"
            :print-config="{}"
            :loading="loading"
            :data="tableData"
          >
            <vxe-table-column type="seq" title="编号" width="50" fixed="left"></vxe-table-column>
            <vxe-table-column field="org_name" title="机构名称" min-width="140"></vxe-table-column>
            <vxe-table-column field="code" title="机构编码" min-width="140"></vxe-table-column>
            <vxe-table-column field="org_type" title="机构类型" :formatter="formatType" min-width="140"></vxe-table-column>
            <vxe-table-column :title="$t('table.basic-table.basic.action')" width="110" fixed="right">
              <template #default="{ row }">
                <a-space>
                  <div style="color: #1890ff;font-size: 12px" @click="editRow(row)" >编辑</div>
                  <a-divider type="vertical" />
                  <div style="color: #ff4d4f;font-size: 12px" @click="deleteRow(row)" >删除</div>
                </a-space>
              </template>
            </vxe-table-column>
          </vxe-table>
          <a-pagination
            class="mt3"
            size="small"
            @showSizeChange="handleSizeChange"
            @change="handleCurrentChange"
            v-model="tablePage.currentPage"
            :page-size-options="['5', '10', '15', '20', '50', '100', '150', '200']"
            :page-size="tablePage.pageSize"
            :total="tablePage.totalResult"
            showSizeChanger
          >
          </a-pagination>
        </div>
      </a-col>
    </a-row>
    <a-modal
      :title="title"
      :visible="visible"
      :destroyOnClose="true"
      @ok="handleOk"
      @cancel="handleCancel"
    >
      <form-create v-model="fApi" :rule="rule"></form-create>
    </a-modal>
  </a-card>

</template>

<script>
import { STable } from '@/components'
import { deleteOrg, getOrgTreeSelect, getPage, saveOrg } from '@/api/system/oranization'
import publicMixin from '@/utils/public.mixin'

export default {
  name: 'Organization',
  components: {
    STable
  },
  data () {
    return {
      // 表单
      fApi: {},
      rule: [
        {
          type: 'hidden',
          field: 'org_type',
          value: ''
        },
        {
          type: 'hidden',
          field: 'pk',
          value: ''
        },
        {
          type: 'hidden',
          field: 'pk_parent',
          value: ''
        },
        {
          type: 'input',
          field: 'org_name',
          title: '名称',
          props: {
            align: 'left',
            type: 'text'
          },
          col: {
            span: 12,
            labelWidth: 200,
            xs: 24
          },
          validate: [
            { required: true, message: '请输入名称', trigger: 'blur' }
          ]
        },
        {
          type: 'input',
          field: 'code',
          title: '编码',
          props: {
            align: 'left',
            type: 'text'
          },
          validate: [
            { required: true, message: '请输入编码', trigger: 'blur' },
            { min: 3, message: '最少输入3位', trigger: 'blur' },
            { max: 10, message: '最多输入10位', trigger: 'blur' }
          ]
        },
        {
          type: 'input',
          field: 'sort_num',
          title: '排序',
          props: {
            align: 'left',
            type: 'number'
          },
          validate: [
            { required: true, message: '请输入排序编码', trigger: 'blur' }
          ]
        }
      ],
      title: '',
      type: '1',
      pk: '',
      // 树
      spinning: false,
      treeData: [],
      selectKeys: ['0000'],
      selectedKeys: {},
      expandedKeys: ['1000000'],
      searchValue: '',
      autoExpandParent: true,
      dataList: [],
      orgTree: [],
      selectedRowKeys: [],
      selectedRows: [],
      // 表格
      queryParam: {},
      visible: false,
      deptButton: false,
      loading: false,
      tableData: [],
      tablePage: {
        currentPage: 1,
        pageSize: 10,
        totalResult: 0
      },
      formData: {
        org_name: '',
        code: ''
      }
    }
  },
  created () {
    this.getTree()
  },
  mounted () {
    this.tableHeight = (document.body.clientHeight - 44 - this.$refs.xToolbar.$vnode.elm.offsetHeight - this.$refs.xForm.$vnode.context.$vnode.elm.offsetHeight) + 'px'

    this.$nextTick(() => {
      // 手动将表格和工具栏进行关联
      this.$refs.xTable.connect(this.$refs.xToolbar)
    })
  },
  mixins: [publicMixin],
  watch: {
    treeData: {
      handler (newValue, oldValue) {
        for (let i = 0; i < newValue.length; i++) {
          if (oldValue[i] !== newValue[i]) {
            console.log(newValue)
          }
        }
      },
      deep: true
    }
  },
  methods: {
    handleOk (e) {
      const parameter = {}
      this.fApi.submit((formData, fApi) => {
        console.log('formData', formData)
        if (this.pk !== '') {
          Object.assign(parameter, formData)
          parameter.org_type = this.type
          parameter.pk_parent = this.pk
        } else {
          Object.assign(parameter, formData)
        }
        saveOrg(parameter).then(res => {
          this.visible = false
          this.findList()
          this.getTree()
          this.$message.success('保存成功')
        })
      })
    },
    handleCancel (e) {
      this.visible = false
    },
    getTree () {
      getOrgTreeSelect().then(res => {
        this.treeData = res
        this.$set(this.treeData, 'b', '')
        this.spinning = false
        this.generateList(res)
      }).catch(err => {
        console.log(err)
        this.spinning = false
      })
    },
    getParentKey (key, tree) {
      let parentKey
      for (let i = 0; i < tree.length; i++) {
        const node = tree[i]
        if (node.children) {
          if (node.children.some(item => item.pk === key)) {
            parentKey = node.pk
          } else if (this.getParentKey(key, node.children)) {
            parentKey = this.getParentKey(key, node.children)
          }
        }
      }
      return parentKey
    },
    generateList (data) {
      console.log('dataList', this.dataList)
      for (let i = 0; i < data.length; i++) {
        const node = data[i]
        const key = node.pk
        this.dataList.push({ key, title: node.label })
        if (node.children) {
          this.generateList(node.children)
        }
      }
    },
    formatType ({ cellValue, row, column }) {
      return cellValue === '0' ? '集团' : cellValue === '1' ? '单位' : '部门'
    },
    onSubmit () {
      this.findList(false)
    },
    onExpand (expandedKeys) {
      this.expandedKeys = expandedKeys
      this.autoExpandParent = false
    },
    onChange (e) {
      const value = e.target.value
      const expandedKeys = this.dataList
        .map(item => {
          if (item.title.indexOf(value) > -1) {
            return this.getParentKey(item.key, this.treeData)
          }
          return null
        })
        .filter((item, i, self) => item && self.indexOf(item) === i)
      console.log('expandedKeys', expandedKeys)
      Object.assign(this, {
        expandedKeys,
        searchValue: value,
        autoExpandParent: true
      })
    },
    onSelect (selectedKeys, info) {
      this.selectedKeys = info.selectedNodes[0].data.props
      this.pk = this.selectedKeys.pk
      this.tablePage.currentPage = 1
      this.tablePage.totalResult = 0
      this.findList()
      if (this.selectedKeys.type !== '0') {
        this.deptButton = true
      } else {
        this.deptButton = false
      }
    },
    editRow (row) {
      this.title = '编辑'
      this.pk = ''
      this.visible = true
      console.log('row', row)
      setTimeout(() => {
        this.fApi.resetFields()
        this.fApi.setValue(row)
      }, 500)
    },
    deleteRow (row) {
      const _self = this
      console.log('deleteRow', row)
      this.$confirm({
        title: 'Do you want to delete these items?',
        content: '',
        onOk () {
          const param = {
            pk: row.pk
          }
          deleteOrg(param).then((res) => {
            _self.findList()
            _self.getTree()
            _self.$message.success('删除成功')
          })
        },
        onCancel () {
        }
      })
    },
    handleAdd (type) {
      this.title = '新增'
      this.type = type
      setTimeout(() => {
        this.fApi.resetFields()
      }, 500)
      if (JSON.stringify(this.selectedKeys) === '{}') {
        this.$message.warning('请选择单位或者部门')
      } else {
        this.visible = true
      }
    },
    findList (pkFlag = true) {
      this.loading = true
      const param = {}
      if (pkFlag) {
        param.pk = this.selectedKeys.pk
      } else {
        param.pk = ''
      }
      param.size = this.tablePage.pageSize
      param.current = this.tablePage.currentPage
      param.org_name = this.formData.org_name
      param.code = this.formData.code
      getPage(param).then((res) => {
        console.log('findlist', res)
        this.tablePage.totalResult = res.total
        this.tableData = res.records
        console.log('this.tableData', this.tableData)
        this.loading = false
      }).catch(() => {
        this.loading = false
      })
    },
    searchEvent () {
      this.tablePage.currentPage = 1
      this.findList()
    },
    handleSizeChange (current, size) {
      this.tablePage.pageSize = size
      this.searchEvent()
    },
    handleCurrentChange (page, pageSize) {
      this.tablePage.currentPage = page
      this.findList()
    }
  }
}
</script>

<style lang='less'>
.custom-tree {
  /deep/ .ant-menu-item-group-title {
    position: relative;

    &:hover {
      .btn {
        display: block;
      }
    }
  }

  /deep/ .ant-menu-item {
    &:hover {
      .btn {
        display: block;
      }
    }
  }

  /deep/ .btn {
    display: none;
    position: absolute;
    top: 0;
    right: 10px;
    width: 20px;
    height: 40px;
    line-height: 40px;
    z-index: 1050;

    &:hover {
      transform: scale(1.2);
      transition: 0.5s all;
    }
  }
}
</style>
