export const options = {
  row: {
    align: 'right'
  },
  // 提交按钮配置,设置submitBtn=false或submitBtn.show=false时不显示按钮
  submitBtn: {
    innerText: '提交',
    show: false,
    type: 'primary'
  },

  // 重置按钮默认配置,设置resetBtn=true或resetBtn.show=true时显示
  resetBtn: {
    show: false,
    icon: 'refresh',
    innerText: '重置',
    type: 'default',
    col: {
      push: 16
    }
  }
}
