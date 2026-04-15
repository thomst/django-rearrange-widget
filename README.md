# Welcome to django-reorder-items-widget

[![Tests](https://github.com/thomst/django-reorder-items-widget/actions/workflows/tests.yml/badge.svg)](https://github.com/thomst/django-reorder-items-widget/actions/workflows/tests.yml)
[<img src="https://coveralls.io/repos/github/thomst/django-reorder-items-widget/badge.svg?branch=main">](https://coveralls.io/github/thomst/django-reorder-items-widget?branch=main)
[<img src="https://img.shields.io/badge/python-3-blue">](https://img.shields.io/badge/python-3-blue)
[<img src="https://img.shields.io/badge/django-3.2%20%7C%204.0%20%7C%204.1%20%7C%204.2%20%7C%205.0%20%7C%205.1%20%7C%205.2%20%7C%206.0-orange">](https://img.shields.io/badge/django-3.2%20%7C%204.0%20%7C%204.1%20%7C%204.2%20%7C%205.0%20%7C%205.1%20%7C%205.2%20%7C%206.0-orange)


## Description

Reorder your items by simply dragging them to their new position. This works
fine within django admin's changelists or inline model forms.

All you need to do is to use an editable index field with the famous
`ReorderItemsWidget` of this app.


## Installation

Install via pip:
```
pip install django-reorder-items-widget
```

## Setup

Add `reorder_items_widget` to your `INSTALLED_APPS`:
```
INSTALLED_APPS = [
    'reorder_items_widget',
    ...
]
```

Add a index field to your model:
```
class Item(models.Model):
    index = models.PositiveSmallIntegerField()
    ...
    class Meta:
        ordering = ('index',)
```

Using the ReorderItemsWidget with your index field only makes sense in result
lists or inline modeladmin forms. A simple way to put the widget in place is a
custom model form:
```
class ItemModelFormForLists(forms.ModelForm):
    class Meta:
        widgets={'index': ReorderItemsWidget()}
```

Now you can use this form with your changelist by overwriting the
`get_changelist_form` method of your model admin:
```
class BaseItemAdmin(admin.ModelAdmin):
    list_editable = ("index",)
    list_display = ("index", ...)

    def get_changelist_form(self, request, **kwargs):
        kwargs.setdefault('form', ItemForm)
        return super().get_changelist_form(request, **kwargs)
```

**_NOTE:_** Mind that your index field must be editable.

To use the widget with your inline modeladmin simple at your form to the
`TabularInline` inline class:
```
class BaseItemInline(admin.TabularInline):
    form = ItemForm
    fields = ("index", ...)
    ...
```

That's it.

## Caveats

The widget will always number your items sequentially. Reordering items in a
filtered list might be have unexpected results. Paging however should not be a
problem since indexes are updated using the lowest one as base.

## General considerations on switching index values

There is a general problem with switching values on a unique index field: In
mysql like databases you will run into a constraint violation - even if you
update all items in a single update transaction.

To work around this you can either obmit the unique constraint. Or implement a
complex saving logic like saving changed indexes as negative values first and
update them to their positiv counterpart afterwards.