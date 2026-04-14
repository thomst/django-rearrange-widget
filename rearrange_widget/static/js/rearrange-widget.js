(function() {
    "use strict";

    class RearrangeAbleTable {

        constructor (table) {
            this.table = table;
            this.rows = table.querySelectorAll('tr.has_original');
            this.form = table.closest('form');
            this.initRowsAsDropZone();
            this.initRowsAsDraggable();
            this.initFormWithSubmitHandler();
        }

        initRowsAsDropZone() {
            // Making the rows drop zones for the dragged row.
            [].forEach.call(this.rows, (row) => {
                var counter = 0
                row.addEventListener("dragenter", function (e) {
                    counter++;
                    row.classList.add('on-drag-over');
                });
                row.addEventListener("dragleave", function (e) {
                    counter--;
                    if (counter == 0) row.classList.remove('on-drag-over');
                });
                row.addEventListener("dragover", function (e) {
                    e.preventDefault();
                });
                row.addEventListener("drop", function (e) {
                    e.preventDefault();
                    row.classList.remove('on-drag-over');
                    const rowId = e.dataTransfer.getData("text");
                    row.after(document.getElementById(rowId));
                });
            });
        }

        initRowsAsDraggable() {
            // Make the rows draggable by the widget's drag handle.
            [].forEach.call(this.rows, (row) => {
                const handle = row.querySelector('.drag-handle');
                handle.addEventListener("mousedown", function (e) {
                    row.setAttribute('draggable', 'true');
                });
                handle.addEventListener("mouseup", function(e) {
                    row.setAttribute('draggable', 'false');
                });
                row.addEventListener("dragstart", function (e) {
                    row.classList.add("on-drag");
                    e.dataTransfer.setData("text", row.id);
                });
                row.addEventListener("dragend", function (e) {
                    row.classList.remove("on-drag");
                    row.setAttribute('draggable', 'false');
                });
            });

        }

        initFormWithSubmitHandler() {
            const table = this.table;
            this.form.addEventListener("submit", function (e) {
                // Query the rows anew to have their current order.
                const rows = table.querySelectorAll('tr.has_original');
                [].forEach.call(rows, (row, index) => {
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
