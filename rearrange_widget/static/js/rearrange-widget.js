(function() {
    "use strict";

    class RearrangeAbleTable {

        constructor (table) {
            this.table = table;
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
            row.addEventListener("dragenter", function (e) {
                counter++;
                row.classList.add('on-drag-over');
            });
            row.addEventListener("dragleave", function (e) {
                counter--;
                if (counter == 0) row.classList.remove('on-drag-over');
            });
            row.addEventListener("drop", function (e) {
                counter = 0;
                row.classList.remove('on-drag-over');
            });
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
                const inputID = row.querySelector('input.rearrange-widget-index').id;
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
            const form = this.table.closest('form');
            const getRows = this.getRows.bind(this);
            form.addEventListener("submit", function (e) {
                [].forEach.call(getRows(), (row, index) => {
                    row.querySelector('.rearrange-widget-index').value = index;
                });
            });
        }
    }


    document.addEventListener("DOMContentLoaded", function () {
        // Init each table which uses the rearrange-widget.
        document.querySelectorAll('table').forEach((el) => {
            if (el.querySelector('.drag-handle')) {
                new RearrangeAbleTable(el);
            }
        });
    });

})();
