from django.forms import NumberInput


class ReorderItemsWidget(NumberInput):
    """
    A widget that allows to move items up and down within a listing with an
    editable index field.
    """
    template_name = 'forms/widgets/reorder-items-widget.html'

    class Media:
        css = {'all': ('css/reorder-items-widget.css',)}
        js = ('js/reorder-items-widget.js',)

    def build_attrs(self, base_attrs, extra_attrs):
        attrs = super().build_attrs(base_attrs, extra_attrs)
        css_classes = attrs['class'].split(' ') if attrs.get('class') else []
        css_classes += ['reorder-items-widget-index']
        attrs['class'] = ' '.join(css_classes)
        return attrs
