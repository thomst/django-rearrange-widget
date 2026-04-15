from django.test import TestCase
from .widgets import ReorderItemsWidget

# Just for coverage score.
from . import __version__


class WidgetTestCase(TestCase):
    def test_widget(self):
        widget = ReorderItemsWidget()
        css_classes = widget.build_attrs(dict(), dict())['class']
        self.assertIn('hidden', css_classes)
        self.assertIn('reorder-items-widget-index', css_classes)
