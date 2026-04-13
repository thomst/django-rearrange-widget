from django import forms
from rearrange_widget.widgets import RearrangeWidget


class ItemForm(forms.ModelForm):
    """
    ModelForm for items using the rearrange-widget for the index field.
    """
    class Meta:
        widgets={'index': RearrangeWidget()}
