// Assumptions:
// 1. If custom availability is provided for an employee, she will not work outside those date ranges.
// - the opposite assumption may be better
// 2. Availabilities are given in sorted order.

/* Method 1
Keep a cursor through the interval
For each range:
- print days before
- days during
If you have days left go ahead and print them

Method 2
For each day in the interval:
- check each interval and if it's there print that number, if not print 0
*/

const fs = require('fs');

const printEmployeeAvailability = (id, start, end) => {
	const {companyHours, employees, availabilities} = parseInput();
	const startDate = new Date(start);
	const endDate = new Date(end);
	const ranges = availabilities.filter(a => a.employeeId === id);

	let cursor = startDate;
	ranges.forEach(r => {
		if ()
	})

	// printSchedule(new Date('05/19/2017'), new Date('05/30/2017'), companyHours);

	// if (end < firstRange.start && start > lastRange.end) {
	//
	// } else {
	//   for
	// }

	// console.log(companyHours);
	// console.log(employees);
	// console.log(availabilities);
	// console.log(ranges);
}

const printSchedule = (startDate, endDate, hours) => {
	let next = startDate;
	while (next <= endDate) {
		console.log('"' + formatDate(next) + '", ' + hours[next.getDay()]);
		next.setDate(next.getDate() + 1);
	}
}

const parseInput = () => {
	const inputArray = fs.readFileSync('data.txt').toString().split('\n')
		.filter(line => line); // remove empty lines
	let companyHours = parseHours(inputArray[1]);
	companyHours = makeSundayFirst(companyHours);

	const employees = [];
	let i = 3;
	while (inputArray[i] && inputArray[i][0] !== '#') {
		const e = inputArray[i++].split(', ');
		employees.push({id: Number(e[0]), name: e[1]});
	}

	const availabilities = [];
	while (i < inputArray.length) {
		const line = inputArray[i++];
		if (line[0] !== '#') {
			const a = line.replace(' ', '').split(',');
			const hours = parseHours(line.substr(line.indexOf('[')));
			availabilities.push({
				employeeId: Number(a[0]),
				startDate: parseDate(a[1]),
				endDate: parseDate(a[2]),
				hours: makeSundayFirst(hours)
			});
		}
	}
	return {companyHours, employees, availabilities};
}

const parseHours = a => a.substring(1, a.length - 1).split(',').map(Number);

const parseDate = d => d === 'null' ? null : new Date(d.replace('"', ''));

const makeSundayFirst = a => (a.unshift(a.pop()), a); // to match JS getDay() indices

// mm/dd/yyyy. Could also use JS toLocaleDateString() but that returns m/d/yyyy.
const formatDate = d => {
  const year = d.getFullYear();
  let month = (1 + d.getMonth()).toString();
  month = month.length > 1 ? month : '0' + month;
  let day = d.getDate().toString();
  day = day.length > 1 ? day : '0' + day;
  return month + '/' + day + '/' + year;
}

printEmployeeAvailability(1, '12/29/2015', '01/02/2016');
