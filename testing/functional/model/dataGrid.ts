import { ClientFunction } from "testcafe";
import Widget from "./internal/widget";

const CLASS = {
    dataRow: 'dx-data-row',
    focused: 'dx-focused',
    focusedRow: 'dx-row-focused',
    editCell: 'dx-editor-cell',
    rowRemoved: 'dx-row-removed',
};

class DataCell {
    element: Selector;
    isFocused: Promise<boolean>;
    isEditCell: Promise<boolean>;

    constructor(dataRow: Selector, index: number) {
        this.element = dataRow.find(`td:nth-child(${++index})`);
        this.isFocused = this.element.hasClass(CLASS.focused);
        this.isEditCell = this.element.hasClass(CLASS.editCell);
    }
}

class DataRow {
    element: Selector;
    isRemoved: Promise<boolean>;
    isFocusedRow: Promise<boolean>;

    constructor(element: Selector) {
        this.element = element;
        this.isRemoved = this.element.hasClass(CLASS.rowRemoved);
        this.isFocusedRow = this.element.hasClass(CLASS.focusedRow);
    }

    getDataCell(index: number): DataCell {
        return new DataCell(this.element, index);
    }
}

export default class DataGrid extends Widget {
    dataRows: Selector;
    getGridInstance: ClientFunction<any>;

    name: string = 'dxDataGrid';

    constructor(id: string) {
        super(id);

        this.dataRows = this.element.find(`.${CLASS.dataRow}`);

        const dataGrid =  this.element;

        this.getGridInstance = ClientFunction(
            () => $(dataGrid())["dxDataGrid"]("instance"),
            { dependencies: { dataGrid }}
        );
    }

    getDataRow(index: number): DataRow {
        return new DataRow(this.element.find(`.${CLASS.dataRow}:nth-child(${++index})`));
    }

    getDataCell(rowIndex: number, columnIndex: number): DataCell {
        return this.getDataRow(rowIndex).getDataCell(columnIndex);
    }

    getFocusedRow(): Selector {
        return this.dataRows.filter(`.${CLASS.focusedRow}`);
    }

    scrollTo(options): Promise<void> {
        const getGridInstance: any = this.getGridInstance;

        return ClientFunction(
            () => getGridInstance().getScrollable().scrollTo(options),
            { dependencies: { getGridInstance, options } }
        )();
    }

    getScrollLeft() : Promise<number> {
        const getGridInstance: any = this.getGridInstance;

        return ClientFunction(
            () => getGridInstance().getScrollable().scrollLeft(),
            { dependencies: { getGridInstance: this.getGridInstance } }
        )();
    }
}
