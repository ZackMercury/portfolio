
export default class Matrix<T> {
    public data:T[][];
    public rows: number;
    public cols: number;

    constructor (cols:number, rows:number) {
        this.data = new Array(cols).fill(null).map(col => new Array(rows).fill(null));
        this.rows = rows;
        this.cols = cols;
    }

    get (x: number, y: number): T {
        if (x >= 0 && x < this.cols && y >= 0 && y < this.rows)
            return this.data[x][y];
        else return null;
    }

    shiftRight (): void {
        this.cols ++;
        this.data.unshift(new Array(this.rows).fill(null));
    }

    shiftLeft (): void {
        this.data.push(new Array(this.rows).fill(null));
        this.data.shift();
    }

    shiftTop (): void {
        const data = this.data;
        for (const column of data) {
            column.shift();
        }
        this.rows --;
    }

    shiftBottom (): void {
        const data = this.data;
        for (const column of data) {
            column.unshift(null);
        }
        this.rows ++;
    }

    addRowBottom (): void {
        const data = this.data;
        for (const column of data) {
            column.push(null);
        }
        this.rows ++;
    }

    addColumnRight (): void {
        this.data.push(new Array(this.rows).fill(null));
        this.cols ++;
    }

    addColumnLeft (): void {
        this.data.unshift(new Array(this.rows).fill(null));
        this.cols ++;
    }

    getBottomRow (): T[] {
        const data = this.data;
        const row = [];
        const lastRow = this.rows - 1;
        for (const column of data) {
            row.push(column[lastRow])
        }

        return row;
    }
}