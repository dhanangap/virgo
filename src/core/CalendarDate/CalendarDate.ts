import Locale from "./Locale";

export default class CalendarDate {

	private _day?: number;
	private _date?: number;
	private _month?: number;
	private _week?: number;
	private _year?: number;
	private _utcOffset?: number;

	constructor(...args: Array<number>) {
		const y	= args[0] ? args[0] : 1970;
		const m	= args[1] ? args[1] : 0;
		const d	= args[2] ? args[2] : 1;
		const date = new Date(y, m, d);

		this._day = date.getDay();
		this._date 		= date.getDate();
		this._month 	= date.getMonth();
		this._year 		= date.getFullYear();
		this._utcOffset = date.getTimezoneOffset() * (-1);
	}

	// Getters

	get day()		: number { return this._day }
	get date()		: number { return this._date }
	get month()		: number { return this._month }
	get week()		: number { return this._week }
	get year()		: number { return this._year }
	get utcOffset()	: number { return this._utcOffset }

	// References

	get lastMonth()	: CalendarDate {
		const y = this.month === 0 ? this.year - 1 : this.year;
		const m = this.month === 0 ? 11 : this.month - 1;
		const d = 1;
		return new CalendarDate(y, m, d);
	}

	get nextMonth(): CalendarDate {
		const y = this.month === 11 ? this.year + 1 : this.year;
		const m = this.month === 11 ? 0 : this.month + 1;
		const d = 1;
		return new CalendarDate(y, m, d);
	}

	get lastYear(): CalendarDate {
		const y = this.year - 1;
		const m = 0;
		const d = 1;
		return new CalendarDate(y, m, d);
	}

	get nextYear(): CalendarDate {
		const y = this.year + 1;
		const m = 0;
		const d = 1;
		return new CalendarDate(y, m, d);
	}

	toDate(): Date {
		return new Date(this.year, this.month, this.date);
	}

	isEqual(date: CalendarDate): boolean {
		return (this.date === date.date) && (this.month === date.month) && (this.year === date.year);
	}

	getDatesInMonth(count?: number) : CalendarDate[] {
		let dates = [];
		let referenceDate = new Date(this.year, this.month, 1);
		while (referenceDate.getMonth() === this.month) {
			dates.push(new CalendarDate(referenceDate.getFullYear(), referenceDate.getMonth(), referenceDate.getDate()));
			referenceDate.setDate(referenceDate.getDate() + 1);
		}

		if (count && count !== 0) {
			if (count > 0) return dates.slice(0, count);
			else return dates.slice(count);
		}

		return dates;
	}

	getMonthsInYear(count?: number): CalendarDate[] {
		let months: CalendarDate[] = [];
		let referenceDate = new Date(this.year, 0, 1);
		while (referenceDate.getFullYear() === this.year) {
			months.push(new CalendarDate(referenceDate.getFullYear(), referenceDate.getMonth(), referenceDate.getDate()));
			referenceDate.setMonth(referenceDate.getMonth() + 1);
		}
		if (count && count !== 0) {
			if (count > 0) return months.slice(0, count);
			else return months.slice(count);
		}
		return months;
	}

	getYears(countBefore: number = 0, countAfter: number = 0): CalendarDate[] {
		let years: CalendarDate[] = [];

		for (let i = countBefore; i >= 1; i--) {
			years.push(new CalendarDate(this.year - i, 0, 1));
		}

		years.push(new CalendarDate(this.year, 0, 1));

		for (let i = 1; i <= countAfter; i++) {
			years.push(new CalendarDate(this.year + i, 0, 1));
		}

		return years;
	}

	format(format: string): string {
		return CalendarDate.format(this, format);
	}

	// Static Methods

	static createFromDate(date: Date): CalendarDate {
		return new CalendarDate(date.getFullYear(), date.getMonth(), date.getDate());
	}

	/**
	 * d: short date 1..31
	 * dd: full date 01..31
	 * m: month index 1..12
	 * mm: month index 01..12
	 * M: short month Jan..Dec
	 * MM: full month January..December
	 * yy: two-digit year 12
	 * yyyy: four-digit year 2012
	*/

	static format(date: CalendarDate, format: string, localeId?: string): string {
		const locale = Locale.get("en_US");
		// let dateString = format;
		let dateString = "";

		let previousToken = "";
		const reservedChars = ['d', 'D', 'm', 'M', 'y'];
		for (let i = 0; i < format.length; i++) {
			const char = format[i];
			
			// Ignore character
			if (!reservedChars.includes(char)) {
				dateString = dateString + char;
			}

			// Process character
			else {
				// Token done
				if (format[i + 1] !== char) {
					// Process token then clear token
					dateString = dateString + this.convertTokenToModifier(previousToken + char);
					previousToken = "";
				}
				// Process token further
				else {
					previousToken = previousToken + char;
				}
			}
		}

		// Date
		dateString = dateString.replace('{paddedDate}', date.date.toString().padStart(2, '0'));
		dateString = dateString.replace('{date}', date.date.toString());
		
		// Month
		dateString = dateString.replace('{paddedMonth}', (date.month + 1).toString().padStart(2, '0'));
		dateString = dateString.replace('{month}', (date.month + 1).toString());
		dateString = dateString.replace('{longMonthString}', locale.fullMonths[date.month]);
		dateString = dateString.replace('{shortMonthString}', locale.shortMonths[date.month]);
		
		// Year
		dateString = dateString.replace('{fullYear}', date.year.toString().padStart(4, '0'));
		dateString = dateString.replace('{shortYear}', date.year.toString().slice(-2));

		return dateString;
	}

	static convertTokenToModifier(token: string): string {
		switch (token) {
			case "d":
				return "{date}"
				break;
			case "dd":
				return "{paddedDate}"
				break;
			case "m":
				return "{month}"
				break;
			case "mm":
				return "{paddedMonth}"
				break;
			case "M":
				return "{shortMonthString}"
				break;
			case "MM":
				return "{longMonthString}"
				break;
			case "yy":
				return "{shortYear}"
				break;
			case "yyyy":
				return "{fullYear}"
				break;
			default:
				return "";
				break;
		}
	}

}