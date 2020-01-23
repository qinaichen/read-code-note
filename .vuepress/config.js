module.exports = {
    title: '编程笔记',
    port: 1337,
    markdown: {
        lineNumbers: true
    },
    themeConfig: {
        search: false,
        nav: [{
            text: 'java',
            items: [
                { text: 'Spring', link: '/spring/' },
                { text: 'Spring Security', link: '/security/' },
                { text: 'Jvm', link: '/jvm/' }

            ]
        }, {
            text: 'GitHub',
            link: 'https://github.com/qinaichen/read-code-note.git',
            target: '_blank'
        }],
        sidebar: {
            '/security/': [
                '',
                '初步入门',
                '自定义认证',
                '登录页',
                'Ajax提交表单'
            ],
            '/spring/': [
                '',
                '组件注册'
            ],
            '/jvm/':[

            ]
        }
    }
}