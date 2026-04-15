from django import forms
from reorder_items_widget.widgets import ReorderItemsWidget


class ItemForm(forms.ModelForm):
    """
    ModelForm for items using the reorder-items-widget for the index field.
    """
    class Meta:
        widgets={'index': ReorderItemsWidget()}
