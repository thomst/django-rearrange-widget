(function() {
    "use strict";

    class RearrangeAbleTable {

        constructor (table) {
            this.table = table;
            this.initRows();
            this.initDragHandle();
            this.initForm();
        }

        initRows() {
            this.table.querySelectorAll('tr').forEach((row) => {
                // Making the rows drop zones for the dragged row.
                row.addEventListener("dragover", function (e) {
                    e.preventDefault();
                });
                row.addEventListener("dragenter", function (e) {
                    e.target.closest('tr').classList.add('on-drag-over');
                });
                row.addEventListener("dragleave", function (e) {
                    e.target.closest('tr').classList.remove('on-drag-over');
                });
                row.addEventListener("drop", function (e) {
                    e.preventDefault();
                    e.target.closest('tr').classList.remove('on-drag-over');
                    const rowId = e.dataTransfer.getData("text");
                    const movedRow = document.getElementById(rowId);
                    const targetRow = e.target.closest('tr');
                    targetRow.after(movedRow);
                });
            });
        }

        initDragHandle() {
            // Make the rows draggable by the widget's drag handle.
            this.table.querySelectorAll('.drag-handle').forEach((handle) => {
                const row = handle.closest('tr');
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

        initForm() {
            const form = this.table.closest('form');
            const inputs = this.table.querySelectorAll('.rearrange-widget-index');
            form.addEventListener("submit", function (e) {
                [].forEach.call(inputs, (input, index) => { input.value = index; });
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
