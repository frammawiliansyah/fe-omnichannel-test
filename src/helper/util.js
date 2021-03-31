const XLSX = require("xlsx");
const util = {
  thousandSeparator: x => {
    try {
      var parts = x.toString().split(",");
      parts[0] = "Rp " + parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ".");
      return parts.join(",");
    } catch (e) {
      return null;
    }
  },
  thousandSeparatorPure: x => {
    try {
      return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
    } catch (e) {
      return null;
    }
  },
  exportExcel: data => {
    let result = [];
    let temp = [];
    let tempHead = [];
    for (let count = 0; count < data.length; count++) {
      temp = [];
      for (let prop in data[count]) {
        if (count === 0) {
          temp.push(data[count][prop]);
          tempHead.push(prop);
        } else {
          temp.push(data[count][prop]);
        }
      }
      if (count === 0) {
        result.push(tempHead);
        result.push(temp);
      } else {
        result.push(temp);
      }
    }

    const worksheet = XLSX.utils.aoa_to_sheet(result);
    let newWorkbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(newWorkbook, worksheet, "Sheet");
    XLSX.writeFile(newWorkbook, "export" + Date.now() + ".xlsx");
  }
};

export default util;
