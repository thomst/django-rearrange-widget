from django.forms import NumberInput


class RearrangeWidget(NumberInput):
    """
    A widget that allows to move items up and down within a listing with an
    editable index field.
    """
    template_name = 'forms/widgets/rearrange-widget.html'

    class Media:
        css = {'all': ('css/rearrange-widget.css',)}
        js = ('js/rearrange-widget.js',)

    def build_attrs(self, base_attrs, extra_attrs):
        # We add hidden as css class to the widget. Since using a HiddenInput as
        # base class would hide the whole table cell, not only the input.
        attrs = super().build_attrs(base_attrs, extra_attrs)
        css_classes = attrs['class'].split(' ') if attrs.get('class') else []
        css_classes += ['hidden', 'rearrange-widget-index']
        attrs['class'] = ' '.join(css_classes)
        return attrs
