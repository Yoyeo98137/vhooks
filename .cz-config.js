'use strict';

module.exports = {

  types: [
    {
      value: 'feat',
      name: '✨ feat:           一个新的特性'
    },
    {
      value: 'fix',
      name: '🐞 fix:            修复一个Bug'
    },
    {
      value: 'docs',
      name: '📃 docs:           变更的只有文档'
    },
    {
      value: 'style',
      name: '🌈 style:          空格, 分号等格式修复'
    },
    {
      value: 'refactor',
      name: '🦄 refactor:       代码重构，注意和特性、修复区分开'
    },
    {
      value: 'perf',
      name: '🎈 perf:           提升性能'
    },
    {
      value: 'test',
      name: '🧪 test:           添加一个测试'
    },
    {
      value: 'build',
      name: '🔧 build:          构建相关变更'
    },
    {
      value: 'chore',
      name: '🐳 chore:          开发工具变动(构建、脚手架工具等)'
    },
    {
      value: 'revert',
      name: '⏪ revert:         代码回退'
    }
  ],

  // @see: https://juejin.cn/post/7039256801899970568
  scopes: [
    ['useRequest', 'hooks —— useRequest 相关'],

    // `allowCustomScopes: true,`
    // empty
    // custom
  ].map(([value, description]) => {
    return {
      value,
      name: `${value.padEnd(30)} (${description})`
    }
  }),

  messages: {
    type: '请选择提交的类型；',
    customScope: '请输入修改的范围（可选）',
    subject: '请简要描述提交（必填）',
    body: '请输入详细描述（可选）',
    footer: '请选择要关闭的issue（可选）',
    confirmCommit: '确认要使用以上信息提交？（y/n）',
  },

  allowCustomScopes: true,
  skip: ['body', 'footer'],
  subjectLimit: 72,

};
