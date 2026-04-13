(function() {
    "use strict";

    class DraggableRow {

        constructor (row) {
            this.row = row;
            this.widget = row.getElementsByClassName('drag-handle')[0];
            this.init();
        }

        init() {
            const that = this;
            this.widget.onmousedown = function (e) {
                that.row.setAttribute('draggable', 'true');
            }
            this.widget.onmouseup = function(e) {
                that.row.setAttribute('draggable', 'false')
            }
            this.row.ondragstart = function (e) {
                that.row.classList.add("on-drag");
                e.dataTransfer.setData("text", that.row.id);
            }
            this.row.ondragend = function (e) {
                that.row.classList.remove("on-drag");
                that.row.setAttribute('draggable', 'false')
            }
        }
    }


    class RearrangeAbleTable {

        constructor (el) {
            this.table = el;
            this.rows = el.querySelectorAll('tr');
            this.init();
        }

        init() {
            this.table.querySelectorAll('.drag-handle').forEach((el) => {
                new DraggableRow(el.closest('tr'));
            });

            this.rows.forEach((row) => {
                row.ondragover = function (e) {
                    e.preventDefault();
                }
                row.ondragenter = function (e) {
                    e.target.closest('tr').classList.add('on-drag-over');
                }
                row.ondragleave = function (e) {
                    e.target.closest('tr').classList.remove('on-drag-over');
                }
                row.ondrop = function (e) {
                    e.preventDefault();
                    e.target.closest('tr').classList.remove('on-drag-over');
                    const rowId = e.dataTransfer.getData("text");
                    const movedRow = document.getElementById(rowId);
                    new DraggableRow(movedRow);
                    const targetRow = e.target.closest('tr');
                    targetRow.after(movedRow);
                }
            });
        }
    }


    document.addEventListener("DOMContentLoaded", function () {
        document.querySelectorAll('table').forEach((el) => {
            if (el.querySelector('.drag-handle')) {
                new RearrangeAbleTable(el);
            }
        });
    });

})();
