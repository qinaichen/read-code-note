module.exports = {
    title: '编程笔记',
    port: 1337,
    markdown: {
        lineNumbers: true
    },
    themeConfig: {
        displayAllHeaders: true,
        nav: [{
            text: 'GitHub',
            link: 'https://github.com/qinaichen/read-code-note.git',
            target: '_blank'
        }],
        sidebar: {
            '/security/': [
                '',
                '初步入门',
                '自定义认证'
            ]
        }
    }
}