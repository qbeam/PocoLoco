export default {
    methods: {
        getTodayDate() {
            var today = new Date();
            var dd = String(today.getDate()).padStart(2, "0");
            var mm = String(today.getMonth() + 1).padStart(2, "0"); //January is 0!
            var yyyy = today.getFullYear();
            today = yyyy + "-" + mm + "-" + dd;
            return today;
          },
        getPastYears(year) {
            const pastYears = [];
            let thisYear = new Date().getFullYear();
            for (let i = 0; i < year; i++) {
                pastYears.push(thisYear - i);
            }
            return pastYears;
        },
        getDefaultDateFormat(date) {
            const inputDate = date.trim();
            var datearray = inputDate.split("/");
            if (datearray.length != 3 || inputDate.length != 10) {
              alert("Date format should be dd/mm/yyyy");
            }
            var newdate = datearray[2] + "-" + datearray[1] + "-" + datearray[0];
            return newdate;
          },
         convertToSlash(date) {
            var datearray = date.split("-");
                var newdate = datearray[2] + "/" + datearray[1] + "/" + datearray[0];
                return newdate;
         }
    }
}