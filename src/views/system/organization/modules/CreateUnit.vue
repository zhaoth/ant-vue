<template>
  <a-card>
    <form-create v-model="fApi" :rule="rule" :option="option"></form-create>

    <a-divider></a-divider>
    <a-row>
      <a-col :span="8" :offset="16">
        <a-button type="primary" icon="check" plain @click="submit">
          提交
        </a-button>
        <a-button icon="reload" plain @click="reset">
          重置
        </a-button>
      </a-col>
    </a-row>
  </a-card>
</template>

<script>
export default {
  props: {
    layerid: {
      // 自动注入的layerid
      type: String,
      default: ''
    },
    iframeData: {
      // 传递的数据
      type: Object,
      default: () => {
        return {}
      }
    }
  },
  data () {
    return {
      // 实例对象
      fApi: {},
      // 表单生成规则
      rule: [
        {
          type: 'a-row',
          native: true,
          children: [
            {
              type: 'a-col',
              props: {
                span: 12
              },
              children: [
                {
                  type: 'input',
                  title: '类别',
                  field: 'category',
                  value: '单位',
                  disabled: true,
                  props: {
                    type: 'text'
                  },
                  wrap: {
                    labelCol: { span: 6 },
                    wrapperCol: { span: 12 }
                  },
                  validate: [{ required: true, message: '请输入goods_name', trigger: 'blur' }]
                }
              ]
            },
            {
              type: 'a-col',
              props: {
                span: 12
              },
              children: [
                {
                  type: 'input',
                  title: '编号',
                  field: 'number',
                  value: '',
                  props: {
                    type: 'text',
                    placeholder: '请输入编号'
                  },
                  wrap: {
                    labelCol: { span: 6 },
                    wrapperCol: { span: 12 }
                  }
                }
              ]
            }
          ]
        },

        {
          type: 'a-row',
          native: true,
          children: [
            {
              type: 'a-col',
              props: {
                span: 12
              },
              children: [
                {
                  type: 'input',
                  title: '简称',
                  field: 'abbreviation',
                  props: {
                    type: 'text',
                    placeholder: '请输入简称'
                  },
                  wrap: {
                    labelCol: { span: 6 },
                    wrapperCol: { span: 12 }
                  },
                  validate: [{ required: true, message: '请输入简称', trigger: 'blur' }]
                }
              ]
            },
            {
              type: 'a-col',
              props: {
                span: 12
              },
              children: [
                {
                  type: 'input',
                  title: '全称',
                  field: 'fullname',
                  props: {
                    type: 'text',
                    placeholder: '请输入全称'
                  },
                  wrap: {
                    labelCol: { span: 6 },
                    wrapperCol: { span: 12 }
                  },
                  validate: [{ required: true, message: '请输入全称', trigger: 'blur' }]
                }
              ]
            }
          ]
        }
      ]
    }
  },
  created () {},
  methods: {
    submit () {
      const _self = this
      _self.$layer.close(_self.layerid)
      this.fApi.submit((formData, fApi) => {
      })
    },
    reset () {
      this.fApi.resetFields()
    }
  }
}
</script>
<style lang="less" scoped>
// 去form-create自动生成的border，建议单独引入
.ant-card-bordered {
  border: none !important;
}
</style>
