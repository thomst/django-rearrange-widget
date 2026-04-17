(function() {
    "use strict";

    class ReorderItemsRow {

        constructor (row, table) {
            this.row = row;
            this.table = table;
            this.init();
        }

        init () {
            this.handle = this.row.querySelector('.drag-handle');
            const style = window.getComputedStyle(this.row);
            this.rowHeight = style.getPropertyValue('height');
            this.initRowAsDragOver();
            this.initRowAsDropZone();
            this.initRowAsDraggable();
        }

        isDropZone() {
            // Check if the row is a valid drop zone:
            // The row does not hovers over itself.
            var isDropZone = !(this.row.draggable)
            // The row does not hover over the one above itself.
            isDropZone &&= !(this.row.nextElementSibling && this.row.nextElementSibling.draggable);
            // The row does not hover over the header and is the first row.
            const firstRow = this.table.querySelector('tbody > tr');
            isDropZone &&= !(this.row.parentElement.nodeName == 'THEAD' && firstRow.draggable);
            // Its table has a dragged row at all.
            isDropZone &&= !!(this.table.querySelector('tr[draggable="true"]'))
            return isDropZone;
        }

        initRowAsDragOver() {
            var counter = 0
            const that = this;
            this.row.addEventListener("dragenter", function (e) {
                counter++;
                if (!that.isDropZone()) return;
                that.row.style.borderBottom = `${that.rowHeight} solid var(--selected-bg)`;
            });
            this.row.addEventListener("dragleave", function (e) {
                counter--;
                if (counter == 0)
                    that.row.style.borderBottom = 0;
            });
            this.row.addEventListener("drop", function (e) {
                counter = 0;
                that.row.style.borderBottom = 0;
            });
        }

        initRowAsDropZone() {
            const that = this;
            this.row.addEventListener("dragover", function (e) {
                if (!that.isDropZone()) return;
                e.preventDefault();
            });
            this.row.addEventListener("drop", function (e) {
                if (!that.isDropZone()) return;
                e.preventDefault();
                const inputID = e.dataTransfer.getData("text");
                const draggedRow = document.getElementById(inputID).closest('tr');
                that.row.after(draggedRow);
            });
        }

        initRowAsDraggable() {
            const that = this;
            this.handle.addEventListener("mousedown", function (e) {
                that.row.setAttribute('draggable', 'true');
            });
            this.handle.addEventListener("mouseup", function(e) {
                that.row.setAttribute('draggable', 'false');
            });
            this.row.addEventListener("dragstart", function (e) {
                that.row.classList.add("on-drag");
                const inputID = that.row.querySelector('input.reorder-items-widget-index').id;
                e.dataTransfer.setData("text", inputID);
            });
            this.row.addEventListener("dragend", function (e) {
                that.row.classList.remove("on-drag");
                that.row.setAttribute('draggable', 'false');
            });
        }

    }

    class ReorderItemsHeaderRow extends ReorderItemsRow {

        init() {
            const firstRow = this.table.querySelector('tbody > tr');
            const style = window.getComputedStyle(firstRow);
            this.rowHeight = style.getPropertyValue('height');
            this.initRowAsDragOver();
            this.initRowAsDropZone();
        }

        initRowAsDropZone() {
            this.row.addEventListener("dragover", function (e) {
                if (!that.isDropZone()) return;
                e.preventDefault();
            });
            const that = this;
            this.row.addEventListener("drop", function (e) {
                if (!that.isDropZone()) return;
                e.preventDefault();
                const inputID = e.dataTransfer.getData("text");
                const draggedRow = document.getElementById(inputID).closest('tr');
                const firstRow = that.table.querySelector('tbody > tr');
                firstRow.before(draggedRow);
            });
        }

    }


    class ReorderItemsTable {

        constructor (table) {
            this.table = table;
            this.form = table.closest('form');
            this.baseIndex = Number(table.querySelector('.reorder-items-widget-index').value);
            this.initRows();
            this.initHeaderRow();
            this.initFormSubmission();
        }

        getRows() {
            // Check if we work with an inline formset and use the has_original
            // class to exclude empty forms.
            var selector;
            if (this.table.id == 'result_list') {
                selector = 'tbody > tr';
            } else {
                selector = 'tbody > tr.has_original'
            }
            return this.table.querySelectorAll(selector);
        }

        initRows() {
            [].forEach.call(this.getRows(), (row) => {
                new ReorderItemsRow(row, this.table);
            });
        }

        initHeaderRow() {
            const row = this.table.querySelector('thead > tr');
            new ReorderItemsHeaderRow(row, this.table);
        }

        initFormSubmission() {
            const that = this;
            this.form.addEventListener("submit", function (e) {
                [].forEach.call(that.getRows(), (row, counter) => {
                    const index = that.baseIndex + counter;
                    row.querySelector('.reorder-items-widget-index').value = index;
                });
            });
        }
    }


    document.addEventListener("DOMContentLoaded", function () {
        // Init each table which uses the reorder-items-widget.
        document.querySelectorAll('table').forEach((el) => {
            if (el.querySelector('.drag-handle')) {
                new ReorderItemsTable(el);
            }
        });
    });

})();
