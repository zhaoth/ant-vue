import Mock from 'mockjs2'
import { builder } from '../../util'

const tree = options => {
  const treeInfo =
    {
      pk: '0000',
      code: '13202',
      org_name: '明哲.方',
      pk_parent: 'lfdiv5',
      des: '258s6y',
      org_type: '75eyas',
      is_group: 'utovgi',
      pk_group: 'oxknxq',
      children: [{
        pk: '0001',
        code: 'a13202',
        org_name: '213明哲.方',
        pk_parent: 'lfdiv5',
        des: '258s6y',
        org_type: '75eyas',
        is_group: 'utovgi',
        pk_group: 'oxknxq'
      }]
    }

  return builder(treeInfo)
}

Mock.mock(/\/api\/prod-aps\/org\/getOrgsByPkAccount/, 'get', tree)
