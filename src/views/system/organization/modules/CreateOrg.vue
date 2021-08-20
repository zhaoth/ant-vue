<template>
  <a-card>
    <!--    <form-create v-model="fApi" :rule="rule"></form-create>-->
    <!--    <a-row>-->
    <!--      <a-col :span="8" :offset="16">-->
    <!--        <a-button type="primary" icon="check" plain @click="submit">-->
    <!--          提交-->
    <!--        </a-button>-->
    <!--        <a-button icon="reload" plain @click="reset">-->
    <!--          重置-->
    <!--        </a-button>-->
    <!--      </a-col>-->
    <!--    </a-row>-->
  </a-card>
</template>

<script>

import { saveOrg } from '@/api/system/oranization'

export default {
  props: {
    layerid: {// 自动注入的layerid
      type: String,
      default: ''
    },
    pk: {
      type: String,
      default: ''
    },
    type: {
      type: Number,
      default: 1
    },
    iframeData: {// 传递的数据
      type: Object,
      default: () => {
        return {}
      }
    }
  },
  mounted () {
    this.fApi.setValue(this.iframeData)
  },
  data () {
    return {
      // 实例对象
      fApi: {},
      // 表单生成规则
      rule: [
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
      ]
    }
  },
  methods: {
    submit () {
      const _self = this
      console.log(_self.layerid)

      _self.$layer.close(_self.layerid)
      const parameter = {}
      this.fApi.submit((formData, fApi) => {
        if (this.pk !== '') {
          Object.assign(parameter, formData)
          parameter.org_type = this.type
          parameter.pk_parent = this.pk
        } else {
          Object.assign(parameter, this.iframeData, formData)
        }
        console.log('submit parameter', parameter)
        saveOrg(parameter).then(res => {
          _self.$message.success('保存成功')
        })
      })
    },
    reset () {
      this.fApi.resetFields()
    }
  }
}
</script>
<style scoped>
.ant-card-bordered {
  border: none
}
</style>
