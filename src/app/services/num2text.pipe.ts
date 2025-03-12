import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'numberToWords'
})
export class NumberToWordsPipe implements PipeTransform {
    transform(value: any): string {
        if (value && this.isInteger(value)) {
            return this.numToWordsWithCommas(value);
        }
        return value;
    }

    private isInteger(x: any): boolean {
        return x % 1 === 0;
    }

    private numToWords(n: number): string {
        if (n === 0) {
            return 'zero';
        }

        let lessThanTwenty = ['', 'one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine', 'ten', 'eleven', 'twelve', 'thirteen',
            'fourteen', 'fifteen', 'sixteen', 'seventeen', 'eighteen', 'nineteen'];

        let tens = ['', '', 'twenty', 'thirty', 'forty', 'fifty', 'sixty', 'seventy', 'eighty', 'ninety'];

        let scales = ['', 'thousand', 'million', 'billion', 'trillion', 'quadrillion', 'quintillion', 'sextillion', 'septillion', 'octillion', 'nonillion'];

        let convertChunk = (num: number): string => {
            let chunkResult = '';

            let hundreds = Math.floor(num / 100);
            num %= 100;

            if (hundreds !== 0) {
                chunkResult += `${lessThanTwenty[hundreds]} hundred`;
            }

            if (num === 0) {
                return chunkResult;
            }

            if (chunkResult !== '') {
                chunkResult += ' and ';
            }

            if (num < 20) {
                chunkResult += lessThanTwenty[num];
            } else {
                let tensDigit = Math.floor(num / 10);
                let onesDigit = num % 10;
                chunkResult += `${tens[tensDigit]}${onesDigit !== 0 ? '-' + lessThanTwenty[onesDigit] : ''}`;
            }

            return chunkResult;
        };

        let convertGroup = (num: number, scale: string): string => {
            let groupResult = '';
            let chunkCount = 0;

            while (num > 0) {
                let chunk = num % 1000;
                if (chunk !== 0) {
                    let chunkWords = convertChunk(chunk);
                    if (chunkCount > 0) {
                        groupResult = `${chunkWords} ${scales[chunkCount]} ${groupResult}`;
                    } else {
                        groupResult = `${chunkWords} ${groupResult}`;
                    }
                }
                num = Math.floor(num / 1000);
                chunkCount++;
            }

            return groupResult.trim();
        };

        return convertGroup(n, '');
    }

    private addCommas(str: string): string {
        let parts = str.split(' ');
        for (let i = 0; i < parts.length; i++) {
            if (parts[i] === 'and') {
                continue;
            }
            parts[i] = parts[i].replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,');

            if (parts[i] === 'thousand' || parts[i] === 'million' || parts[i] === 'billion' || parts[i] === 'trillion') {
                parts[i] = parts[i] + ','
            }
        }
        return parts.join(' ');
    }

    private numToWordsWithCommas(n: number): string {
        let result = this.numToWords(n);
        result = this.addCommas(result);

        return result;
    }
}