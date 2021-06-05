export default {
    methods: {
        getPastYears(year) {
            const pastYears = [];
            let thisYear = new Date().getFullYear();
            for (let i = 0; i < year; i++) {
                pastYears.push(thisYear - i)
            }
            return pastYears;
        }
    }
}