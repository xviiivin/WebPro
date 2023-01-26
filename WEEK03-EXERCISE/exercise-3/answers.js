function getDayName(input) {
  const days = [
    "วันอาทิตย์",
    "วันจันทร์",
    "วันอังคาร",
    "วันพุธ",
    "วันพฤหัสบดี",
    "วันศุกร์",
    "วันเสาร์",
  ];
  return days[input];
  // input เป็นเลข 0-6
  // TODO: แปลงเลข 0-6 เป็น วันอาทิตย์ - วันเสาร์
  // hint
  // const daysInWeek = ['วันอาทิตย์', 'วันจันทร์', /*...*/]
}
function getMonth(input) {
  const monthsInYear = [
    "มกราคม",
    "กุมภาพันธ์",
    "มีนาคม",
    "เมษายน",
    "พฤษภาคม",
    "มิถุนายน",
    "กรกฎาคม",
    "สิงหาคม",
    "กันยายน",
    "ตุลาคม",
    "พฤศจิกายน",
    "ธันวาคม",
  ];
  return monthsInYear[input];
}

function formatDate(input) {
  return `${getDayName(input.day)}ที่ ${input.date} ${getMonth(
    input.month
  )} พ.ศ. ${input.year + 543}`;
  // input เป็น Object ในรูปแบบ
  // {
  //     day: 6, // 0=วันอาทิตย์, 1=วันจันทร์, 2=วันอังคาร, ...
  //     date: 15, // วันที่ 1-31
  //     month: 0, // 0=มกราคม, 1=กุมภาพันธ์, ...
  //     year: 2021 // ปี
  // }
  // TODO: แปลง input เป็น String ในรูปแบบ "วันศุกร์ที่ 15 มกราคม พ.ศ. 2564"
}

function findTotal(input) {
  let what = 0;
  for (let i = 0; i < input.length; i++) {
    what += input[i];
  }
  return what;

  // input เป็น array ของตัวเลข
  // TODO: ให้หาผลบวกของเลขทั้งหมดใน input
}

function findMinMax(input) {
  // input เป็น array ของตัวเลข
  // TODO: ให้หาตัวเลขที่มากที่สุดและน้อยที่สุดใน input
}

function findBMI(input) {
  // กำหนดให้ input เป็น Array ของ Object ในรูปแบบ
  // [
  //     {
  //         name: "ABC DEF", // ชื่อ นามสกุล
  //         height: 167, // ความสูง มีหน่วยเป็น cm
  //         weight: 72 // น้ำหนัก มีหน่วยเป็น kg
  //     },
  //     {
  //         name: "XYZ DEF", // ชื่อ นามสกุล
  //         height: 194, // ความสูง มีหน่วยเป็น cm
  //         weight: 60 // น้ำหนัก มีหน่วยเป็น kg
  //     },
  //     ...
  // ]
  // TODO: ให้คำนวณดัชนีมวลการ (Body Mass Index, bmi) ของแต่ละคน
}
