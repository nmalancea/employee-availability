const fs = require('fs');

const printEmployeeAvailability = (id, startString, endString) => {
	const {companyHours, employees, availabilities} = parseInput();
	const start = new Date(startString);
	const end = new Date(endString);
	const ranges = availabilities.filter(a => a.employeeId === id);
	printSchedule(start, end, companyHours, ranges);
}

const printSchedule = (start, end, hours, ranges) => {
	let next = start;
	while (next <= end) {
		let workHours;
		ranges.forEach(r => {
			if ((r.start === null || r.start <= next) && (r.end === null || r.end >= next)) {
				workHours = r.hours[next.getDay()];
			}
		});
		if (!workHours) {
			workHours = hours[next.getDay()];
		}
		console.log('"' + formatDate(next) + '", ' + workHours);
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
				start: parseDate(a[1]),
				end: parseDate(a[2]),
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

// running with command line arguments
if (process.argv.length === 5) { // first 2 elements are the process and file names
	const args = process.argv.slice(2); // user-provided args start at index 2
	args[0] = Number(args[0]);
	printEmployeeAvailability(...args);
}

// sample tests
// printEmployeeAvailability(1, '12/29/2015', '01/02/2016'); // 9, 9, 9, 4, 0
// printEmployeeAvailability(1, '12/29/2016', '01/02/2017'); // 9, 8, 0, 0, 8
// printEmployeeAvailability(3, '12/29/2016', '01/02/2017'); // 9, 8, 0, 0, 9
