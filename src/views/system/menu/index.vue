<template>
  <a-card style="margin: unset">
    <a-row :gutter="12">
      <a-col :span="6">
        <a-input-search style="margin-bottom: 8px" placeholder="Search" size="small" @change="onChange" />
        <a-tree
          :tree-data="treeData"
          :replaceFields="{children:'children', title:'label', key:'pk' }"
          :defaultExpandAll="defaultExpandAll"
          :expanded-keys="expandedKeys"
          :auto-expand-parent="autoExpandParent"
          :selectedKeys.sync="selectKeys"
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
      </a-col>
      <a-col :span="18">

        <a-tabs default-active-key="1" @change="callback">
          <a-tab-pane key="1" tab="Tab 1">
            <vxe-form
              ref="xForm"
              size="small"
              :data="formData"
              title-width="120"
              title-align="right"
              @submit="searchEvent"
              @reset="searchEvent">
              <vxe-form-item
                field="name"
                title="AInput"
                span="8"
                :title-prefix="{ message: '帮助信息！！！', icon: 'fa fa-exclamation-circle' }"
                :item-render="{name: 'AInput', props: {size:'small'}}"></vxe-form-item>
              <vxe-form-item
                field="role"
                title="AAutoComplete"
                span="8"
                :item-render="{name: 'AAutoComplete', props: ACProps, events: {search: roleSearchEvent}}"></vxe-form-item>
              <vxe-form-item
                field="age"
                title="AInputNumber"
                span="8"
                :item-render="{name: 'AInputNumber'}"></vxe-form-item>
              <vxe-form-item
                field="sex"
                title="ASelect"
                span="8"
                :item-render="{name: 'ASelect', options: sexList}"></vxe-form-item>
              <vxe-form-item
                field="region"
                title="ACascader"
                span="8"
                :item-render="{name: 'ACascader', props: {options: regionList}}"></vxe-form-item>
              <vxe-form-item
                field="date"
                title="ADatePicker"
                span="8"
                :item-render="{name: 'ADatePicker', props: {type: 'date', format: 'YYYY/MM/DD'}}"></vxe-form-item>
              <vxe-form-item field="flag" title="ASwitch" span="8" folding :item-render="{name: 'ASwitch'}"></vxe-form-item>
              <vxe-form-item field="rate" title="ARate" span="8" folding :item-render="{name: 'ARate'}"></vxe-form-item>
              <vxe-form-item
                field="flag1"
                title="ARadio"
                span="8"
                folding
                :item-render="{name: 'ARadio', options: [{label: '是', value: 'Y'}, {label: '否', value: 'N'}]}"></vxe-form-item>
              <vxe-form-item
                field="checkedList"
                title="ACheckbox"
                span="8"
                folding
                :item-render="{name: 'ACheckbox', options: [{label: '北京', value: 'beijing'}, {label: '深圳', value: 'shenzhen'}, {label: '上海', value: 'shanghai'}]}"
                :visible-method="visibleMethod"></vxe-form-item>
              <vxe-form-item
                span="24"
                align="center"
                collapse-node
                :item-render="{name: 'AButtons', children: [{ content: '查询', props: {type: 'primary', htmlType: 'submit',size:'small'} }, { content: '重置', props: {htmlType: 'reset',size:'small'} }]}"></vxe-form-item>
            </vxe-form>
            <vxe-toolbar custom ref="xToolbar" size="small">
              <template #buttons>
                <a-space>
                  <a-button type="primary" size="small" icon="plus" @click="handleAdd(1)">
                    {{ $t('table.organization.createUnit') }}
                  </a-button>
                  <a-button type="primary" size="small" icon="plus" @click="handleAdd(2)" v-show="deptButton">
                    {{ $t('table.organization.createDepartment') }}
                  </a-button>
                </a-space>
              </template>
            </vxe-toolbar>
            <div style="overflow: hidden;" :style="{ height: tableHeight}">
              <vxe-table
                resizable
                stripe
                border="inner"
                class="mytable-scrollbar"
                show-header-overflow
                show-overflow
                keep-source
                id="xTable-organization"
                :custom-config="{storage: true}"
                highlight-hover-row
                ref="xTable"
                max-height="96%"
                :export-config="{}"
                :print-config="{}"
                :loading="loading"
                :data="tableData"
                :edit-rules="validRules"
                :edit-config="{ trigger: 'click', mode: 'row', showStatus: true }"
              >
                <vxe-table-column type="checkbox" width="60" fixed="left"></vxe-table-column>
                <vxe-table-column type="seq" title="Number" width="80" fixed="left"></vxe-table-column>
                <vxe-table-column field="name" title="AInput" min-width="140"></vxe-table-column>
                <vxe-table-column
                  field="role"
                  title="AAutoComplete"
                  width="160"
                  :edit-render="{ name: 'AAutoComplete', props: ACProps, events: { search: roleSearchEvent } }"
                ></vxe-table-column>
                <vxe-table-column
                  field="age"
                  title="AInputNumber"
                  width="160"
                  :edit-render="{ name: 'AInputNumber', props: { max: 35, min: 18 } }"
                ></vxe-table-column>
                <vxe-table-column
                  field="sex"
                  title="ASelect"
                  width="140"
                  :edit-render="{ name: 'ASelect', options: sexList }"
                ></vxe-table-column>
                <vxe-table-column
                  field="region"
                  title="ACascader"
                  width="200"
                  :edit-render="{ name: 'ACascader', props: { options: regionList } }"
                ></vxe-table-column>
                <vxe-table-column
                  field="date1"
                  title="ADatePicker"
                  width="200"
                  :edit-render="{ name: 'ADatePicker', props: { type: 'date', format: 'YYYY/MM/DD' } }"
                ></vxe-table-column>
                <vxe-table-column
                  field="flag"
                  title="ASwitch"
                  width="100"
                  :cell-render="{ name: 'ASwitch' }"
                ></vxe-table-column>
                <vxe-table-column :title="$t('table.basic-table.basic.action')" width="90" fixed="right">
                  <template #default="{ row }">
                    <a-space>
                      <a-icon type="edit" @click="editRow(row)" />
                      <a-divider type="vertical" />
                      <a-icon type="delete" @click="deleteRow(row)" />
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
          </a-tab-pane>
          <a-tab-pane key="2" tab="Tab 2" force-render>
            Content of Tab Pane 2
          </a-tab-pane>
          <a-tab-pane key="3" tab="Tab 3">
            Content of Tab Pane 3
          </a-tab-pane>
        </a-tabs>
      </a-col>
    </a-row>
  </a-card>
</template>

<script>
import { STable } from '@/components'
import { getOrgTreeSelect } from '@/api/system/oranization'
import publicMixin from '@/utils/public.mixin'

const dataList = []
const generateList = data => {
  console.log('dataList', dataList)
  for (let i = 0; i < data.length; i++) {
    const node = data[i]
    const key = node.pk
    dataList.push({ key, title: node.org_name })
    if (node.children) {
      generateList(node.children)
    }
  }
}

const getParentKey = (key, tree) => {
  let parentKey
  for (let i = 0; i < tree.length; i++) {
    const node = tree[i]
    if (node.children) {
      if (node.children.some(item => item.pk === key)) {
        parentKey = node.pk
      } else if (getParentKey(key, node.children)) {
        parentKey = getParentKey(key, node.children)
      }
    }
  }
  return parentKey
}
export default {
  name: 'Organization',
  components: {
    STable
  },
  data () {
    return {
      treeData: [],
      selectKeys: ['0000'],
      selectedKeys: {},
      expandedKeys: [],
      searchValue: '',
      autoExpandParent: true,
      defaultExpandAll: true,
      openKeys: ['1426074056182206465'],

      // 查询参数
      queryParam: {},

      orgTree: [],
      selectedRowKeys: [],
      selectedRows: [],

      deptButton: false,

      loading: false,
      tableData: [],
      validRules: {
        name: [
          { required: true, message: 'app.body.valid.rName' },
          { min: 3, max: 50, message: '名称长度在 3 到 50 个字符' }
        ],
        sex: [{ required: true, message: '性别必须填写' }]
      },
      restaurants: ['前端', '后端', '开发', '测试'],
      ACProps: {
        dataSource: [],
        size: 'small'
      },
      sexList: [
        { label: '', value: '' },
        { label: '男', value: '1' },
        { label: '女', value: '0' }
      ],
      regionList: [
        {
          label: '北京',
          value: 1,
          children: [
            { value: 3, label: '东城区' },
            { value: 4, label: '西城区' }
          ]
        },
        {
          label: '上海',
          value: 21,
          children: [
            { value: 23, label: '黄浦区' },
            { value: 24, label: '卢湾区' }
          ]
        },
        {
          label: '广东',
          value: 42,
          children: [
            { value: 43, label: '广州市' },
            { value: 67, label: '深圳市' }
          ]
        }
      ],
      sexGroupList: [
        {
          label: '分组1',
          options: [
            {
              label: '男',
              value: '1'
            }
          ]
        },
        {
          label: '分组2',
          options: [
            {
              label: '女',
              value: '0'
            }
          ]
        }
      ],
      advanced: false,
      toggleAdvanced: false,
      tablePage: {
        currentPage: 1,
        pageSize: 10,
        totalResult: 0
      },
      formData: {
        name: '',
        role: '',
        sex: null,
        age: null,
        region: [],
        date: null,
        flag: false,
        rate: 0,
        flag1: '',
        checkedList: []
      }
    }
  },
  created () {
    getOrgTreeSelect().then(res => {
      generateList(res)
      this.treeData = res
    })
  },
  mounted () {
    this.findList()
    this.tableHeight = (document.body.clientHeight - 64 - this.$refs.xToolbar.$vnode.elm.offsetHeight - this.$refs.xForm.$vnode.context.$vnode.elm.offsetHeight - 72) + 'px'

    this.$nextTick(() => {
      // 手动将表格和工具栏进行关联
      this.$refs.xTable.connect(this.$refs.xToolbar)
    })
  },
  mixins: [publicMixin],
  computed: {
    columns () {
      const columns = [
        {
          title: '#',
          scopedSlots: { customRender: 'serial' }
        },
        {
          title: '规则编号',
          dataIndex: 'no'
        },
        {
          title: this.$t('table.basic-table.basic.description'),
          dataIndex: 'description',
          scopedSlots: { customRender: 'description' }
        },
        {
          title: '服务调用次数',
          dataIndex: 'callNo',
          sorter: true,
          needTotal: true,
          customRender: text => text + ' 次'
        },
        {
          title: this.$t('table.basic-table.basic.status'),
          dataIndex: 'status',
          scopedSlots: { customRender: 'status' }
        },
        {
          title: this.$t('table.basic-table.basic.updateTime'),
          dataIndex: 'updatedAt',
          sorter: true
        },
        {
          title: this.$t('table.basic-table.basic.action'),
          dataIndex: 'action',
          width: '150px',
          scopedSlots: { customRender: 'action' }
        }
      ]
      return columns
    }
  },
  methods: {
    onExpand (expandedKeys) {
      this.expandedKeys = expandedKeys
      this.autoExpandParent = false
    },
    onChange (e) {
      const value = e.target.value
      const expandedKeys = dataList
        .map(item => {
          console.log('item', item)
          if (item.title.indexOf(value) > -1) {
            return getParentKey(item.key, this.treeData)
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
      if (this.selectedKeys.type !== 0) {
        this.deptButton = true
      }
    },
    editRow (row) {
      console.log(row)
    },
    deleteRow (row) {
      console.log(row)
    },
    handleOk () {
      this.confirmLoading = true
    },
    handleCancel () {
    },
    handleAdd (type) {
      console.log('handleAdd', this.selectedKeys)
      if (JSON.stringify(this.selectedKeys) === '{}') {
        this.$message.info('请选择单位或者部门')
      } else {
        // this.$layer.iframe({
        //   content: {
        //     content: CreateOrg,
        //     parent: this,
        //     data: { iframeData: this.selectedKeys, type: type }
        //   },
        //   area: ['600px', '350px'],
        //   title: type === 1 ? '单位' : '部门',
        //   maxmin: false,
        //   shade: false,
        //   shadeClose: false,
        //   cancel: () => {
        //     // 关闭弹窗事件
        //   }
        // })
      }
    },
    onSelectChange (selectedRowKeys, selectedRows) {
      this.selectedRowKeys = selectedRowKeys
      this.selectedRows = selectedRows
    },
    findList () {
      this.loading = true
      setTimeout(() => {
        this.tableData = [
          {
            id: 10001,
            name: 'Test1',
            nickname: 'T1',
            role: 'Develop',
            sex: '0',
            sex1: [],
            region: [],
            age: 28,
            date: '',
            date1: '',
            date2: '',
            date3: '',
            date4: [],
            date5: '',
            date7: '',
            color1: '',
            tree1: '',
            tree2: [],
            rate: 5,
            rate1: 59,
            flag: false,
            address: 'Shenzhen'
          },
          {
            id: 10002,
            name: 'Test2',
            nickname: 'T2',
            role: 'Test',
            sex: '1',
            sex1: [],
            region: [],
            age: 22,
            date: '',
            date1: '',
            date2: '',
            date3: '',
            date4: [],
            date5: '',
            date7: '',
            color1: '',
            tree1: '',
            tree2: [],
            rate: 2,
            rate1: 22,
            flag: false,
            address: 'Guangzhou'
          },
          {
            id: 10003,
            name: 'Test3',
            nickname: 'T3',
            role: 'PM',
            sex: '0',
            sex1: [],
            region: [],
            age: 32,
            date: '',
            date1: '',
            date2: '',
            date3: '',
            date4: [],
            date5: '',
            date7: '',
            color1: '',
            tree1: '',
            tree2: [],
            rate: 3,
            rate1: 12,
            flag: false,
            address: 'Shanghai'
          },
          {
            id: 10004,
            name: 'Test4',
            nickname: 'T4',
            role: 'Designer',
            sex: '0',
            sex1: ['1', '0'],
            region: [],
            age: 23,
            date: '',
            date1: '',
            date2: '',
            date3: '',
            date4: [],
            date5: '',
            color1: '',
            tree1: '',
            tree2: [],
            date7: '',
            rate: 33,
            rate1: 4,
            flag: true,
            address: 'Shenzhen'
          },
          {
            id: 10005,
            name: 'Test5',
            nickname: 'T5',
            role: 'Develop',
            sex: '0',
            sex1: ['1', '0'],
            region: [],
            age: 30,
            date: '',
            date1: '',
            date2: '',
            date3: '',
            date4: [],
            date5: '',
            color1: '',
            tree1: '',
            tree2: [],
            date7: '',
            rate: 0,
            rate1: 15,
            flag: true,
            address: 'Shanghai'
          },
          {
            id: 10006,
            name: 'Test6',
            nickname: 'T6',
            role: 'Designer',
            sex: '0',
            sex1: [],
            region: [],
            age: 21,
            date: '',
            date1: '',
            date2: '',
            date3: '',
            date4: [],
            date5: '',
            date7: '',
            color1: '',
            tree1: '',
            tree2: [],
            rate: 3,
            rate1: 73,
            flag: false,
            address: 'Shenzhen'
          },
          {
            id: 10007,
            name: 'Test7',
            nickname: 'T7',
            role: 'Test',
            sex: '1',
            sex1: ['1'],
            region: [],
            age: 29,
            date: '',
            date1: '',
            date2: '',
            date3: '',
            date4: [],
            date5: '',
            date7: '',
            color1: '',
            tree1: '',
            tree2: [],
            rate: 0,
            rate1: 0,
            flag: true,
            address: 'Guangzhou'
          },
          {
            id: 10008,
            name: 'Test8',
            nickname: 'T8',
            role: 'Develop',
            sex: '1',
            sex1: [],
            region: [],
            age: 35,
            date: '',
            date1: '',
            date2: '',
            date3: '',
            date4: [],
            date5: '',
            date7: '',
            color1: '',
            tree1: '',
            tree2: [],
            rate: 2,
            rate1: 14,
            flag: false,
            address: 'Shenzhen'
          },
          {
            id: 10009,
            name: 'Test9',
            nickname: 'T9',
            role: 'Test',
            sex: '1',
            sex1: ['0'],
            region: [],
            age: 24,
            date: '',
            date1: '',
            date2: '',
            date3: '',
            date4: [],
            date5: '',
            date7: '',
            color1: '',
            tree1: '',
            tree2: [],
            rate: 3,
            rate1: 52,
            flag: false,
            address: 'Shenzhen'
          },
          {
            id: 100010,
            name: 'Test10',
            nickname: 'T10',
            role: 'Develop',
            sex: '1',
            sex1: [],
            region: [],
            age: 20,
            date: '',
            date1: '',
            date2: '',
            date3: '',
            date4: [],
            date5: '',
            date7: '',
            color1: '',
            tree1: '',
            tree2: [],
            rate: 4,
            rate1: 83,
            flag: false,
            address: 'Guangzhou'
          }
        ]
        this.tablePage.totalResult = 140
        this.loading = false
      }, 300)
    },
    insertEvent () {
      const record = {
        role: '',
        age: 18,
        region: [],
        flag: false,
        rate: 2
      }
      this.$refs.xTable.insert(record).then(({ row }) => this.$refs.xTable.setActiveRow(row))
    },
    saveEvent () {
      const { insertRecords, removeRecords, updateRecords } = this.$refs.xTable.getRecordset()
      if (insertRecords.length || removeRecords.length || updateRecords.length) {
        this.$message.success('保存成功！')
        this.searchEvent()
      } else {
        this.$message.warning('数据未改动！')
      }
    },
    vaildEvent () {
      this.$refs.xTable.validate(errMap => {
        if (errMap) {
          this.$XModal.message({ status: 'error', message: '校验不通过！' })
        } else {
          this.$XModal.message({ status: 'success', message: '校验成功！' })
        }
      })
    },
    dropdownMenuEvent (name) {
      switch (name) {
        case 'remove': {
          const selectRecords = this.$refs.xTable.getCheckboxRecords()
          if (selectRecords.length) {
            this.$refs.xTable.removeCheckboxRow()
          } else {
            this.$message.warning('请至少选择一条数据！')
          }
          break
        }
        case 'export': {
          this.$refs.xTable.exportData()
          break
        }
      }
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
    },
    visibleMethod ({ data }) {
      return data.flag1 === 'Y'
    },
    roleSearchEvent ({ row }, value) {
      this.ACProps.dataSource = this.restaurants.filter(
        option => option.toUpperCase().indexOf((value || '').toUpperCase()) !== -1
      )
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
