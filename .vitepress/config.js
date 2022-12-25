import { defineConfig } from 'vitepress'

export default defineConfig({
    title: '编程笔记',
    description: '吃饱肚子,洗洗睡吧',
    appearance: true,
    themeConfig: {
        nav: [
            {
                text: 'Java',
                items: [
                    { text: "Java核心技术", link: '/java_core/' },
                    { text: "Java虚拟机", link: '/jvm/' },
                    { text: 'Spring Security', link: '/security/' }
                ]
            },
        ],
        sidebar: {
            '/java_core/': [
                {
                    text: '概述',
                    collapsed: false,
                    items:[
                        
                    ]
                }
            ],
            '/jvm/':[
                {
                    text:'Java虚拟机',
                    collapsed: false,
                    items:[
                        {text:'JVM概述',link:'/jvm/'},
                        {text:'虚拟机和Java虚拟机介绍',link:'/jvm/introduce'},
                        {text:'JVM的发展历程',link:'/jvm/history'},
                        {text:'Java代码执行流程',link:'/jvm/java_run_flow'},
                        {text:'JVM内存结构',link:'/jvm/jmem'}
                    ]
                }
            ],
            '/security/': [
                {
                    text: 'Spring Security',
                    collapsible: true,
                    items: [
                        { text: '概述', link: '/security/' },
                        { text: '环境搭建', link: '/security/quickstart' },
                        { text: '自定义认证', link: '/security/custom_auth' },
                        { text: '登录页', link: '/security/login_page' },
                        { text: 'Ajax提交表单', link: '/security/ajax_form' },
                    ]
                }
            ]
        }
    }
})
