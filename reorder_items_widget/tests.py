from django.test import TestCase
from .widgets import ReorderItemsWidget

# Just for coverage score.
from . import __version__


class WidgetTestCase(TestCase):
    def test_widget(self):
        widget = ReorderItemsWidget()
        css_classes = widget.build_attrs(dict(), dict())['class']
        self.assertIn('reorder-items-widget-index', css_classes)

    def test_rendering_with_value(self):
        widget = ReorderItemsWidget()
        html = widget.render('index', 1)
        input = '<input type="number" name="index" value="1" class="reorder-items-widget-index hidden">'
        drag_handle = '<div title="Drag me!" class="drag-handle">⬍</div>'
        self.assertInHTML(input, html)
        self.assertInHTML(drag_handle, html)

    def test_rendering_without_value(self):
        widget = ReorderItemsWidget()
        html = widget.render('index', None)
        input = '<input type="number" name="index" class="reorder-items-widget-index">'
        drag_handle = '<div title="Drag me!" class="drag-handle">⬍</div>'
        self.assertInHTML(input, html)
        self.assertNotIn(drag_handle, html)
