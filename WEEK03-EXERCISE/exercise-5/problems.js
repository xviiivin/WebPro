const title = "WEEK 3 - Exercise 5, Array (2)"
const problems = [
    {
        title: 'PROBLEM 5.1',
        body: `
            แก้ไขฟังก์ชัน \`insertBySplice(input)\`  
            <br><br>

            ให้ใช้ฟังก์ชัน .splice() ในการ **แทรก (insert)** สมาชิกเข้าไปใน Array  
            เรียงลำดับตัวเลขให้ถูกต้อง
        `,
        testcases: [
            { input: [0, 1, 2, 4], expect: [0, 1, 2, 3, 4], result: null },
        ],
        run: insertBySplice
    },
    {
        title: 'PROBLEM 5.2',
        body: `
            แก้ไขฟังก์ชัน \`removeBySplice(input)\`  
            <br><br>

            ให้ใช้ฟังก์ชัน .splice() ในการ **ลบ (remove)** สมาชิกออกจาก Array  
            เรียงลำดับตัวเลขให้ถูกต้อง
        `,
        testcases: [
            { input: [0, 1, 2, 3, 5, 4], expect: [0, 1, 2, 3, 4], result: null },
        ],
        run: removeBySplice
    },
    {
        title: 'PROBLEM 5.3',
        body: `
            แก้ไขฟังก์ชัน \`replaceBySplice(input)\`  
            <br><br>

            ให้ใช้ฟังก์ชัน .splice() ในการ **เปลี่ยน (replace)** สมาชิกใน Array  
            เรียงลำดับตัวเลขให้ถูกต้อง
        `,
        testcases: [
            { input: [0, 1, 2, 3, 9, 5], expect: [0, 1, 2, 3, 4, 5], result: null },
        ],
        run: replaceBySplice
    },
    {
        title: 'PROBLEM 5.4',
        body: `
            แก้ไขฟังก์ชัน \`findAverage(input)\`  
            <br><br>

            ให้ใช้ฟังก์ชัน \`.map()\` และ/หรือ \`.filter()\` และ/หรือ \`.reduce()\` ในการหาค่าเฉลี่ยของตัวเลขทั้งหมดใน \`input\`  
            (ให้ถือว่า \`null\` \`undefined\`, \`''\` เป็น 0)  
        `,
        testcases: [
            {
                input: [0, 31, 92, null, -24, undefined, null, '', 9, 26],
                expect: 13.4,
                result: null
            },
        ],
        run: findAverage
    },
]

const app = new Vue({
    el: '#app',

    data: {
        title: title,
        problems: problems,
    },

    methods: {
        run(problem) {
            for (const testcase of problem.testcases) {
                if (testcase.input !== 'NO_INPUT') {
                    if (testcase.input === 'function () {}') {
                        testcase.result = problem.run(function () { })
                    } else {
                        testcase.result = problem.run(_.clone(testcase.input))
                    }
                } else {
                    testcase.result = problem.run()
                }
            }
        },
        markdownToHtml(text) {
            const lines = text.split(/\r?\n/).map(
                line => line.substring(0, 12).trim() === ''
                    ? line.substring(11)
                    : line
            )
            return marked.parse(lines.join('\n'))
        },
        isEqual(a, b) {
            if (a === 'NO_INPUT' || b === 'NO_INPUT') return false
            return _.isEqual(a, b)
        },
        log(e, data) {
            console.log(data)
        },
        prettyJson(obj) {
            if (obj === undefined) {
                return 'undefined'
            }
            if (typeof obj === 'function') {
                return 'function () {}'
            }
            if (this.isComplex(obj)) {
                return JSON.stringify(obj, null, 2)
            } else {
                return JSON.stringify(obj)
            }
        },
        isComplex(obj) {
            if (_.isString(obj)) return false
            if (_.isBoolean(obj)) return false
            if (_.isNumber(obj)) return false
            if (_.isArray(obj)) {
                return this.isComplex(obj[0])
            }
            return true
        }
    }
})