const {fs, path} = require('@vuepress/shared-utils');

module.exports = ctx => ({
    title: '技术收藏',
    description: '厉害',
    head: [
        ['link', { rel: 'icon', href: '/logo.png' }]
    ],
    themeConfig: {
        logo: '/logo.png',
        nav: [
            {text: 'Java', link: '/java/'},
            {text: 'Docker', link: '/docker/'},
            {text: 'Linux', link: '/linux/'},
            {text: 'Vue', link: '/vue/'},
            {text: 'Go', link: '/go/'}
        ],
        sidebar: {
            '/java/': subSidebar('Java', '说明', 'java'),
            '/docker/': subSidebar('Docker', '说明', 'docker'),
            '/linux/': subSidebar('Linux', '说明', 'linux'),
            '/vue/': subSidebar('Vue', '说明', 'vue'),
            '/go/': subSidebar('Go', '说明', 'go')
        },
        lastUpdated: 'Last Updated',
    },
    plugins: [
        // ['autobar'],
        // ['@vuepress/last-updated'],
        // ['@vuepress/active-header-links', {
        //     sidebarLinkSelector: '.sidebar-link',
        //     headerAnchorSelector: '.header-anchor'
        // }]
    ],
    extraWatchFiles: [
        '.vuepress/nav/zh.js'
    ]
});

function subSidebar(title, introduce, filePath) {
    let sidebar = [];
    readDirSync(filePath, sidebar);
    console.log('sidebar - ', sidebar);

    let head = ['', introduce], children = [head];
    if (sidebar) {
        children = [
            head,
            ...sidebar.sort()
        ];
    }

    return [{
        title: title,
        collapsable: false,
        children: [
            head,
            ...sidebar.sort()
        ]
    }];
}

function readDirSync(filePath = '', sidebar = []) {
    let fileNameArr = fs.readdirSync(pathResolve(filePath));

    fileNameArr.forEach(function (fileName, index) {

        let tempPath = path.join(filePath, fileName);

        if (fs.statSync(pathResolve(tempPath)).isDirectory()) {
            readDirSync(tempPath, sidebar);

        } else {
            if (checkFileType(fileName)) {
                let tempFileName = trimFileName(filePath, fileName);
                if (tempFileName) {
                    sidebar.push(tempFileName);
                }
            }
        }
    });
}

function pathResolve(filePath = '') {
    let prefix = '..';
    return path.resolve(__dirname, path.join(prefix, filePath));
}

function checkFileType(fileName = '') {
    return fileName.includes('.md') && fileName != 'README.md';
}

function trimFileName(filePath = '', fileName = '') {
    filePath = filePath.split('\\').slice(1).join('/');
    return path.join(filePath, fileName).replace(/\\/g, '/').slice(0, -3);
}
