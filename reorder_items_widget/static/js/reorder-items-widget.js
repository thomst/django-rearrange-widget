(function() {
    "use strict";

    class ReorderItemsTable {

        constructor (table) {
            this.table = table;
            this.form = table.closest('form');
            this.baseIndex = Number(table.querySelector('.reorder-items-widget-index').value);
            const style = window.getComputedStyle(table.querySelector('tbody > tr'))
            this.rowHeight = style.getPropertyValue('height');
            this.initRows();
            this.initHeaderAsDragOverAndDropZone();
            this.initFormSubmission();
        }

        getRows() {
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
                this.initRowAsDragOver(row);
                this.initRowAsDropZone(row);
                this.initRowAsDraggable(row);
            });
        }

        initRowAsDragOver(row) {
            var counter = 0
            const that = this;
            row.addEventListener("dragenter", function (e) {
                counter++;
                // The hovering row is not itself or the one above - which also
                // could be the header.
                const firstRow = that.table.querySelector('tbody > tr');
                if (
                    !row.draggable &&
                    !(row.nextElementSibling && row.nextElementSibling.draggable) &&
                    !(row.parentElement.nodeName == 'THEAD' && firstRow.draggable)
                ) that.addDragOverStyle(row);
            });
            row.addEventListener("dragleave", function (e) {
                counter--;
                if (counter == 0)
                    that.removeDragOverStyle(row);
            });
            row.addEventListener("drop", function (e) {
                counter = 0;
                that.removeDragOverStyle(row);
            });
        }

        addDragOverStyle(row) {
            row.style.borderBottom = `${this.rowHeight} solid var(--selected-bg)`;
        }

        removeDragOverStyle(row) {
            row.style.borderBottom = 0;
        }

        initRowAsDropZone(row) {
            row.addEventListener("dragover", function (e) {
                e.preventDefault();
            });
            row.addEventListener("drop", function (e) {
                e.preventDefault();
                const inputID = e.dataTransfer.getData("text");
                const draggedRow = document.getElementById(inputID).closest('tr');
                row.after(draggedRow);
            });
        }

        initRowAsDraggable(row) {
            const handle = row.querySelector('.drag-handle');
            handle.addEventListener("mousedown", function (e) {
                row.setAttribute('draggable', 'true');
            });
            handle.addEventListener("mouseup", function(e) {
                row.setAttribute('draggable', 'false');
            });
            row.addEventListener("dragstart", function (e) {
                row.classList.add("on-drag");
                const inputID = row.querySelector('input.reorder-items-widget-index').id;
                e.dataTransfer.setData("text", inputID);
            });
            row.addEventListener("dragend", function (e) {
                row.classList.remove("on-drag");
                row.setAttribute('draggable', 'false');
            });
        }

        initHeaderAsDragOverAndDropZone() {
            const row = this.table.querySelector('thead > tr');
            this.initRowAsDragOver(row);
            row.addEventListener("dragover", function (e) {
                e.preventDefault();
            });
            const querySelector = this.table.querySelector.bind(this.table);
            row.addEventListener("drop", function (e) {
                e.preventDefault();
                const inputID = e.dataTransfer.getData("text");
                const draggedRow = document.getElementById(inputID).closest('tr');
                const firstRow = querySelector('tbody > tr');
                firstRow.before(draggedRow);
            });
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
